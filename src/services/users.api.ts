import { api } from "../lib/api";
import type { User } from "../types/auth";

export async function getUsersByCompany(companyId: string) {
  const { data } = await api.get<User[]>(`/companies/${companyId}/users`);
  return data;
}
