<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>操作日志</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="filter clearfix">
                <Form ref="formFilter" :model="formFilter" inline :label-width="80">
                    <FormItem label="操作描述：" prop="description">
                        <Input type="text" v-model="formFilter.operateDesc" placeholder="请输入操作描述" clearable></Input>
                    </FormItem>
                    <FormItem label="操作人：" prop="operatorCode">
                        <Input type="text" v-model="formFilter.operatorCode" placeholder="请输入操作人" clearable></Input>
                        <!-- <Select v-model="model13" filterable remote  placeholder="请输入操作人" :remote-method="remoteMethod1" style="width:160px;" :loading="loading1">
                            <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
                        </Select> -->
                    </FormItem>
                    <FormItem label="操作日期：">
                        <Row>
                            <Col span="11">
                            <FormItem prop="operateTimeStart">
                                <DatePicker type="datetime" placeholder="请选择开始时间" :editable="false" style="width:160px;" v-model="formFilter.operateTimeStart"></DatePicker>
                            </FormItem>
                            </Col>
                            <Col span="2" style="text-align: center">&nbsp;</Col>
                            <Col span="11">
                            <FormItem prop="operateTimeEnd">
                                <DatePicker type="datetime" placeholder="请选择结束时间" :editable="false" style="width:160px;" v-model="formFilter.operateTimeEnd"></DatePicker>
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
                <Table border  :columns="columns" :data="list"></Table>
            </div>
            <div class="page-wapper">
                <Pagination :totalPages="totalPages" :currentPage="currentPage" @on-change="handlePageNumChange"></Pagination>
            </div>
        </div>
        <Modal v-model="modal" title="监控日志详情" class="modal" :mask-closable="false" width="600">
            <div class="form block-center">
                <Form ref="form" :model="form" :label-width="100">
                    <FormItem label="操作人：">
                        <Input type="text" v-model="form.operator" readonly></Input>
                    </FormItem>
                    <FormItem label="操作描述：">
                        <Input type="text" v-model="form.operateDesc" readonly></Input>
                    </FormItem>
                    <FormItem label="系统：">
                        <Input type="text" v-model="form.system" readonly></Input>
                    </FormItem>
                    <FormItem label="请求路径：">
                        <Input type="text" v-model="form.uri" readonly></Input>
                    </FormItem>
                    <FormItem label="操作人ip：">
                        <Input type="text" v-model="form.operateIp" readonly></Input>
                    </FormItem>
                    <FormItem label="请求参数：">
                        <Input v-model="form.request" type="textarea" readonly :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    <FormItem label="操作时间：">
                        <Input type="text" v-model="form.operateTime" readonly></Input>
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
    name: 'operationLog',
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
                operateTimeStart: '',
                operateTimeEnd: ''
            },
            formFilterCache:{},
            columns: [
                {
                    title: '序号',
                    width: 60,
                    render: (h, params) => {
                        let index = (this.currentPage - 1) * 10 + params.index + 1
                        return h('span', index)
                    },
                },
                {
                    title: '操作人',
                    key: 'operator'
                },
                {
                    title: 'URL',
                    key: 'uri'
                },
                {
                    title: '操作时间',
                    key: 'createTime',
                    render: (h, params) => {
                        const time = this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss')
                        return h('span', time)
                    }
                }, {
                    title: '操作描述',
                    key: 'operateDesc'
                }, {
                    title: '系统',
                    key: 'system'
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
        this.getOperationLogList()
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
            this.getOperationLogList()
        },
        handleReset(name) {
            this.$refs[name].resetFields()
            this.handleFormCache()
            this.getOperationLogList()
        },
        getLogDetail(id) {
            const params = { id }
            api.logManage.operationLogDetail(params).then(res => {

                if (res.data.code === 200) {
                    this.modal = true
                    this.form = res.data.data
                    this.form.operateTime = this.$moment(this.form.operateTime).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        },
        getOperationLogList() {
            const form = this.formFilterCache
            form.operateTimeStart = form.operateTimeStart ? this.$moment(form.operateTimeStart).format('YYYY-MM-DD HH:mm:ss') : form.operateTimeStart
            form.operateTimeEnd = form.operateTimeEnd ? this.$moment(form.operateTimeEnd).format('YYYY-MM-DD HH:mm:ss') : form.operateTimeEnd
            const params = Object.assign({}, form, {
                pageNum: this.currentPage,
                pageSize: 10
            })
            api.logManage.operationLogList(params).then(res => {
                if (res.data.code === 200) {
                    this.list = res.data.data.list || []
                    this.totalPages = res.data.data.total
                }
            })
        },
        handlePageNumChange(pageNum) {
            this.currentPage = pageNum
            this.getOperationLogList()
        }
    },
    computed: {
        isSeletDateError() {
            return this.formFilter.operateTimeStart && this.formFilter.operateTimeEnd && this.formFilter.operateTimeStart > this.formFilter.operateTimeEnd
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
.end-time {
  /deep/ .ivu-form-item-content {
    margin-left: 0 !important;
  }
}
.table {
    margin-top: 20px;
}
</style>
