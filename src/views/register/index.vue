<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
import { type FormInstance, FormRules } from "element-plus"
import { type CreateUserRequestData } from "@/api/users/types/users"
import { createUserDataApi } from "@/api/users"
import { ElMessage } from "element-plus"

const router = useRouter()
const regFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)

/** 登录表单数据 */
const regForm: CreateUserRequestData = reactive({
  email: '',
  first_name: '',
  last_name: '',
  password: ''
})
/** 登录表单校验规则 */
const regFormRules: FormRules = {
  email: [{ required: true, message: "Email is required.", trigger: "blur" }],
  first_name: [{ required: true, message: "First name is required.", trigger: "blur" }],
  last_name: [{ required: true, message: "Last name is required.", trigger: "blur" }],
  password: [
    { required: true, message: "Password is required.", trigger: "blur" }
  ]
}
/** 登录逻辑 */
const handleRegister = () => {
  regFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      createUserDataApi(regForm).then(() => {
          ElMessage.success("Registration successful!")
          router.push({ path: "/login" })
        })
        .catch((err) => {
          console.log(err)
          regForm.password = ""
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
  <div class="register-container">
    <div class="login-card">
      <div class="title">
        <img src="@/assets/layout/logo-text-2.png" />
      </div>
      <div class="content">
        <el-form ref="regFormRef" :model="regForm" :rules="regFormRules" @keyup.enter="handleRegister">
          <el-form-item prop="email">
            <el-input
              v-model.trim="regForm.email"
              placeholder="Email"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="first_name">
            <el-input
              v-model.trim="regForm.first_name"
              placeholder="First name"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="last_name">
            <el-input
              v-model.trim="regForm.last_name"
              placeholder="Last name"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="regForm.password"
              placeholder="Password"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleRegister"> Sign up </el-button>
        </el-form>
        <div class="footer-links">
          <el-link :underline="false">
            <el-icon><Back /></el-icon>
            &nbsp;
            <router-link :to="{name: 'login'}">Back to log in</router-link>
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
.register-container {
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
