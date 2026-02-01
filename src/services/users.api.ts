import { api } from "../lib/api";
import type { User, CreateUserDto, UpdateUserDto } from "../types/auth";

export async function getUsersByCompany(companyId: string) {
  const { data } = await api.get<User[]>(`/companies/${companyId}/users`);
  return data;
}
export async function createUser(payload: CreateUserDto) {
  const { data } = await api.post<User>("/users", payload);
  return data;
}

export async function deleteUser(userId: string) {
  await api.delete(`/users/${userId}`);
}

export async function updateUser(userId: string, payload: UpdateUserDto) {
  const { data } = await api.patch<User>(`/users/${userId}`, payload);
  return data;
}
