import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage } from "element-plus"
import { get } from "lodash-es"
import { getToken } from "./cache/cookies"



let isRefreshing = false;

/** 创建请求实例 */
function createService() {
  // 创建一个 Axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    (config) => config,
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // Status 是 HTTP 状态码
      const status = get(error, "response.status")

      // Request path
      const requestPath = error.config.url;

      // Original request
      const originalRequest = error.config;

      switch (status) {
        case 400:
          error.message = "Bad request."
          break
        case 401:
          // Force logout if token is invalid.
          if(requestPath == 'auth/token/') {
            error.message = 'Invalid credentials.'
          } else {
            useUserStoreHook().logout()
            location.reload()
          }
          break
        case 403:
          if(error.response.data.code == 'token_not_valid') {
            if(!originalRequest._retry) {
              if(!isRefreshing) {
                isRefreshing = true;
                useUserStoreHook().refreshTok()
                service.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
                isRefreshing = false;
              }
            }

            // Clone the original request and update the Authorization header
            const requestWithNewToken = {
              ...originalRequest,
              headers: {
                ...originalRequest.headers,
                Authorization: 'Bearer ' + getToken(), // Replace getToken() with the new access token
              },
              _retry: true,
            };

            // Retry the original request with the new access token
            return service(requestWithNewToken);
          } else {
            error.message = "Forbidden access." 
          }
          break
        case 404:
          error.message = "Not found."
          break
        case 408:
          error.message = "Request timeout."
          break
        case 500:
          error.message = "Server error."
          break
        case 501:
          error.message = "Not implemented."
          break
        case 502:
          error.message = "Bad gateway."
          break
        case 503:
          error.message = "Service unavailable."
          break
        case 504:
          error.message = "Gateway timeout."
          break
        case 505:
          error.message = "HTTP version not supported."
          break
        case 429:
          error.message = "Too many requests."
          break
        default:
          break
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

/** 创建请求方法 */
function createRequestFunction(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const configDefault = {
      headers: {
        // 携带 Token
        Authorization: "Bearer " + getToken(),
        "Content-Type": get(config, "headers.Content-Type", "application/json")
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    return service(Object.assign(configDefault, config))
  }
}

/** 用于网络请求的实例 */
export const service = createService()
/** 用于网络请求的方法 */
export const request = createRequestFunction(service)
