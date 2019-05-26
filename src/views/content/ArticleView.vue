<template>
    <div class="container">
        <h2 class="title">{{data.title}}</h2>
        <div class="time" v-if="data.publishTime">
            {{$moment(data.publishTime).format('YYYY/MM/DD')}}
        </div>
        <p class="brief" v-if="data.subtitle">{{data.subtitle}}</p>
        <div class="content" v-html="data.content">

        </div>
    </div>
</template>
<script>
import api from '@/api/api'
export default {
    name: 'articleView',
    data() {
        return {
            data: {}
        }
    },
    created() {
        if (this.$route.query.type == 'article') {
            this.getArticleDetail(this.$route.query.id)
        } else {
            this.getFaqDetail(this.$route.query.id)
        }

    },
    methods: {
        getArticleDetail(id) {
            const params = { id }
            api.articleManage.articleDetail(params).then(res => {
                if (res.data.code === 200) {
                    this.data = res.data.data
                }
            })
        },
        getFaqDetail(id) {
            const params = { id }
            api.articleManage.faqDetail(params).then(res => {
                if (res.data.code === 200) {
                    this.data = res.data.data
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
.container {
  width: 80%;
  margin: 100px auto;
}
.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 34px;
  font-weight: normal;
}
.time {
  margin: 20px 0;
  font-size: 14px;
}
.brief {
    font-size: 14px;
}
.content {
  margin-top: 30px;
  line-height: 20px;
  /deep/ table {
    border: 0;
    margin: 0;
    border-collapse: collapse;
    border-spacing: 0;
  }
  /deep/ td {
    padding: 5px 10px;
    border: solid 1px #ddd;
  }
  /deep/ th {
    padding: 5px 10px;
    border: solid 1px #ddd;
  }
}
</style>
