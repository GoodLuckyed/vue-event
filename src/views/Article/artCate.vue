<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateBtnFn">添加分类</el-button>
      </div>
      <el-table style="width: 100%" :data="cateList" border stripe>
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateCateFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="removeFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="isEdit ? '编辑文章分类' : '添加文章分类'" :visible.sync="addVisible" width="35%" @close="dialogCloseFn">
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="addFn">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, addArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api'

export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [],
      addVisible: false,
      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: { // 添加表单的验证规则对象
        cate_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          {
            required: true,
            message: '请输入分类别名',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      },
      editId: '', // 要修改的文章id
      isEdit: false // 保存编辑状态(false新增, true编辑)
    }
  },
  created () {
    this.initCateListFn()
  },
  methods: {
    async initCateListFn () { // 获取文章分类
      // 调用文章接口分类的请求方法
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    cancelFn () {
      this.addVisible = false
    },
    addFn () { // 添加文章分类
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            // 调用更新分类的接口方法
            const { data: res } = await updateArtCateAPI({ id: this.editId, ...this.addForm })
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 调用添加分类的接口方法
            const { data: res } = await addArtCateAPI(this.addForm)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          }
          // 重新查询所有数据
          this.initCateListFn()
          this.addVisible = false
        } else {
          return false
        }
      })
    },
    dialogCloseFn () { // 重置表单
      this.$refs.addRef.resetFields()
    },
    updateCateFn (obj) { // 表单数据回显
      this.addVisible = true
      this.isEdit = true
      this.editId = obj.id // 保存要编辑的文章分类ID
      // 数据回显
      this.$nextTick(() => {
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    addCateBtnFn () { // 添加分类->点击出对话框
      this.addVisible = true // 让对话框出现
      this.editId = '' // 编辑的文章分类id设置无
      this.isEdit = false // 编辑的状态关闭
    },
    removeFn (id) { // 删除文章分类
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (id) {
          // 调用删除分类的接口
          const { data: res } = await delArtCateAPI(id)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          // 重新查询所有数据
          this.initCateListFn()
        } else {
          return false
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
