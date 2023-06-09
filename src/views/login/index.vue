<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
import { type FormInstance, FormRules } from "element-plus"
import { type ILoginRequestData } from "@/api/login/types/login"

const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)

/** 登录表单数据 */
const loginForm: ILoginRequestData = reactive({
  email: "contact@rehmat.works",
  password: "asdf"
})
/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  email: [{ required: true, message: "Email is required.", trigger: "blur" }],
  password: [
    { required: true, message: "Password is required.", trigger: "blur" }
  ]
}
/** 登录逻辑 */
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login({
          email: loginForm.email,
          password: loginForm.password
        })
        .then(() => {
          router.push({ path: "/" })
        })
        .catch((err) => {
          console.log(err)
          loginForm.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      return false
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title">
        <img src="@/assets/layout/logo-text-2.png" />
      </div>
      <div class="content">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="email">
            <el-input
              v-model.trim="loginForm.email"
              placeholder="Email"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginForm.password"
              placeholder="Password"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin"> Sign in </el-button>
        </el-form>
        <div class="footer-links">
          <el-link :underline="false">
            <router-link :to="{name: 'register'}">Create Account</router-link>
          </el-link>
          &nbsp;
          <el-link :underline="false">
            <router-link :to="{name: 'register'}">Reset Password</router-link>
          </el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-links {
  text-align: center;
  margin-top: 30px;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .login-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
