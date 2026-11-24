import {
  AccessContextSchema,
  CreateAccountSchema,
  EmailInputSchema,
  LoginSchema,
  MessageResponseSchema,
  SelectWorkspaceSchema,
  type AccessContext,
  type AuthenticatedUser,
  type CreateAccountInput,
  type LoginInput,
  type MessageResponse,
  type SelectWorkspaceInput,
} from "@repo/contracts";
import { ApiErrorResponseSchema } from "@repo/contracts/models/api";
import { AuthenticatedUserSchema } from "@repo/contracts/models/user";
import { z } from "zod";

export type ApiFetch = typeof fetch;

export const API_SESSION_COOKIE = "avc_session";

export interface ApiClientOptions {
  baseUrl: string;
  fetchImpl?: ApiFetch;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const NoContentSchema = z.undefined();

export function createApiClient(options: ApiClientOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, "");

  async function request<T>(
    path: string,
    init: RequestInit,
    schema: z.ZodType<T>,
    cookieHeader?: string,
  ): Promise<T> {
    const headers = new Headers(init.headers);
    if (init.body !== undefined) {
      headers.set("content-type", "application/json");
    }
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }

    let response: Response;
    try {
      response = await fetchImpl(`${baseUrl}${path}`, {
        ...init,
        headers,
        credentials: cookieHeader ? "omit" : "include",
        cache: "no-store",
      });
    } catch {
      throw new ApiError(0, "NETWORK_ERROR", "The service is unavailable");
    }

    const text = await response.text();
    const payload = text.length > 0 ? JSON.parse(text) : undefined;

    if (!response.ok) {
      const parsed = ApiErrorResponseSchema.safeParse(payload);
      throw new ApiError(
        response.status,
        parsed.success ? parsed.data.error.code : "REQUEST_FAILED",
        parsed.success ? parsed.data.error.message : "The request could not be completed",
        parsed.success ? parsed.data.error.details : undefined,
      );
    }

    return schema.parse(payload);
  }

  function json(method: string, path: string, body?: unknown): RequestInit {
    return {
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    };
  }

  return {
    login(input: LoginInput): Promise<AuthenticatedUser> {
      return request(
        "/api/auth/login",
        json("POST", "/api/auth/login", LoginSchema.parse(input)),
        AuthenticatedUserSchema,
      );
    },

    register(input: CreateAccountInput): Promise<MessageResponse> {
      return request(
        "/api/auth/register",
        json("POST", "/api/auth/register", CreateAccountSchema.parse(input)),
        MessageResponseSchema,
      );
    },

    async logout(cookieHeader?: string): Promise<void> {
      await request("/api/auth/logout", json("POST", "/api/auth/logout"), NoContentSchema, cookieHeader);
    },

    requestPasswordReset(email: string): Promise<MessageResponse> {
      const path = "/api/auth/request-password-reset";
      return request(
        path,
        json("POST", path, EmailInputSchema.parse({ email })),
        MessageResponseSchema,
      );
    },

    getAccessContext(cookieHeader?: string): Promise<AccessContext> {
      return request("/api/access/context", json("GET", "/api/access/context"), AccessContextSchema, cookieHeader);
    },

    selectWorkspace(
      input: SelectWorkspaceInput,
      cookieHeader?: string,
    ): Promise<AccessContext> {
      const path = "/api/access/workspace";
      return request(
        path,
        json("POST", path, SelectWorkspaceSchema.parse(input)),
        AccessContextSchema,
        cookieHeader,
      );
    },

    clearWorkspace(cookieHeader?: string): Promise<AccessContext> {
      const path = "/api/access/workspace";
      return request(path, json("DELETE", path), AccessContextSchema, cookieHeader);
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

export function createServerApiClient(): ApiClient {
  return createApiClient({
    baseUrl: process.env.API_UPSTREAM ?? "http://127.0.0.1:4000",
  });
}
