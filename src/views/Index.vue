<template>
  <div class="main">
    <div class="main-content">
      <h2>首页</h2>
      <Row class="list">
        <!-- v-for="(item,index) in indexNav" :key="index" :class="{'no-margin-left':index===0||index===3}" -->
        <Col span="7" offset="1" v-if="menu.indexOf('/article')!==-1">
        <div class="nav-items">
          <router-link to="/article">
            <div class="item-icon fl">
              <Icon type="ios-list"></Icon>
            </div>
            <div class="title fl">
              <h3>内容管理</h3>
            </div>
          </router-link>
        </div>
        </Col>
        <Col span="7" offset="1" v-if="menu.indexOf('/illegalperson')!==-1">
        <div class="nav-items" >
        <router-link to="/illegalPerson">
            <div class="item-icon fl">
              <Icon type="card"></Icon>
            </div>
            <div class="title fl">
              <h3>违规信息管理</h3>
            </div>
          </router-link>
        </div>
        </Col>
        <Col span="7" offset="1" v-if="menu.indexOf('/reportmanage')!==-1">
        <div class="nav-items">
          <router-link to="/reportManage">
            <div class="item-icon fl">
              <Icon type="person-stalker"></Icon>
            </div>
            <div class="title fl">
              <h3>监督管理</h3>
            </div>
          </router-link>
        </div>
        </Col>
        <Col span="7" offset="1" v-if="menu.indexOf('/menumanage')!==-1">
        <div class="nav-items">
          <router-link to="/menuManage">
            <div class="item-icon fl">
              <Icon type="ios-gear-outline"></Icon>
            </div>
            <div class="title fl">
              <h3>系统管理</h3>
            </div>
          </router-link> 
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {

    }
  },
  computed: {
    menu() {
      return this.$store.state.authMenuList
    }
  }
}
</script>

<style lang="less" scoped>
h2 {
  margin-bottom: 20px;
}
.main {
  /deep/ .ivu-col {
    min-width: 220px;
  }
  .main-content {
    background: #f4f5f7;
  }
}
.no-margin-left {
  margin-left: 0;
}
.nav-items {
  width: 100%;
  height: 150px;
  line-height: 150px;
  background: #ffffff;
  margin-bottom: 60px;
  text-align: center;

  a {
    display: block;
    width: 100%;
    height: 100%;
    color: #fa8e53;
    &:hover {
      border-bottom: 4px solid #fa8e53;
    }
  }
  .item-icon {
    font-size: 80px;
    color: #999999;
    width: 40%;
  }
  .title {
    font-size: 18px;
  }
}
</style>
