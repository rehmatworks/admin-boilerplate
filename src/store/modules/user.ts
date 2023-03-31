import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
import { getToken, setRefreshToken, getRefreshToken, removeToken, setToken } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { loginApi, tokenRefreshApi, getUserInfoApi } from "@/api/login"
import { type ILoginRequestData, type IRefreshRequestData } from "@/api/login/types/login"
import { type RouteRecordRaw } from "vue-router"
import asyncRouteSettings from "@/config/async-route"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const email = ref<string>("")
  const first_name = ref<string>("")

  const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = (loginData: ILoginRequestData) => {
    return new Promise((resolve, reject) => {
      loginApi({
        email: loginData.email,
        password: loginData.password
      })
        .then((res) => {
          setToken(res.data.access)
          setRefreshToken(res.data.refresh)
          token.value = res.data.access
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /** Token refresh */
  const refreshTok = () => {
    return new Promise((resolve, reject) => {
      const refreshToken = <string>(getRefreshToken() || "")
      tokenRefreshApi({refresh: refreshToken})
        .then((res) => {
          setToken(res.data.access)
          setRefreshToken(res.data.refresh)
          token.value = res.data.access
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  } 

  /** 获取用户详情 */
  const getInfo = () => {
    return new Promise((resolve, reject) => {
      getUserInfoApi()
        .then((res) => {
          const data = res.data
          email.value = data.email
          first_name.value = data.first_name
          // 验证返回的 roles 是否是一个非空数组
          if (data.roles && data.roles.length > 0) {
            roles.value = data.roles
          } else {
            // 塞入一个没有任何作用的默认角色，不然路由守卫逻辑会无限循环
            roles.value = asyncRouteSettings.defaultRoles
          }
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    await getInfo()
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
    _resetTagsView()
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }
  /** 重置 visited views 和 cached views */
  const _resetTagsView = () => {
    tagsViewStore.delAllVisitedViews()
    tagsViewStore.delAllCachedViews()
  }

  return { token, roles, email, first_name, setRoles, refreshTok, login, getInfo, changeRoles, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
