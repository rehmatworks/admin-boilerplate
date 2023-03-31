import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 登录并返回 Token */
export function loginApi(data: Login.ILoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "auth/token/",
    method: "post",
    data
  })
}


export function tokenRefreshApi(data: Login.IRefreshRequestData) {
  return request<Login.LoginResponseData>({
    url: "auth/token/refresh/",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "auth/user/",
    method: "get"
  })
}
