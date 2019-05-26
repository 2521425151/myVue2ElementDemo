<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>短信统计</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="filter">
                <Form ref="formFilter" :model="formFilter" inline :label-width="80">
                    <FormItem label="发送日期：">
                        <Row>
                            <Col span="11">
                            <FormItem prop="startTime">
                                <DatePicker type="date" placeholder="请选择开始日期" :editable="false" style="width:160px;" v-model="formFilter.startTime"></DatePicker>
                            </FormItem>
                            </Col>
                            <Col span="2" style="text-align: center">&nbsp;</Col>
                            <Col span="11">
                            <FormItem prop="endTime">
                                <DatePicker type="date" placeholder="请选择结束日期" :editable="false" style="width:160px;" v-model="formFilter.endTime"></DatePicker>
                            </FormItem>
                            </Col>
                        </Row>
                        <span class="time-error-tips" v-if="isSeletDateError">开始日期不能小于结束日期</span>
                    </FormItem>
                    <FormItem label="发送状态：" prop="isSuccess">
                        <Select v-model="formFilter.isSuccess" style="width:160px" clearable placeholder="请选择发送状态">
                            <Option value="1">发送成功</Option>
                            <Option value="0">发送失败</Option>
                        </Select>
                    </FormItem>
                    <FormItem class=" filter-btn-group">
                        <Button type="primary" @click="handleFilter('formFilter')">查询</Button>
                        <Button type="ghost" @click="handleReset('formFilter')">重置</Button>
                    </FormItem>
                    <input type="text" style="display:none" />
                </Form>
            </div>
            <div class="status">
                <span v-if="formFilter.isSuccess!=='0'">发送成功
                    <span class="base-color">{{success}}</span>条</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span v-if="formFilter.isSuccess!=='1'">发送失败
                    <span class="base-color">{{failure}}</span>条</span>
            </div>
            <div class="table">
                <Table border :columns="columns" :data="list"></Table>
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
    name: 'smsReport',
    components: {
        Pagination
    },
    data() {
        return {
            currentPage: 1,
            totalPages: 0,
            formFilter: {
                isSuccess: '',
                startTime: '',
                endTime: '',
            },
            isSuccessShow: true,
            isFailureShow: true,
            success: 0,
            failure: 0,
            formFilterCache: {},
            columns: [
                {
                    title: '手机',
                    key: 'phone'
                },
                {
                    title: '发送时间',
                    key: 'createTime',
                    render: (h, params) => {
                        const time = this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss')
                        return h('span', time)
                    }
                },
                {
                    title: '发送状态',
                    key: 'isSuccess',
                    render: (h, params) => {
                        return h('span', params.row.isSuccess ? '发送成功' : '发送失败')
                    }
                }
            ],
            list: []
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 缓存表单数据
        handleFormCache() {
            this.formFilterCache = Object.assign({}, this.formFilter)
            this.currentPage = 1
        },
        // 筛选
        handleFilter(name) {
            if (document.querySelector('.time-error-tips')) {
                return
            }
            this.handleFormCache()
            this.getList()
        },
        getList() {
            const form = this.formFilterCache
            form.startTime = form.startTime ? this.$moment(form.startTime).format('YYYY-MM-DD') : ''
            form.endTime = form.endTime ? this.$moment(form.endTime).format('YYYY-MM-DD') : ''

            const params = Object.assign({}, form, {
                pageNum: this.currentPage,
                pageSize: 10,
            })
            api.smsManage.smsRecordList(params).then(res => {
                if (res.data.code === 200) {
                    this.list = res.data.data.pageInfos.list || []
                    this.totalPages = res.data.data.pageInfos.total

                    if (this.formFilter.isSuccess == '0') {
                        this.failure = res.data.data.default
                    }
                    if (this.formFilter.isSuccess == '1') {
                        this.success = res.data.data.success
                    }

                    if (!this.formFilter.isSuccess) {
                        this.failure = res.data.data.default
                        this.success = res.data.data.success
                    }
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields();
            this.handleFormCache()
            this.getList()
        },

        handlePageNumChange(pageNum) {
            this.currentPage = pageNum
            this.getList()
        }
    },
    computed: {
        isSeletDateError() {
            return this.formFilter.queryStartTime && this.formFilter.queryEndTime && this.formFilter.queryStartTime > this.formFilter.queryEndTime
        }
    }
}
</script>
<style lang="less" scoped>
.status {
  font-size: 14px;
  margin: 20px 0;
}
</style>


