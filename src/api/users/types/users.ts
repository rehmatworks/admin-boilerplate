export interface CreateUserRequestData {
  email: string
  first_name: string
  last_name: string
  password: string
}

export interface UpdateUserRequestData {
  email: string
  first_name: string
  last_name: string
  password?: string
}

export interface GetUserRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  search?: string
}

export interface GetUserData {
  id: string,
  email: string,
  full_name: string,
  first_name: string,
  last_name: string,
  date_joined: Date
}

export type GetUserResponseData = IApiResponseData<{
  results: GetUserData[]
  count: number,
  next: number,
  previous: number
}>
