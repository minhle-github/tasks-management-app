export interface User {
  _id: string,
  firstname: string,
  lastname: string,
  readonly username: string,
  password: string,
  email: string,
  roles: {
    User: number,
    Editor?: number,
    Admin?: number
  }
  createdAt: number
}
export type UsersResponse = User[]