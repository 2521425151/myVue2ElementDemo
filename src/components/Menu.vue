<template>
  <div class="side" :class="{dark:menuTheme=='dark'}">
    <div class="logo">
      <router-link to="/">
        <img src="../assets/images/logo-light.png" alt="" v-if="menuTheme=='light'">
        <img src="../assets/images/logo-dark.png" alt="" v-else>
      </router-link>
    </div>
    <div class="side-menu">
      <Menu :theme="menuTheme" accordion style="width:200px;">
        <Submenu :name="index" v-for="(item,index) in sideMenuList" :key="index">
          <template slot="title">
            <Icon type="ios-list"></Icon>
            {{item.name}}
          </template>
          <MenuItem :name="index+1+'-'+ subIndex+1" v-for="(subItem,subIndex) in item.childMenuList" :key="subIndex">
          <router-link :to="{path:subItem.url}">{{subItem.name}}</router-link>
          </MenuItem>
        </Submenu>
      </Menu>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: mapState(['sideMenuList','menuTheme'])
}
</script>
<style lang="less" scoped>
.side {
  background: #ffffff;
  height: 100%;
  position: fixed;
  z-index: 101;
  .ivu-menu {
    height: 100%;
  }
  .logo {
    margin: 0 0 30px 24px;
    padding-top: 50px;
    img {
      width: 90px;
    }
  }
  .ivu-menu-item {
    padding: 0 !important;
    a {
      padding: 14px 24px 14px 43px;
      display: block;
      width: 100%;
      height: 100%;
      color: #495060;
    }
  }
}
.dark {
  background: #495060;
  a {
    color: rgba(255, 255, 255, 0.7) !important;
  }
}
</style>

