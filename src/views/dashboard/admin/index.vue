<template>
  <div class="app-container">
    <el-row v-permission="['admin']">
      <el-col :sm="12" :lg="6">
        <el-result icon="success" title="Success Tip" sub-title="Please follow the instructions">
          <template #extra>
            <el-button type="primary">Back</el-button>
          </template>
        </el-result>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-result icon="warning" title="Warning Tip" sub-title="Please follow the instructions">
          <template #extra>
            <el-button type="primary">Back</el-button>
          </template>
        </el-result>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-result icon="error" title="Error Tip" sub-title="Please follow the instructions">
          <template #extra>
            <el-button type="primary">Back</el-button>
          </template>
        </el-result>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-result icon="info" title="Info Tip">
          <template #sub-title>
            <p>Using slot as subtitle</p>
          </template>
          <template #extra>
            <el-button type="primary">Back</el-button>
          </template>
        </el-result>
      </el-col>
    </el-row>
    <el-empty v-permission="['customer']" description="You are editor" />
  </div>
</template>

<style lang="scss" scoped>
.center {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
