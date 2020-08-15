<template>
  <div class="topbar">
    <div class="topbar-left">
      <img class="avatar" src="../assets/logo.png"/>
      <span>user</span>
    </div>
    <div class="topbar-right">
      <span class="username">{{ username }}</span>

      <el-dropdown :hide-on-click="true" trigger="click">
        <span class="el-dropdown-link">
          <img class="logo" :src="avatar"/><i
          class="el-icon-arrow-down el-icon--right"
        ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
          ><span @click="openForm('LoginForm')">{{
              LoginTab
            }}</span></el-dropdown-item
          >
          <el-dropdown-item
          ><span
          ><span @click="openForm('RegisterForm')">注册</span></span
          ></el-dropdown-item
          >
          <el-dropdown-item
          ><span><span @click="logout">登出</span></span></el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <LoginForm
        ref="LoginForm"
        @loginSuccess="checkUserStatus"
      ></LoginForm>
      <RegisterForm
        ref="RegisterForm"
      ></RegisterForm>
    </div>
  </div>
</template>

<script>
  import {userApi} from "../router/api.js";

  import LoginForm from "@/components/LoginForm.vue";
  import RegisterForm from "@/components/RegisterForm.vue";
  import store from "../store/store";

  export default {
    mounted: function () {
      this.checkUserStatus();
    },
    data() {
      return {
      };
    },
    methods: {
      openForm(formRefName){
        console.log(formRefName)
        if (formRefName === "RegisterForm") {
          this.$refs[formRefName].changeCaptcha()
        }
        this.$refs[formRefName].openForm()

      },
      closeForm(formRefName){
        this.$refs[formRefName].closeForm()
      },
      checkUserStatus() {
        // 如果验证通过了
        // 如果已经登录了
        if (this.$store.getters.checkUserLogin) {
          //如果有refer跳转回去
          if (this.$route.query.refer) {
            var token = this.$store.getters.getToken
            if (token) {
              var url = decodeURIComponent(this.$route.query.refer)
              url = replaceUrlVariable(url, "token", token)
              window.location.href = url
            }
          }else if(this.$route.query.goto){
            if (this.$route.query.goto == 2){
              this.openForm("RegisterForm")
              let newQuery = JSON.parse(JSON.stringify(this.$route.query)) // 深拷贝
              delete newQuery.goto
              this.$router.replace({ query: newQuery })
            }
          }
        } else {
          // 打开登录弹窗
          this.openForm("LoginForm")
        }
      },
      logout() {
        this.$post(userApi.userLogout, {uid: this.$store.getters.getUserInfo.uid}).then(res => {
            // 如果已经登录了
            //否则就跳到默认的首页
            if (this.$route.path !== "/") {
              this.$router.push('/')
              location.reload()
            } else {
              location.reload()
            }
          }
        );
      }
    },

    components: {
      LoginForm,
      RegisterForm
    },
    watch: {
    },
    computed: {
      LoginTab: function () {
        if (this.isLogin === true) {
          return "切换";
        } else {
          return "登录";
        }
      },
      username: function () {
        return this.$store.getters.getUserInfo.username
      },
      avatar: function () {
        return this.$store.getters.getUserInfo.avatar
      }
    }
  };

  function replaceUrlVariable (url, name, val) {
    var query = url.substring(url.indexOf("?"))
    var baseUrl = url.substring(0, url.indexOf("?"))
    var newurl = baseUrl
    if (query.indexOf(name) > -1) {
      var obj = {}
      var arr = query.split('&')
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split('=')
        obj[arr[i][0]] = arr[i][1]
      }
      obj[name] = val
      var params = JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&')
      if (params) {
        newurl = baseUrl + '?' + JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&')
      }
    }
    return newurl
  }
</script>

<style scoped>
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    vertical-align: middle !important;
    text-align: right;
  }

  .topbar {
    padding: 16px;
    background-color: #545c64;
    color: #fff;
    display: flex;
    flex-direction: row; /* flex布局 内部对其方式*/
  }

  .logo {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    vertical-align: middle !important;
    text-align: right;
  }

  .topbar-left {
    display: block;
    flex-grow: 1; /* 占据所有剩余空间，其他都是0*/
  }

  .topbar-right {
    display: block;
    flex-grow: 0;
  }

  .login-span {
    margin-right: 10px;
    margin-top: 2px;
  }

  .register-span {
    margin-right: 10px;
    margin-top: 2px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .username {
    /* color: #fff; */
    padding-right: 10px;
  }
</style>
