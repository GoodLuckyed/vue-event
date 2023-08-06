<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <el-form ref="form" :model="regForm" :rules="rulesObj">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="regForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="regForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" placeholder="请再次输入密码" v-model="regForm.repassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-reg" type="primary" @click="registerFn">注册</el-button>
          <el-link type="primary" @click="$router.push('/login')">已有账号？去登录</el-link>
        </el-form-item>
      </el-form>
      <!-- 注册的表单区域 -->
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api'
export default {
  name: 'my-register',
  data () {
    const samePwdFn = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
        callback(new Error('两次输入的密码不一致!'))
      } else {
        // 如果验证成功，则直接调用 callback 回调函数即可。
        callback()
      }
    }
    return { // 注册表单的数据对象
      regForm: {
        username: '',
        password: '',
        repassword: ''
      },
      rulesObj: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          }
        ],
        repassword: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          },
          {
            validator: samePwdFn,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    registerFn () {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        // 获取注册用户输入的账号密码,调用接口向后台发送请求
        const { data: res } = await registerAPI(this.regForm)
        // 注册失败
        if (res.code !== 0) return this.$message.error(res.message)
        // 注册成功
        this.$message.success(res.message)
        // 跳转到灯登录页
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%
}

.reg-box {
  width: 400px;
  height: 335px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0 30px;
  box-sizing: border-box;
}

.title-box {
  height: 60px;
  background: url('../../assets/images/login_title.png') center no-repeat;
}

.btn-reg {
  width: 100%;
}
</style>
