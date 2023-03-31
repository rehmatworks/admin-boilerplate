/** 统一处理 Cookie */

import CacheKey from "@/constants/cacheKey"
import Cookies from "js-cookie"

export const getToken = () => {
  return Cookies.get(CacheKey.TOKEN)
}
export const setToken = (access: string) => {
  Cookies.set(CacheKey.TOKEN, access)
}
export const removeToken = () => {
  Cookies.remove(CacheKey.TOKEN)
  Cookies.remove(CacheKey.REFRESH_TOKEN)
}

export const getRefreshToken = () => {
  return Cookies.get(CacheKey.REFRESH_TOKEN)
}
export const setRefreshToken = (refresh: string) => {
  Cookies.set(CacheKey.REFRESH_TOKEN, refresh)
}
