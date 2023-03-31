import { request } from "@/utils/service"
import type * as User from "./types/users"

/** 增 */
export function createUserDataApi(data: User.CreateUserRequestData) {
  return request({
    url: "auth/register/",
    method: "post",
    data
  })
}

/** 删 */
export function deleteUserDataApi(id: string) {
  return request({
    url: `auth/users/${id}/`,
    method: "delete"
  })
}

/** 改 */
export function updateUserDataApi(data: User.UpdateUserRequestData, id: string) {
  return request({
    url: `auth/users/${id}/`,
    method: "put",
    data
  })
}

/** 查 */
export function getUserDataApi(params: User.GetUserRequestData) {
  return request<User.GetUserResponseData>({
    url: "auth/users/",
    method: "get",
    params
  })
}
