<template>
  <div class="main">
    <Breadcrumb>
      <BreadcrumbItem>内容管理</BreadcrumbItem>
      <BreadcrumbItem>文章管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="main-content">
      <div class="filter">
        <Form ref="formFilter" :model="formFilter" inline :label-width="80">
          <FormItem label="文章分类：" prop="type">
            <Select v-model="formFilter.type" style="width:160px" clearable placeholder="请选择文章分类">
              <Option v-for="item in articleTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="文章标题：" prop="title">
            <Input type="text" v-model="formFilter.title" placeholder="请输入文章标题" clearable></Input>
          </FormItem>
          <FormItem label="发布状态：" prop="status">
            <Select v-model="formFilter.status" style="width:160px" clearable placeholder="请选择发布状态">
              <Option v-for="item in pulishStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <input type="text" style="display:none" />
          <FormItem class=" filter-btn-group">
            <Button type="primary" @click="handleFilter('formFilter')">查询</Button>
            <Button type="ghost" @click="handleReset('formFilter')">重置</Button>
          </FormItem>
        </Form>
      </div>
      <div class="handle-btn">
        <Button type="primary" @click="goToDocDetail('new')">新建</Button>
      </div>
      <div class="table">
        <Table border :columns="columns" :data="articleList"></Table>
      </div>
      <div class="page-wapper">
        <Pagination :totalPages="totalPages" :currentPage="currentPage" @on-change="handlePageNumChange"></Pagination>
      </div>
    </div>
    <Modal v-model="viewModal" title="预览" id="viewModal" :footerHide="true" width="90%">
      <div class="view-content-wrapper">
        <div v-html="content" class="view-content"></div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { articleTypeMixin } from '@/mixins/articleTypeMixin'
