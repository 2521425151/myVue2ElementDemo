<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>生成首页</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="clearfix">
                <span class="fl title">首页首屏类型</span>
                <div class="fl">
                    <RadioGroup v-model="type">
                        <Radio label="1001">图片</Radio>
                        <Radio label="1002">视频</Radio>
                    </RadioGroup>
                </div>
            </div>

            <Button type="primary" class="btn" @click="handleCreatIndex">生成首页</Button>
            <p class="tips">
                <Icon type="ios-information"></Icon>首页内容维护完成之后需要点击生成首页</p>
        </div>
    </div>
</template>
<script>
import api from '@/api/api'
export default {
    name: 'createIndex',
    data() {
        return {
            type: '1001'
        }
    },
    created() {
        this.getType()
    },
    methods: {
        handleCreatIndex() {
            const formData = this.$qs.stringify({
                type: this.type
            })
            api.webIndexManage.buildIndex(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success('已成功生成首页')
                } else {
                    this.$Message.error(res.data.msg)
                }
            })
        },
        getType() {
            api.webIndexManage.buildType().then(res => {
                if (res.data.code === 200) {
                    this.type=res.data.data.buildType
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.title {
  margin-right: 20px;
  margin-top: 2px;
}
.btn {
  margin-top: 30px;
  margin-bottom: 20px;
}
.main-content {
  padding-top: 50px;
  padding-left: 50px;
  min-height: 550px;
}
.tips {
  .ivu-icon {
    font-size: 15px;
    margin-right: 5px;
    vertical-align: middle;
  }
}
</style>
