
<template>
  <div class="header">
    <div class="fr clearfix">
      <RadioGroup :value="theme" @on-change="handleToggleTheme" type="button" class="toggle-theme fl">
        <Radio label="dark" class="btn radio_btn">黑色</Radio>
        <Radio label="light" class="radio_btn">白色</Radio>
      </RadioGroup>

      <div class="avatar fl">
        <img src="../assets/images/default_header.png" alt="">
      </div>
      <div class="logout fl">
        {{username}}
        <Icon type="ios-arrow-down" style="padding-left:8px;"></Icon>
        <div class="wrap">
          <span @click="logout">退出</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/api"
const basePath = require('../../config/basePath')
export default {
  data() {
    return {
      username: ''
    };
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      api.base.userInfo().then(res => {
        if (res.data.code == 200) {
          this.username = res.data.data.ldap
          waterMark({
            systemId: '1728',
            //当前用户ID
            userId: this.username,
            containerEl: document.body
          });
        }
      })
    },
    logout() {
      api.base
        .logout({
          jumpto: location.origin + `/${basePath}/`
        })
        .then(res => {
          location.href = res.data;
        });
    },
    handleToggleTheme(value) {
      localStorage.setItem('theme', value)
      this.$store.commit('changeTheme', value)
    }
  },
  computed: {
    theme() {
      return this.$store.state.menuTheme
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  height: 48px;
  width: 100%;
  background: #ffffff;
  padding-right: 80px;
  z-index: 100;
}
.toggle-theme {
  margin-top: 10px;
  margin-right: 20px;
}
.toggle-lang {
  margin-top: 12px;
  margin-right: 20px;
}
.avatar {
  margin-top: 10px;
  img {
    width: 28px;
  }
}
.logout {
  line-height: 48px;
  margin-left: 8px;
  cursor: pointer;
  position: relative;
  .wrap {
    display: none;
    position: absolute;
    width: 70px;
    height: 50px;
    top: 45px;
    left: -10px;
  }
  span {
    background: #fff;
    width: 60px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    text-align: center;
    display: inline-block;
    box-shadow: 0 2px 10px 0 rgba(182, 191, 196, 0.2);
  }
  &:hover {
    .wrap {
      display: block;
    }
  }
}
.radio_btn {
  height: 28px;
  line-height: 28px;
}
</style>

