/* eslint-disable no-unused-vars */

declare namespace HyperAPI {
  interface IUser {
    id: number
    name: string
    password: string
    createdAt: Date
    updatedAt: Date
  }

  interface IUserPayload {
    id: number
    name: string
  }

  interface IBaseResponse {
    error?: string
    message?: string
  }

  interface IUserResponse extends IBaseResponse {
    user: IUser[]
  }
}

declare namespace Express {
  interface Request {
    user: HyperAPI.IUserPayload
  }
}