import api from '@/api/api'
import Pagination from '@/components/Pagination'
export default {
  name: 'articles',
  mixins: [articleTypeMixin],
  components: {
    Pagination
  },
  data() {
    return {
      totalPages: 0,
      currentPage: 1,
      content: '',
      viewModal: false,

      formFilter: {
        status: '',
        type: '',
        title: '',
        articleTitle: '',
        articleType: '',
        pulishStatus: ''
      },
      formFilterCache: {},
      columns: [
        {
          title: '序号',
          width: 60,
          render: (h, params) => {
            const index = (this.currentPage - 1) * 10 + params.index + 1
            return h('span', index)
          }
        },
        {
          title: '文章标题',
          key: 'title',
          // ellipsis:true
          className: 'td-visible',
          render: (h, params) => {
            const title = params.row.title
            return h('div', {
              attrs: {
                class: 'td-font',
              }
            }, [
                h('div', {
                  attrs: {
                    class: 'font-hidden-two',
                  }
                }, title),
                // h('div', {
                //   attrs: {
                //     class: 'td-hover',
                //   }
                // }, title)
              ])
          }
        },
        {
          title: '文章分类',
          key: 'menuName',
          width: 100,
        },
        {
          title: '文章简介',
          key: 'subtitle',
          className: 'td-visible',
          render: (h, params) => {
            const subtitle = params.row.subtitle
            return h('div', {
              attrs: {
                class: 'td-font',
              }
            }, [h('div', {
              attrs: {
                class: 'font-hidden-two',
              }
            }, subtitle),
                // subtitle ?
                //   h('div', {
                //     attrs: {
                //       class: 'td-hover',
                //     }
                //   }, subtitle) : ''
              ]
            )
          }
        },
        {
          title: '发布状态',
          key: 'status',
          width: 80,
          render: (h, params) => {
            const status = params.row.status
            if (status === 0) {
              return h('span', '待发布')
            } else if (status === 1) {
              return h('span', '已发布')
            } else if (status === 2) {
              return h('span', '已下架')
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
          render: (h, params) => {
            const status = params.row.status
            return h('div', [
              // h('Button', {
              //   props: {
              //     type: 'text',
              //     size: 'small'
              //   },
              //   style: {
              //     color: '#FC9153'
              //   },
              //   on: {
              //     click: () => {
              //       this.handleView(params.row.content)
              //     }
              //   }
              // }, '详情'),
              h('a', {
                attrs: {
                  href: `${location.href.slice(0, -7)}articleView?type=article&id=${params.row.id}`,
                  target: '_blank'
                },
                style: {
                  color: '#FC9153',
                  verticalAlign: 'middle',
                  marginRight: '8px'
                },

              }, '详情'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#FC9153'
                },
                on: {
                  click: () => {
                    if (params.row.isTop == 1) {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '<p>该文章为首页配置文章编辑之后需要重新生成首页，是否继续？</p>',
                        width: '400',
                        onOk: () => {
                          this.goToDocDetail('edit', params.row.id)
                        }
                      });
                    } else {
                      this.goToDocDetail('edit', params.row.id)
                    }
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#FC9153'
                },
                on: {
                  click: () => {
                    if (params.row.isTop == 1) {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '<p>当前文章为首页配置文章，删除后需要重新配置文章，是否继续？</p>',
                        width: '400',
                        onOk: () => {
                          this.handleDelete(params.row.id)
                        }
                      });
                    } else {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定删除当前文章？</p>',
                        width: '300',
                        onOk: () => {
                          this.handleDelete(params.row.id)
                        }
                      });
                    }

                  }
                }
              }, '删除'),
              status !== 1 ?
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#FC9153'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定发布当前文章？</p>',
                        width: '300',
                        onOk: () => {
                          this.handlePublish(params.row.id)
                        }
                      });
                    }
                  }
                }, '发布') : '',
              status !== 0 && status !== 2 ?
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#FC9153'
                  },
                  on: {
                    click: () => {
                      if (params.row.isTop == 1) {
                        this.$Modal.confirm({
                          title: '提示',
                          content: '<p>当前文章为首页配置文章，下架后需重新配置文章，是否继续？</p>',
                          width: '400',
                          onOk: () => {
                            this.handleOffLine(params.row.id)
                          }
                        });
                      } else {
                        this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定下架当前文章？</p>',
                        width: '300',
                        onOk: () => {
                          this.handleOffLine(params.row.id)
                        }
                      });
                      }
                    }
                  }
                }, '下架') : '',
            ]);
          }
        }
      ],
      articleList: []
    }
  },
  created() {
    this.$store.commit('changeIncludes', ['articles'])
    this.getAticleTypelist()
    this.getAticleList()
  },
  activated() {
    this.getAticleTypelist()
    this.getAticleList()
  },
  beforeRouteLeave(to, from, next) {
    if (to.name.toLowerCase() !== 'articledetail') {
      this.$store.commit('changeIncludes', [])
      next()
    } else {
      next()
    }
  },
  methods: {
    // 缓存表单数据
    handleFormCache() {
      this.formFilterCache = Object.assign({}, this.formFilter)
      this.currentPage = 1
    },
    // 获取文章列表
    getAticleList() {
      const form = this.formFilterCache
      const params = {
        status: form.status,
        type: form.type,
        title: form.title,
        pageNum: this.currentPage,
        pageSize: 10,
      }
      api.articleManage.articleList(params).then(res => {
        if (res.data.code === 200) {
          this.articleList = res.data.data.list || []
          this.totalPages = res.data.data.total
        }
      })
    },
    // 筛选
    handleFilter(name) {
      this.handleFormCache()
      this.getAticleList()
    },

    //重置表单
    handleReset(name) {
      this.$refs[name].resetFields();
      this.handleFormCache()
      this.getAticleList()
    },
    // 预览
    handleView(content) {
      this.content = content
      this.viewModal = true
    },
    // 文章发布
    handlePublish(id) {
      const formData = this.$qs.stringify({ id })
      api.articleManage.articlePublish(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('文章已发布！')
          this.getAticleList()
        }
      })
    },
    // 文章删除
    handleDelete(id) {
      const formData = this.$qs.stringify({ id })
      api.articleManage.articleDelete(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('文章已删除！')
          this.getAticleList()
        }
      })
    },
    // 文章下线
    handleOffLine(id) {
      const formData = this.$qs.stringify({ id })
      api.articleManage.articleOffLine(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('文章已下架！')
          this.getAticleList()
        } else if (res.data.code === 403) {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 跳转到详情页
    goToDocDetail(type, id) {
      this.$router.push({
        path: "articleDetail",
        query: {
          type: type,
          id
        }
      })
    },
    // 更改页码
    handlePageNumChange(pageNum) {
      this.currentPage = pageNum
      this.getAticleList()
    }
  },
  computed: {
    pulishStatusList() {
      return this.$store.state.pulishStatusList
    }
  }
}
</script>
<style lang="less" scoped>
.table {
  /deep/ .ivu-table-column-center {
    .ivu-table-cell {
      padding: 0;
    }
  }
}
.modal-view {
  /deep/ .ivu-modal {
    top: 20px;
  }
}
.view-content {
  padding: 0 30px;
}
</style>
