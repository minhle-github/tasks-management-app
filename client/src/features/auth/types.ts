export interface AuthState {
  token: string,
  currentUser?: string
}

export interface LoginInput {
  username: string,
  password: string
}

export interface RegisterInput {
  username: string,
  password: string,
  email: string,
  firstname: string,
  lastname: string
}

export interface Token {
  accessToken: string
}