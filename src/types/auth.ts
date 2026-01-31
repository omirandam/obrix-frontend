export type User = {
  id: string;
  companyId: string;
  username: string;
  email: string;
  fullName: string;
};

export type Company = {
  id: string;
  name: string;
  legalName: string;
  rfc: string;
};

export type Module = {
  id?: string;
  key: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  url?: string;
};
export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
  company: Company;
  modules: Module[];
};
