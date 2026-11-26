import {
  AcceptInvitationSchema,
  AccessContextSchema,
  AdminCreateUserSchema,
  AdminUserViewSchema,
  AssignableHospitalRoleCodeSchema,
  CreateAccountSchema,
  CreateHospitalSchema,
  EmailInputSchema,
  HospitalMembershipViewSchema,
  HospitalSummarySchema,
  InvitationResultSchema,
  InviteMemberSchema,
  LoginSchema,
  MessageResponseSchema,
  PlatformRoleCodeSchema,
  SelectWorkspaceSchema,
  UpdateHospitalStatusSchema,
  UpdateMembershipStatusSchema,
  type AcceptInvitationInput,
  type AccessContext,
  type AdminCreateUserInput,
  type AdminUserView,
  type AssignableHospitalRoleCode,
  type AuthenticatedUser,
  type CreateAccountInput,
  type CreateHospitalInput,
  type HospitalMembershipView,
  type InvitationResultContract,
  type InviteMemberInput,
  type LoginInput,
  type MessageResponse,
  type PlatformRoleCode,
  type SelectWorkspaceInput,
  type UpdateHospitalStatusInput,
  type UpdateMembershipStatusInput,
} from "@repo/contracts";
import { ApiErrorResponseSchema } from "@repo/contracts/models/api";
import { AuthenticatedUserSchema } from "@repo/contracts/models/user";
import { z } from "zod";

export type ApiFetch = typeof fetch;

export const API_SESSION_COOKIE = "avc_session";

export interface ApiClientOptions {
  baseUrl: string;
  fetchImpl?: ApiFetch;
  origin?: string;
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
    if (options.origin) {
      headers.set("origin", options.origin);
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
      await request(
        "/api/auth/logout",
        json("POST", "/api/auth/logout"),
        NoContentSchema,
        cookieHeader,
      );
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
      return request(
        "/api/access/context",
        json("GET", "/api/access/context"),
        AccessContextSchema,
        cookieHeader,
      );
    },

    selectWorkspace(input: SelectWorkspaceInput, cookieHeader?: string): Promise<AccessContext> {
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

    acceptInvitation(
      input: AcceptInvitationInput,
      cookieHeader?: string,
    ): Promise<InvitationResultContract> {
      const path = "/api/access/invitations/accept";
      return request(
        path,
        json("POST", path, AcceptInvitationSchema.parse(input)),
        InvitationResultSchema,
        cookieHeader,
      );
    },

    listHospitals(cookieHeader?: string) {
      const path = "/api/platform/hospitals";
      return request(path, json("GET", path), z.array(HospitalSummarySchema), cookieHeader);
    },

    createHospital(input: CreateHospitalInput, cookieHeader?: string) {
      const path = "/api/platform/hospitals";
      return request(
        path,
        json("POST", path, CreateHospitalSchema.parse(input)),
        HospitalSummarySchema,
        cookieHeader,
      );
    },

    async updateHospitalStatus(
      hospitalId: string,
      input: UpdateHospitalStatusInput,
      cookieHeader?: string,
    ): Promise<void> {
      const path = `/api/platform/hospitals/${z.uuid().parse(hospitalId)}/status`;
      await request(
        path,
        json("PATCH", path, UpdateHospitalStatusSchema.parse(input)),
        NoContentSchema,
        cookieHeader,
      );
    },

    listPlatformUsers(cookieHeader?: string): Promise<AdminUserView[]> {
      const path = "/api/platform/users";
      return request(path, json("GET", path), AdminUserViewSchema.array(), cookieHeader);
    },

    createPlatformUser(input: AdminCreateUserInput, cookieHeader?: string): Promise<AdminUserView> {
      const path = "/api/platform/users";
      return request(
        path,
        json("POST", path, AdminCreateUserSchema.parse(input)),
        AdminUserViewSchema,
        cookieHeader,
      );
    },

    async assignPlatformUserRole(
      userId: string,
      roleCode: PlatformRoleCode,
      cookieHeader?: string,
    ): Promise<void> {
      const path = `/api/platform/users/${z.uuid().parse(userId)}/roles/${PlatformRoleCodeSchema.parse(roleCode)}`;
      await request(path, json("PUT", path), NoContentSchema, cookieHeader);
    },

    async revokePlatformUserRole(
      userId: string,
      roleCode: PlatformRoleCode,
      cookieHeader?: string,
    ): Promise<void> {
      const path = `/api/platform/users/${z.uuid().parse(userId)}/roles/${PlatformRoleCodeSchema.parse(roleCode)}`;
      await request(path, json("DELETE", path), NoContentSchema, cookieHeader);
    },

    listHospitalMemberships(
      hospitalId: string,
      cookieHeader?: string,
    ): Promise<HospitalMembershipView[]> {
      const path = `/api/hospitals/${z.uuid().parse(hospitalId)}/memberships`;
      return request(path, json("GET", path), z.array(HospitalMembershipViewSchema), cookieHeader);
    },

    inviteHospitalMember(
      hospitalId: string,
      input: InviteMemberInput,
      cookieHeader?: string,
    ): Promise<MessageResponse> {
      const path = `/api/hospitals/${z.uuid().parse(hospitalId)}/invitations`;
      return request(
        path,
        json("POST", path, InviteMemberSchema.parse(input)),
        MessageResponseSchema,
        cookieHeader,
      );
    },

    updateHospitalMembershipStatus(
      hospitalId: string,
      membershipId: string,
      input: UpdateMembershipStatusInput,
      cookieHeader?: string,
    ): Promise<HospitalMembershipView> {
      const path = `/api/hospitals/${z.uuid().parse(hospitalId)}/memberships/${z.uuid().parse(membershipId)}`;
      return request(
        path,
        json("PATCH", path, UpdateMembershipStatusSchema.parse(input)),
        HospitalMembershipViewSchema,
        cookieHeader,
      );
    },

    async addHospitalMembershipRole(
      hospitalId: string,
      membershipId: string,
      roleCode: AssignableHospitalRoleCode,
      cookieHeader?: string,
    ): Promise<void> {
      const path = `/api/hospitals/${z.uuid().parse(hospitalId)}/memberships/${z.uuid().parse(membershipId)}/roles/${AssignableHospitalRoleCodeSchema.parse(roleCode)}`;
      await request(path, json("PUT", path), NoContentSchema, cookieHeader);
    },

    async removeHospitalMembershipRole(
      hospitalId: string,
      membershipId: string,
      roleCode: AssignableHospitalRoleCode,
      cookieHeader?: string,
    ): Promise<void> {
      const path = `/api/hospitals/${z.uuid().parse(hospitalId)}/memberships/${z.uuid().parse(membershipId)}/roles/${AssignableHospitalRoleCodeSchema.parse(roleCode)}`;
      await request(path, json("DELETE", path), NoContentSchema, cookieHeader);
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

export function createServerApiClient(): ApiClient {
  return createApiClient({
    baseUrl: process.env.API_UPSTREAM ?? "http://127.0.0.1:4000",
    origin: process.env.APP_ORIGIN ?? "http://localhost:3000",
  });
}
