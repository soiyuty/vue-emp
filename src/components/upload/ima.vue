<template>
  <div>

    <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleFileChange"
    >
    <img v-if="previewUrl" :src="previewUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
  <button>提交</button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadFile, UploadFiles } from 'element-plus'

// 状态管理
const previewUrl = ref('')
const selectedFile = ref<File | null>(null)
const uploadProgress = ref(0)
const isUploading = ref(false)

// 文件选择处理
const handleFileChange = (file: UploadFile) => {
  selectedFile.value = file.raw as File
  previewUrl.value = URL.createObjectURL(file.raw as Blob)
}

    isUploading.value = true
    uploadProgress.value = 0

    // // 使用 XMLHttpRequest 实现进度监控
    // const xhr = new XMLHttpRequest()
    // xhr.open('POST', 'http://localhost:/comm/upImg', true)

    // // 进度事件处理
    // xhr.upload.addEventListener('progress', (e) => {
    //   if (e.lengthComputable) {
    //     uploadProgress.value = Math.round((e.loaded / e.total) * 100)
    //   }
    // })


  //   // 完成处理
  //   xhr.onload = () => {
  //     if (xhr.status === 200) {
  //       ElMessage.success('上传成功')
  //       // 这里处理返回数据，例如：
  //       // const response = JSON.parse(xhr.responseText)
  //       // previewUrl.value = response.fileUrl
  //     } else {
  //       ElMessage.error(`上传失败: ${xhr.statusText}`)
  //     }
  //   }
  //
  //   // 错误处理
  //   xhr.onerror = () => {
  //     ElMessage.error('网络错误，请检查连接')
  //   }
  //
  //   xhr.send(formData)
  // } catch (error) {
  //   ElMessage.error(`上传失败: ${error}`)
  // } finally {
  //   loading.close()
  //   isUploading.value = false
  //   setTimeout(() => uploadProgress.value = 0, 2000) // 2秒后隐藏进度条
  // }

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: contain;
}

.submit-btn {
  margin-top: 20px;
  width: 178px;
}

.progress-bar {
  margin-top: 10px;
  width: 178px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>