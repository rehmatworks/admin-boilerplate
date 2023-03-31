<script lang="ts" setup>
import { h } from "vue"
import { useTheme } from "@/hooks/useTheme"
import { ElNotification } from "element-plus"
import en from "element-plus/lib/locale/lang/en"

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()
/** 将 Element Plus 的语言设置为中文 */
const locale = en

</script>

<template>
  <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>
