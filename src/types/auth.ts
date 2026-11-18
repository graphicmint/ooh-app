export interface AuthUser {
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  organization: string;
  loggedInAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}
