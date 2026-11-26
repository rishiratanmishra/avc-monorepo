import { createApiClient, type ApiClient } from "@repo/api-client";
import type {
  CreateAccountInput,
  EmailInput,
  LoginInput,
  SelectWorkspaceInput,
} from "@repo/contracts";

const api: ApiClient = createApiClient({ baseUrl: "" });

export const LoginUser = (payload: LoginInput) => api.login(payload);

export const LogoutUser = () => api.logout();

export const RegisterUser = async (payload: CreateAccountInput) =>
  (await api.register(payload)).message;

export const RequestPasswordReset = async (payload: EmailInput) =>
  (await api.requestPasswordReset(payload.email)).message;

export const GetAccessContext = () => api.getAccessContext();

export const SelectWorkspace = (payload: SelectWorkspaceInput) => api.selectWorkspace(payload);

export const AcceptInvitation = (token: string) => api.acceptInvitation({ token });
