<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>违规信息管理</BreadcrumbItem>
            <BreadcrumbItem>违规查询记录</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="filter">
                <Form ref="formFilter" :model="formFilter" inline :label-width="100">
                    <FormItem label="查询类型：" prop="type">
                        <Select v-model="formFilter.type" style="width:160px;" clearable placeholder="请选择查询类型">
                            <Option value="1">人员查询</Option>
                            <Option value="2">企业查询</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否查询成功：" prop="result">
                        <Select v-model="formFilter.result" style="width:160px;" clearable placeholder="请选择是否查询成功">
                            <Option value="1">是</Option>
                            <Option value="0">否</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="查询时间：">
                        <Row>
                            <Col span="11">
                            <FormItem prop="queryStartTime">
                                <DatePicker type="date" placeholder="请选择开始时间" :editable="false" style="width:160px;" v-model="formFilter.queryStartTime"></DatePicker>
                            </FormItem>
                            </Col>
                            <Col span="2" style="text-align: center">&nbsp;</Col>
                            <Col span="11">
                            <FormItem prop="queryEndTime">
                                <DatePicker type="date" placeholder="请选择结束时间" :editable="false" style="width:160px;" v-model="formFilter.queryEndTime"></DatePicker>
                            </FormItem>
                            </Col>
                        </Row>
                        <span class="time-error-tips" v-if="isSeletDateError">开始日期不能小于结束日期</span>
                    </FormItem>
                    <FormItem class=" filter-btn-group">
                        <Button type="primary" @click="handleFilter('formFilter')">查询</Button>
                        <Button type="ghost" @click="handleReset('formFilter')">重置</Button>
                    </FormItem>
                </Form>
            </div>
            <div class="handle-btn">
                <Button type="primary" @click="handleExport">导出</Button>
            </div>
            <div class="table">
                <Table border :columns="columns" :data="recordList"></Table>
            </div>
            <div class="page-wapper">
                <Pagination :totalPages="totalPages" :currentPage="currentPage" @on-change="handlePageNumChange"></Pagination>
            </div>
        </div>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import api from '@/api/api'
export default {
    name: 'illegalRecord',
    components: {
        Pagination
    },
    data() {
        return {
            totalPages: 0,
            currentPage: 1,
            formFilter: {
                type: '',
                result: '',
                queryStartTime: '',
                queryEndTime: ''
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
                    title: '查询人手机',
                    key: 'phone'
                },
                {
                    title: '查询类型',
                    key: 'type',
                    render: (h, params) => {
                        return h('span', params.row.type === 1 ? '人员查询' : '企业查询')
                    }
                },
                {
                    title: '被查询名称',
                    key: 'name'
                },
                {
                    title: '被查询身份信息',
                    key: 'idCard'
                },
                {
                    title: '是否查询成功',
                    key: 'result',
                    render: (h, params) => {
                        return h('span', params.row.result ? '是' : '否')
                    }
                },
                {
                    title: '查询时间',
                    key: 'queryTime',
                    render: (h, params) => {
                        const time = this.$moment(params.row.queryTime).format('YYYY-MM-DD HH:mm:ss')
                        return h('span', time)
                    }
                }
            ],
            recordList: [],
        }
    },
    created() {
        this.getRecordList()
    },
    methods: {
        // 缓存表单数据
        handleFormCache() {
            this.formFilterCache = Object.assign({}, this.formFilter)
            this.currentPage = 1
        },
        getRecordList() {
            const form = this.formFilterCache
            const params = {
                type: form.type,
                result: form.result,
                queryStartTime: form.queryStartTime ? this.$moment(form.queryStartTime).format('YYYY-MM-DD') : '',
                queryEndTime: form.queryEndTime ? this.$moment(form.queryEndTime).format('YYYY-MM-DD') : '',
                pageNum: this.currentPage,
                pageSize: 10,
            }
            api.illegalInfoManage.illegalQueryRecordList(params).then(res => {
                if (res.data.code === 200) {
                    this.recordList = res.data.data.list || []
                    this.totalPages = res.data.data.total
                }
            })
        },
        handleFilter(name) {
            this.handleFormCache()
            this.getRecordList()
        },
        handleReset(name) {
            this.$refs[name].resetFields();
            this.handleFormCache()
            this.getRecordList()
        },
        handleExport() {
            const form = this.formFilterCache
            const params = {
                type: form.type,
                result: form.result,
                queryStartTime: form.queryStartTime ? this.$moment(form.queryStartTime).format('YYYY-MM-DD') : '',
                queryEndTime: form.queryEndTime ? this.$moment(form.queryEndTime).format('YYYY-MM-DD') : '',
            }
            api.illegalInfoManage.illegalQueryRecordExport(params).then(res => {
                location.href = res.request.responseURL
            })
        },
        handlePageNumChange(pageNum) {
            this.currentPage = pageNum
            this.getRecordList()
        }
    },
    computed: {
        isSeletDateError() {
            return this.formFilter.queryStartTime && this.formFilter.queryEndTime && this.formFilter.queryStartTime > this.formFilter.queryEndTime
        }
    }
}
</script>
