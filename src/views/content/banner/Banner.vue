<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>内容管理</BreadcrumbItem>
            <BreadcrumbItem>banner管理</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <Tabs value="index" :animated="false">
                <TabPane label="顶部banner" name="index">
                    <IndexSwiper class="show"></IndexSwiper>
                </TabPane>
                <TabPane label="模块banner" name="other">
                    <IndexOther class="show"></IndexOther>
                </TabPane>
                <!-- <TabPane label="内容页" name="content">
                    <ContentPage class="show"></ContentPage>
                </TabPane> -->
            </Tabs>
        </div>
    </div>
</template>
<script>
import IndexSwiper from './IndexSwiper'
import IndexOther from './IndexOther'
import ContentPage from './ContentPage'
export default {
    name: 'banner',
    components: {
        IndexSwiper,
        IndexOther,
        ContentPage
    },
    data() {
        return {
            type: 1003,
        }
    },

}
</script>
<style lang="less" scoped>
.main-content {
  padding-right: 0;
  padding-left: 30px;
  /deep/ .ivu-tabs-bar {
    margin-right: 20px;
    // margin-bottom: 0;
  }
}
</style>
