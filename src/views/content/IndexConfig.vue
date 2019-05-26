<template>
  <div class="main">
    <Breadcrumb>
      <BreadcrumbItem>内容管理</BreadcrumbItem>
      <BreadcrumbItem>web首页配置</BreadcrumbItem>
    </Breadcrumb>
    <div class="main-content">
      <Tabs :value="tab" :animated="false" @on-click="handleToggle">
        <TabPane :label="item.name" v-for="item in articleTypeList" :key="item.id" :name="item.id+''">
          <div class="table">
            <DragableTable v-model="categoryList" @on-end="handleDragend" :columns-list="categoryColumns"></DragableTable>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <Modal v-model="modal" title="编辑" class="modal" @on-cancel="handleClose" :mask-closable="false" width="900">
      <div class="form block-center">
        <div class="filter">
          <Form ref="formFilter" :model="formFilter" inline :label-width="100">
            <FormItem label="文章标题：" prop="title">
              <Input type="text" v-model="formFilter.title" placeholder="请输入文章标题" clearable @on-enter="handleFilter('formFilter')"></Input>
            </FormItem>
            <input type="text" style="display:none" />
            <FormItem class=" filter-btn-group">
              <Button type="primary" @click="handleFilter('formFilter')">查询</Button>
              <Button type="ghost" @click="handleReset('formFilter')">重置</Button>
            </FormItem>
          </Form>
        </div>
        <Table border height="300" :columns="newsColumns" :data="newsList"></Table>
      </div>
      <div slot="footer" class="text-center">
        <Button type="primary" @click="handleSubmit">保存</Button>
      </div>
    </Modal>
    <Modal v-model="viewModal" title="预览" :footerHide="true" class="baner-view-modal" width="900">
      <div style="text-align:center;">
        <img style="width:100%;" :src="imgUrl" alt="">
      </div>
    </Modal>
  </div>
