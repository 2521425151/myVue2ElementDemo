<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>内容管理</BreadcrumbItem>
            <BreadcrumbItem>常见问题</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="filter">
                <Form ref="formFilter" :model="formFilter" inline :label-width="80">
                    <FormItem label="标题：" prop="title">
                        <Input type="text" v-model="formFilter.title" placeholder="请输入标题" clearable></Input>
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
                <Button type="primary" @click="goToFaqDetail('new')">新建</Button>
            </div>
            <div class="table">
                <Table border :columns="columns" :data="faqList"></Table>
            </div>
            <div class="page-wapper">
                <Pagination :totalPages="totalPages" :currentPage="currentPage" @on-change="handlePageNumChange"></Pagination>
            </div>
        </div>
        <!-- <Modal v-model="viewModal" title="预览" class="modal-view" :mask-closable="false" width="1000px">
            <div v-html="content" class="view-content"></div>
            <div slot="footer" class="text-center">
                <Button type="primary" @click="viewModal=false">关闭</Button>
            </div>
        </Modal> -->
    </div>
</template>
<script>
import api from '@/api/api'
import Pagination from '@/components/Pagination'
export default {
    name: 'FAQ',
    components: {
        Pagination
    },
    data() {
        return {
            totalPages: 0,
            currentPage: 1,
            viewModal: false,
            formFilter: {
                status: '',
                title: '',
            },
            formFilterCache: {},
            columns: [
                {
                    title: '序号',
                    width: 60,
                    render: (h, params) => {
                        const index = (this.currentPage - 1) * 10 + params.index + 1
                        return h('span', index)
                    },
                },
                {
                    title: '标题',
                    key: 'title',
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
                                //     attrs: {
                                //         class: 'td-hover',
                                //     }
                                // }, title)
                            ])
                    }
                },
                {
                    title: '内容',
                    key: 'content',
                    className: 'td-visible',
                    render: (h, params) => {
                        const content = params.row.content
                        return h('div', {
                            attrs: {
                                class: 'td-font',
                            }
                        }, [h('div', {
                            attrs: {
                                class: 'font-hidden-two',
                            },
                            domProps: {
                                innerHTML: content ? content.replace(/<[^<>]+>/g, '') : ''
                            }
                        }),
                        // content ?
                        //     h('div', {
                        //         attrs: {
                        //             class: 'td-hover',
                        //         },
                        //         domProps: {
                        //             innerHTML: content
                        //         }
                        //     }) : ''
                            ])
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
                            h('a', {
                                attrs: {
                                    href: `${location.href.slice(0, -3)}articleView?type=faq&id=${params.row.id}`,
                                    target: '_blank'
                                },
                                style: {
                                    color: '#FC9153',
                                    verticalAlign: 'middle',
                                    marginRight:'8px'
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
                                        this.goToFaqDetail('edit', params.row.id)
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
                                        this.$Modal.confirm({
                                            title: '提示',
                                            content: '<p>确定删除当前常见问题？</p>',
                                            width: '300',
                                            onOk: () => {
                                                this.handleDelete(params.row.id)
                                            }
                                        });
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
                                                content: '<p>确定发布当前常见问题？</p>',
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
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '<p>确定下架当前常见问题？</p>',
                                                width: '300',
                                                onOk: () => {
                                                    this.handleOffLine(params.row.id)
                                                }
                                            });
                                        }
                                    }
                                }, '下架') : '',
                        ]);
                    }
                }
            ],
            faqList: []
        }
    },
    created() {
        this.$store.commit('changeIncludes', ['FAQ'])
        this.getFaqList()
    },
    activated() {
        this.getFaqList()
    },
    beforeRouteLeave(to, from, next) {
        if (to.name.toLowerCase() !== 'faqdetail') {
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
        // 获取常见问题列表
        getFaqList() {
            const form = this.formFilterCache
            const params = {
                status: form.status,
                title: form.title,
                pageNum: this.currentPage,
                pageSize: 10,
            }
            api.articleManage.faqList(params).then(res => {
                if (res.data.code === 200) {
                    this.faqList = res.data.data.list || []
                    this.totalPages = res.data.data.total
                }
            })
        },
        // 筛选
        handleFilter(name) {
            this.handleFormCache()
            this.getFaqList()
        },
        //重置表单
        handleReset(name) {
            this.$refs[name].resetFields();
            this.handleFormCache()
            this.getFaqList()
        },
        // 常见问题发布
        handlePublish(id) {
            const formData = this.$qs.stringify({ id })
            api.articleManage.faqPublish(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success('常见问题发布成功！')
                    this.getFaqList()
                }
            })
        },
        // 常见问题删除
        handleDelete(id) {
            const formData = this.$qs.stringify({ id })
            api.articleManage.faqDelete(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success('常见问题已删除！')
                    this.getFaqList()
                }
            })
        },
        handleOffLine(id) {
            const formData = this.$qs.stringify({ id })
            api.articleManage.faqOffLine(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success('常见问题已下架！')
                    this.getFaqList()
                }
            })
        },
        // 跳转到详情页
        goToFaqDetail(type, id) {
            this.$router.push({
                path: "FAQDetail",
                query: {
                    type: type,
                    id
                }
            })
        },
        // 更改页码
        handlePageNumChange(pageNum) {
            this.currentPage = pageNum
            this.getFaqList()
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
