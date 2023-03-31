export interface ICreateTableRequestData {
  email: string
  password: string
}

export interface IUpdateTableRequestData {
  id: string
  email: string
  password?: string
}

export interface IGetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  email?: string
  /** 查询参数：手机号 */
  phone?: string
}

export interface IGetTableData {
  createTime: string
  email: string
  id: string
  phone: string
  roles: string
  status: boolean
  email: string
}

export type GetTableResponseData = IApiResponseData<{
  list: IGetTableData[]
  total: number
}>
