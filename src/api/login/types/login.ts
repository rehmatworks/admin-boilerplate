export interface ILoginRequestData {
  /** admin 或 editor */
  email: string
  /** 密码 */
  password: string
}

export interface IRefreshRequestData {
  refresh: string
}

export type LoginResponseData = IApiResponseData<{ access: string, refresh: string }>

export type UserInfoResponseData = IApiResponseData<{
  first_name: string; email: string; roles: string[] 
}>
