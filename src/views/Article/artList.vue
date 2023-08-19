<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="item in cate_list" :label="item.cate_name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initArtListFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetListFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn" @closed="onDialogClosedFn">
          发表文章
        </el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%;" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="getDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="danger" size="mini" @click="removeFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose">
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
            <el-option v-for="item in cate_list" :label="item.cate_name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor v-model="pubForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面">
          <!-- 用来显示封面的图片 -->
          <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef"/>
          <br/>
          <!-- 文件选择框，默认被隐藏 -->
          <input type="file" style="display: none;" accept="image/*" ref="iptFileRef" @change="onCoverChangeFn"/>
          <!-- 选择封面的按钮 -->
          <el-button type="success" @click="chooseimgFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>
      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- 文章的封面 -->
      <img :src="baseURL + artDetail.cover_img" alt=""/>
      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI, getArticleListAPI, getArticleDetailFn, delArticleAPI } from '@/api'
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
import { baseURL } from '@/utils/request'

export default {
  name: 'ArtList',
  data () {
    return {
      baseURL,
      cate_list: [], // 文章分类
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 5,
        cate_id: '',
        state: ''
      },
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
      artDetail: {}, // 文章的详情信息对象
      detailVisible: false, // 控制文章详情对话框的显示与隐藏
      pubForm: { // 表单的数据对象
        title: '', // 文章标题
        cate_id: '', // 分类id
        content: '', // 文章内容
        cover_img: null, // 用户选择的封面图片
        state: '' // 文章的发布状态，可选值有两个：草稿、已发布
      },
      pubFormRules: {
        title: [
          {
            required: true,
            message: '请输入文章标题',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          {
            required: true,
            message: '请选择文章标题',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入文章内容',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.initCateList()
    this.initArtListFn()
  },
  methods: {
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    // 对话框关闭前的回调
    async handleClose (done) { // done的作用:调用才会放行,让对话框关闭
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') return
      // 取消了关闭-阻止住, 什么都不干
      // 确认关闭
      done()
      this.resetPubFn()
    },
    // 初始化文章分类的列表数据
    async initCateList () {
      const { data: res } = await getArtCateListAPI()
      if (res.code === 0) {
        this.cate_list = res.data
      }
    },
    chooseimgFn () { // 模拟**文件选择框**的点击事件
      // eslint-disable-next-line no-unused-expressions
      this.$refs.iptFileRef.click()
    },
    onCoverChangeFn (e) { // 封面选择改变的事件
      // 获取用户选择的文件列表
      const files = e.target.files
      if (files.length === 0) {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
    },
    pubArticleFn (state) { // 文章发布
      this.pubForm.state = state
      this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完善文章信息！')
        if (!this.pubForm.cover_img) return this.$message.error('请完善文章封面！')
        const fd = new FormData()
        Object.keys(this.pubForm).forEach((key) => {
          fd.append(key, this.pubForm[key])
        })
        // 调用发布文章接口
        const { data: res } = await uploadArticleAPI(fd)
        if (res.code !== 0) return this.$message.error('文章发布失败！')
        this.$message.success('文章发布成功')
        // 关闭对话框
        this.pubDialogVisible = false
        // 重新查新数据
        this.initArtListFn()
        // 表单重置
        this.resetPubFn()
      })
    },
    onDialogClosedFn () { // 关闭发表文章框的回调
      this.$refs.pubFormRef.resetFields()
      // 因为这2个变量对应的标签不是表单绑定的, 所以需要单独控制
      this.pubForm.content = ''
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    async initArtListFn () { // 初始化文章列表
      // 调用获取文章列表的接口
      const { data: res } = await getArticleListAPI(this.q)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.artList = res.data
      this.total = res.total
    },
    resetListFn () { // 重置筛选表单
      this.q.pagesize = 5
      this.q.pagenum = 1
      this.q.cate_id = ''
      this.q.state = ''
      // 重新发送请求
      this.initArtListFn()
    },
    resetPubFn () { // 重置发布表单
      this.pubForm = {
        title: '',
        cate_id: '',
        content: '',
        cover_img: null,
        state: ''
      }
    },
    handleCurrentChangeFn (newPage) { // pageSize 改变时会触发
      this.q.pagenum = newPage
      this.initArtListFn()
    },
    handleSizeChangeFn (newSzie) { // currentPage 改变时会触发
      this.q.pagesize = newSzie
      // 默认展示第一页数据
      this.q.pagenum = 1
      this.initArtListFn()
    },
    async getDetailFn (id) { // 获取文章详情
      // 调用获取文章详情的接口
      const { data: res } = await getArticleDetailFn(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.artDetail = res.data
      // 展示对话框
      this.detailVisible = true
    },
    async removeFn (id) { // 删除文章
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') return
      // 调用删除文章的接口
      const { data: res } = await delArticleAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新查询数据
      this.resetListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;

  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
