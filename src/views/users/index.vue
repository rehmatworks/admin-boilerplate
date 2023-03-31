<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createUserDataApi, deleteUserDataApi, updateUserDataApi, getUserDataApi } from "@/api/users"
import { type GetUserData } from "@/api/users/types/users"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { useUserStore } from "@/store/modules/user"


defineOptions({
  name: "ManageUsers"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  email: "",
  first_name: "",
  last_name: "",
  password: ""
})
const formRules: FormRules = reactive({
  email: [{ required: true, trigger: "blur", message: "Email is required." }],
  password: [{ required: true, trigger: "blur", message: "Password is required." }],
  first_name: [{ required: true, trigger: "blur", message: "First name is required." }],
  last_name: [{ required: true, trigger: "blur", message: "Last name is required." }],
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createUserDataApi(formData).then(() => {
          ElMessage.success("User has been added successfully.")
          dialogVisible.value = false
          getUsersData()
        })
      } else {
        updateUserDataApi(formData, currentUpdateId.value).then(() => {
          ElMessage.success("User has been updated successfully")
          dialogVisible.value = false
          getUsersData()
        })
      }
    } else {
      return false
    }
  })
}

const handleSort = (event: any) => {
  if(event.order == 'ascending') {
    searchData.ordering = event.prop
  } else {
    searchData.ordering = `-${event.prop}`
  }
  getUsersData()
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.email = ""
  formData.first_name = ""
  formData.last_name = ""
  formData.password = ""
}
//#endregion

//#region 删
const handleDelete = (row: GetUserData) => {
  ElMessageBox.confirm(`Warning: This will permanently delete the user (${row.full_name}) and all associated data. Proceed?`, "Confirm Delete", {
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    type: "warning"
  }).then(() => {
    deleteUserDataApi(row.id).then(() => {
      ElMessage.success("User has been deleted!")
      getUsersData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: GetUserData) => {
  currentUpdateId.value = row.id
  formData.email = row.email
  formData.first_name = row.first_name
  formData.last_name = row.last_name
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<GetUserData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  search: "",
  ordering: ""
})
const getUsersData = () => {
  loading.value = true
  getUserDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    search: searchData.search || undefined,
    ordering: searchData.ordering || ''
  })
    .then((res) => {
      paginationData.total = res.data.count
      tableData.value = res.data.results
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getUsersData()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getUsersData()
  }
  paginationData.currentPage = 1
}
const handleRefresh = () => {
  getUsersData()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getUsersData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="search" label="Search">
          <el-input v-model="searchData.search" placeholder="Search users" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">Search</el-button>
          <el-button :icon="Refresh" @click="resetSearch">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">Add New</el-button>
        </div>
        <div>
          <el-tooltip content="Export Report">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="Reload">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @sort-change="handleSort" size="large">
          <el-table-column prop="full_name" label="Full Name" align="left" />
          <el-table-column sortable="custom" prop="email" label="Email Address" align="left" />
          <el-table-column sortable="custom" prop="date_joined" label="Date Joined" align="left">
            <template #default="scope">{{ new Date(scope.row.date_joined).toUTCString() }}</template>
          </el-table-column>
          <el-table-column fixed="right" label="" width="200" align="left">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">Edit</el-button>
              <el-button type="danger" :disabled="useUserStore().email == scope.row.email" text bg size="small" @click="handleDelete(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? 'Add User' : 'Update User'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="email" label="Email">
          <el-input v-model="formData.email" placeholder="Email" />
        </el-form-item>
        <el-form-item prop="first_name" label="First Name">
          <el-input v-model="formData.first_name" placeholder="First name" />
        </el-form-item>
        <el-form-item prop="last_name" label="Last Name">
          <el-input v-model="formData.last_name" placeholder="Last name" />
        </el-form-item>
        <el-form-item prop="password" label="Password" v-if="currentUpdateId === undefined">
          <el-input v-model="formData.password" placeholder="Password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleCreate">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
