<template>
  <div class="login-page">
    <div class="layer bg" id="login"></div>
    <div class="layer flex-center">
      <div class="login-bg"></div>
      <img class="login-img" src="./image/login.png">
      <div class="login-logo">
        <i class="iconfont icon-key-wisdom"></i>
        <h1>{{title}}</h1>
      </div>
      <div class="form-group">
        
      </div>
    </div>
  </div>
</template>

<script>
import config from "./config/default";
import { mapActions } from "vuex";
import * as sysService from "@/api/sys/sys";
export default {
  data() {
    return {
      title: '',
      // 快速选择用户
      dialogVisible: false,
      users: [
        {
          name: "超级管理员",
          username: "admin",
          password: "123"
        },
        {
          name: "菜单管理员",
          username: "MenuManager",
          password: "123456"
        },
        {
          name: "无权限用户",
          username: "no",
          password: "123456"
        }
      ],
      // 表单
      formLogin: {
        username: "admin",
        password: "123456",
        code: "v9am"
      },
      // 校验
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    // 初始化例子插件
    // particlesJS("login", config);
    this.title = process.env.VUE_APP_TITLE
  },
  created () {
    console.log(this.$route.query.username)
    this.login({
            vm: this,
            username: this.$route.query.username,
            password: '123456'
          });
  },
  beforeDestroy() {
    // 销毁 particlesJS
    // thanks https://github.com/d2-projects/d2-admin/issues/65
    // ref https://github.com/VincentGarreau/particles.js/issues/63
    // if (pJSDom && pJSDom.length > 0) {
    //   pJSDom[0].pJS.fn.vendors.destroypJS();
    //   pJSDom = [];
    // }
  },
  methods: {
    ...mapActions("d2admin/account", ["login"]),
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick(user) {
      this.formLogin.username = user.username;
      this.formLogin.password = user.password;
      this.submit();
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.login({
            vm: this,
            username: this.formLogin.username,
            password: this.formLogin.password
          });
          console.log('login success')
        } else {
          // 登录表单校验失败
          this.$message.error("表单校验失败");
        }
      });
    },
    resetDb() {
      sysService.resetDb();
    }
  }
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