</template>
<script>
import api from '@/api/api'
import DragableTable from '@/components/DragableTable.vue'
export default {
  name: 'indexConfig',
  components: {
    DragableTable
  },
  data() {
    return {
      tab: '',
      modal: false,
      viewModal: false,
      imgUrl: '',
      formFilter: {
        title: ''
      },
      articleId: '',
      id: '',
      categoryColumns: [
        {
          title: '序号',
          width: 60,
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '缩略图',
          key: 'url',
          width: 100,
          className: 'table-thumbnail',
          render: (h, params) => {
            const vm = this
            const logo = (vm.tab == 2 || vm.tab == 5 )? params.row.article.logoUrl:params.row.article.logo

            return h('img', {
              attrs: {
                // src: url
                src: logo
              },
              on: {
                click() {
                  vm.viewModal = true
                  vm.imgUrl = logo
                }
              },
              style: {
                height: '30px'
              }
            })
          }
        },
        {
          title: '标题',
          key: 'title',
          className: 'td-visible',
          render: (h, params) => {
            const article = params.row.article && params.row.article.title
            return h('div', {
              attrs: {
                class: 'td-font',
              }
            }, [
                h('div', {
                  attrs: {
                    class: 'font-hidden-two',
                  }
                }, article),
                // article ?
                //   h('div', {
                //     attrs: {
                //       class: 'td-hover',
                //     }
                //   }, article) : ''
              ])
          }
        },
        {
          title: '操作时间',
          key: 'updateTime',
          width: 140,
          render: (h, params) => {
            let time = params.row.updateTime ? this.$moment(params.row.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', time)
          }
        },
        {
          title: '操作人',
          key: 'updateCode',
          width: 160
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#FC9153'
                  },
                  on: {
                    click: () => {
                      this.id = params.row.id
                      this.getNewsList()
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        }
      ],
      newsColumns: [
        {
          title: '缩略图',
          key: 'url',
          width: 100,
          className: '',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.logo
              },
              style: {
                height: '30px'
              }
            })
          }
        },
        {
          title: '标题名称',
          key: 'title'
        }, {
          title: '分类',
          key: 'menuName'
        }, {
          title: '简介',
          key: 'subtitle',
          className: 'td-scroll'
        }, {
          title: '选择',
          key: 'action',
          width: 60,
          align: 'center',
          className: 'td-visible',
          render: (h, params) => {
            return h('div', [
              h(
                'Radio',
                {
                  props: {
                    value: params.row.isSelect
                  },
                  style: {
                    marginRight: '0'
                  },
                  on: {
                    'on-change': () => {
                      this.articleId = params.row.id
                      this.newsList.forEach((item, index) => {
                        if (item.id !== params.row.id) {
                          this.$set(this.newsList[index], 'isSelect', false)
                        } else {
                          this.$set(this.newsList[index], 'isSelect', true)
                        }
                      });
                    }
                  }
                }
              )
            ])
          }
        }
      ],
      categoryList: [],
      newsList: [],
      articleTypeList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 缓存表单数据
    handleFormCache() {
      this.formFilterCache = Object.assign({}, this.formFilter)
      this.currentPage = 1
    },
    // 筛选
    handleFilter(name) {
      this.articleId = ''
      this.handleFormCache()
      this.getNewsList()
    },
    async getData() {
      await this.getAticleTypelist()
      await this.getIndexConfigList()
    },
    getAticleTypelist() {
      return api.articleManage.articleTypeList().then(res => {
        if (res.data.code === 200) {
          const data = res.data.data || []
          const list = [].concat(data[0].childList[0], data.slice(1, -1), data[0].childList[1], data[data.length - 1])
          list[0].name = "热门资讯"
          // let temp = list[1]
          // list[1] = list[4]
          // list[4] = temp

          this.articleTypeList = list
          this.tab = String(this.articleTypeList[0].id)
        }
      })
    },
    getIndexConfigList() {
      let params = {
        module: this.tab
      }
      api.webIndexManage.indexConfigList(params).then(res => {
        if (res.data.code === 200) {
          this.categoryList = res.data.data || []
          this.categoryListCache = this.categoryList.slice(0)
        }
      })
    },
    handleSubmit() {
      this.indexConfigUpdate()
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.getNewsList()
      this.articleId = ''
    },
    handleClose() {
      this.$refs['formFilter'].resetFields();
      this.articleId = ''
    },
    indexConfigUpdate() {
      if (!this.articleId) {
        this.$Message.info('请选择文章')
        return
      }
      let formData = this.$qs.stringify({
        id: this.id,
        articleId: this.articleId
      })
      api.webIndexManage.indexConfigUpdate(formData).then(res => {
        if (res.data.code === 200) {
          this.getIndexConfigList()
          this.$Message.success('文章已添加！')
          this.formFilter.title = ''
          this.articleId = ''
          this.modal = false
        }
      })
    },
    getNewsList() {
      let params = {
        module: this.tab == 7 ? 3 : this.tab,
        title: this.formFilter.title
      }
      api.webIndexManage.newsList(params).then(res => {
        if (res.data.code === 200) {
          this.newsList = res.data.data.map(item => {
            return Object.assign(item, {
              isSelect: false
            })
          })

          this.modal = true
        }
      })
    },
    handleToggle(id) {
      this.tab = id
      this.categoryList=[]
      this.getIndexConfigList()
    },
    handleDragend(e) {
      if (e.from === e.to) {
        return
      }
      const formData = this.$qs.stringify({
        id: this.categoryListCache[e.from].id,
        sort: this.categoryListCache[e.to].sort
      })
      api.webIndexManage.indexConfigSort(formData).then(res => {
        if (res.data.code === 200) {
          this.getIndexConfigList()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  font-weight: normal;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  margin-bottom: 20px;
  /deep/ .thumbnail {
    // margin-top: 5px;
    background: #000;
  }
}
.main-content {
  min-height: 500px;
}
.upload {
  margin-bottom: 30px;
  cursor: pointer;
  .label {
    vertical-align: top;
    margin-right: 10px;
  }
  .upload-wrapper {
    width: 480px;
    height: 95px;
    border: 1px dashed #dddee1;
  }
  /deep/ .ivu-upload {
    text-align: center;
  }
  /deep/ .ivu-upload-list {
    margin-top: 0;
  }
}
.tips {
  margin-top: 20px;
}
.form {
  width: 830px;
}
.filter {
  margin-bottom: 20px;
}
.modal {
  /deep/ .ivu-modal-body {
    overflow: hidden;
  }
}
</style>
