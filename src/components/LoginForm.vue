<template>
  <div>
    <el-dialog title="登录" :visible.sync="formVisible">
      <el-form :rules="rules" ref="loginForm" :model="loginForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input
            placeholder="请输入用户名"
            v-model="loginForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            placeholder="请输入密码"
            show-password
            v-model="loginForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('loginForm')"
          >登录</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crypto from 'crypto'
import { userApi } from '../router/api.js'

export default {
  data () {
    var loginForm = {
      username: '',
      password: ''
    }

    // 验证用户名的函数
    var nameValidator = (rule, value, callback) => {
      // 用户名正则
      var uPattern = /^[a-zA-Z0-9_-]$/
      if (uPattern.test(value)) {
        return callback(new Error('用户名不能包含特殊符号'))
      }
      callback()
    }

    var passwordValidator = (rule, value, callback) => {
      // // 密码正则，至少包含数字和小写字母
      // var pPattern = /^.*(?=.*\d)(?=.*[a-z]).*$/
      // if (pPattern.test(value)) {
      //   return callback(new Error('密码需要包含数字和小写字母'))
      // }
      callback()
    }

    return {
      formVisible: false,
      loginForm: loginForm,
      formLabelWidth: '120px',
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur'
          },
          { validator: nameValidator, trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          { min: 6, message: '密码不少于6个字符', trigger: 'blur' },
          { validator: passwordValidator, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
  },
  methods: {
    openForm () {
      this.formVisible = true
    },
    closeForm () {
      this.formVisible = false
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果验证通过了
          const md5 = crypto.createHash('md5')
          md5.update(this.loginForm.password)
          const md5password = md5.digest('hex')
          var formData = {
            username: this.loginForm.username,
            password: md5password
          }
          this.$post(userApi.userLoginApi, formData).then(res => {
            // 如果存在，说明登录成功
            if (res.data.uid) {
              this.resetForm('loginForm')
              this.formVisible = false
              this.$store.dispatch('setLoginUser', res.data.userSession)
              this.$store.dispatch('setToken', res.data.token)
              this.$emit('loginSuccess')
            }
          })
        }
      })
    }
  }
}
</script>
