<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>监控日志</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="filter">
                <Form ref="formFilter" :model="formFilter" inline :label-width="80">
                    <FormItem label="错误描述：" prop="operateDesc">
                        <Input type="text" v-model="formFilter.operateDesc" placeholder="请输入错误描述" clearable></Input>
                    </FormItem>
                    <FormItem label="操作人：" prop="operatorCode">
                        <Input type="text" v-model="formFilter.operatorCode" placeholder="请输入操作人" clearable></Input>
                        <!-- <Select v-model="model13" filterable remote :remote-method="remoteMethod1" style="width:160px;" :loading="loading1">
                            <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
                        </Select> -->
                    </FormItem>
                    <FormItem label="操作日期：">
                        <Row>
                            <Col span="11">
                            <FormItem prop="createTimeStart">
                                <DatePicker type="datetime" placeholder="请选择开始时间" :editable="false" style="width:160px;" v-model="formFilter.createTimeStart"></DatePicker>
                            </FormItem>
                            </Col>
                            <Col span="2" style="text-align: center">&nbsp;</Col>
                            <Col span="11">
                            <FormItem prop="createTimeEnd">
                                <DatePicker type="datetime" placeholder="请选择结束时间" :editable="false" style="width:160px;" v-model="formFilter.createTimeEnd"></DatePicker>
                            </FormItem>
                            </Col>
                        </Row>
                        <span class="time-error-tips" v-if="isSeletDateError">开始日期不能小于结束日期</span>
                    </FormItem>

                    <input type="text" style="display:none" />
                    <FormItem class=" filter-btn-group">
                        <Button type="primary" @click="handleFilter('formFilter')">查询</Button>
                        <Button type="ghost" @click="handleReset('formFilter')">重置</Button>
                    </FormItem>
                </Form>
            </div>
            <div class="table">
                <Table border :columns="columns" :data="list"></Table>
            </div>
            <div class="page-wapper">
                <Pagination :totalPages="totalPages" :currentPage="currentPage" @on-change="handlePageNumChange"></Pagination>
            </div>
        </div>
        <Modal v-model="modal" title="监控日志详情" class="modal" :mask-closable="false" width="600">
            <div class="form block-center">
                <Form ref="form" :model="form" :label-width="100">
                    <FormItem label="操作人：">
                        <Input type="text" v-model="form.operatorCode" readonly></Input>
                    </FormItem>
                    <FormItem label="URL：">
                        <Input type="text" v-model="form.uri" readonly></Input>
                    </FormItem>
                    <FormItem label="IP：">
                        <Input type="text" v-model="form.operatorIp" readonly></Input>
                    </FormItem>
                    <FormItem label="系统：">
                        <Input type="text" v-model="form.operator" readonly></Input>
                    </FormItem>
                    <FormItem label="操作时间：">
                        <Input type="text" v-model="form.createTime" readonly></Input>
                    </FormItem>
                    <FormItem label="错误描述：">
                        <Input type="text" v-model="form.description" readonly></Input>
                    </FormItem>
                    <FormItem label="浏览器信息：">
                        <Input v-model="form.browerMessage" type="textarea" readonly :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入文章简介"></Input>
                    </FormItem>
                    <FormItem label="错误详情：">
                        <Input v-model="form.detail" type="textarea" readonly :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入文章简介"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" class="text-center">
                <Button type="primary" @click="modal=false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import api from '@/api/api'
export default {
    name: 'MonitorLog',
    components: {
        Pagination
    },
    data() {
        return {
            modal: false,
            totalPages: 0,
            currentPage: 1,
            form: {},
            formFilter: {
                description: '',
                operatorCode: '',
                createTimeStart: '',
                createTimeEnd: ''
            },
            formFilterCache: {},
            columns: [
                {
                    title: '序号',
                    render: (h, params) => {
                        let index = (this.currentPage - 1) * 10 + params.index + 1
                        return h('span', index)
                    },
                },
                {
                    title: '操作人',
                    key: 'operatorCode'
                },
                {
                    title: 'URL',
                    key: 'uri'
                },
                {
                    title: 'IP',
                    key: 'operatorIp',
                },
                {
                    title: '操作时间',
                    key: 'createTime',
                    render: (h, params) => {
                        const time = this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss')
                        return h('span', time)
                    }
                }, {
                    title: '错误描述',
                    key: 'description'
                }, {
                    title: '系统',
                    key: 'operator'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
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
                                        this.getLogDetail(params.row.id)
                                    }
                                }
                            }, '详情')
                        ]);
                    }
                }
            ],
            list: []
        }
    },
    created() {
        this.getMonitorLogList()
    },
    methods: {
        // 缓存表单数据
        handleFormCache() {
            this.formFilterCache = Object.assign({}, this.formFilter)
            this.currentPage = 1
        },
        handleFilter(name) {
            if (document.querySelector('.time-error-tips')) {
                return
            }
            this.handleFormCache()
            this.getMonitorLogList()
        },
        handleReset(name) {
            this.$refs[name].resetFields()
            this.handleFormCache()
            this.getMonitorLogList()
        },
        getLogDetail(id) {
            const params = { id }
            api.logManage.monitorLogDetail(params).then(res => {
                if (res.data.code === 200) {
                    this.modal = true
                    this.form = res.data.data
                    this.form.createTime = this.$moment(this.form.createTime).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        },
        getMonitorLogList() {
            const form = this.formFilterCache
            form.createTimeStart = form.createTimeStart ? this.$moment(form.createTimeStart).format('YYYY-MM-DD HH:mm:ss') : form.createTimeStart
            form.createTimeEnd = form.createTimeEnd ? this.$moment(form.createTimeEnd).format('YYYY-MM-DD HH:mm:ss') : form.createTimeEnd
            const params = Object.assign({}, form, {
                pageNum: this.currentPage,
                pageSize: 10
            })
            api.logManage.monitorLogList(params).then(res => {
                if (res.data.code === 200) {
                    this.list = res.data.data.list || []
                    this.totalPages = res.data.data.total
                }
            })
        },
        handlePageNumChange(pageNum) {
            this.currentPage = pageNum
            this.getMonitorLogList()
        }
    },
    computed: {
        isSeletDateError() {
            return this.formFilter.createTimeStart && this.formFilter.createTimeEnd && this.formFilter.createTimeStart > this.formFilter.createTimeEnd
        }
    }
}
</script>
<style lang="less" scoped>
.form {
  width: 500px;
}
.modal {
  /deep/ .ivu-modal {
    top: 20px;
  }
}
.table {
    margin-top: 20px;
}
</style>
