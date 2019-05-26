<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>监督管理</BreadcrumbItem>
            <BreadcrumbItem>举报统计</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="filter">
                <Form ref="formFilter" :model="formFilter" inline :label-width="85">
                    <FormItem label="统计方式：" prop="status">
                        <Select v-model="formFilter.status" style="width:160px" clearable placeholder="请选择统计方式">
                            <Option value="1001">跟进状态</Option>
                            <Option value="1002">回复状态</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="举报性质：" prop="itemId">
                        <Select v-model="formFilter.itemId" style="width:160px" clearable placeholder="请选择举报性质">
                            <Option v-for="item in reportTypeList" :value="item.id" :key="item.id">{{ item.dicName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="举报日期：">
                        <Row>
                            <Col span="11">
                            <FormItem prop="queryStartTime">
                                <DatePicker type="date" placeholder="请选择开始日期" :editable="false" style="width:160px;" v-model="formFilter.queryStartTime"></DatePicker>
                            </FormItem>
                            </Col>
                            <Col span="2" style="text-align: center">&nbsp;</Col>
                            <Col span="11">
                            <FormItem prop="queryEndTime">
                                <DatePicker type="date" placeholder="请选择结束日期" :editable="false" style="width:160px;" v-model="formFilter.queryEndTime"></DatePicker>
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
                <Table border :columns="columns" :data="list"></Table>
                <ul class="total">
                    <li>总计</li>
                    <li>{{total}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/api'
import { reportTypeMixin } from '@/mixins/reportTypeMixin'
export default {
    name: 'reportStatistics',
    mixins: [reportTypeMixin],
    data() {
        return {
            total: '',
            formFilter: {
                status: '',
                itemId: '',
                queryStartTime: '',
                queryEndTime: ''
            },
            formFilterCache: {},
            columns: [
                {
                    title: '状态描述',
                    key: 'status',
                    render: (h, params) => {
                        let status = this.computedProcessStatus(params.row.status)
                        return h('span', status)
                    }
                },
                {
                    title: '统计数量',
                    key: 'amount'
                },
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
        handleReset(name) {
            this.$refs[name].resetFields()
            this.handleFormCache()
            this.getList()
        },
        getList() {
            const form = Object.assign({},this.formFilterCache)
            form.queryStartTime = form.queryStartTime ? this.$moment(form.queryStartTime).format('YYYY-MM-DD'):null
            form.queryEndTime = form.queryEndTime ? this.$moment(form.queryEndTime).format('YYYY-MM-DD'):null
            api.reportManage.reportStatisticsList(form).then(res => {
                if (res.data.code === 200) {
                    this.list = res.data.data || []
                    let total = 0
                    this.list.forEach(item => {
                        total += item.amount
                    })
                    this.total = total
                }
            })
        },
        handleExport() {
             const form = Object.assign({},this.formFilterCache)
            form.queryStartTime = form.queryStartTime ? this.$moment(form.queryStartTime).format('YYYY-MM-DD'):null
            form.queryEndTime = form.queryEndTime ? this.$moment(form.queryEndTime).format('YYYY-MM-DD'):null

            api.reportManage.reportStatisticsExport(form).then(res => {
                location.href = res.request.responseURL
            })
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
.total {
  font-size: 0;
  li {
    font-size: 12px;
    display: inline-block;
    width: 50%;
    text-align: center;
    height: 48px;
    line-height: 48px;
    vertical-align: top;
    background-color: #f8f8f9;
    border-right: 1px solid #e9eaec;
    border-bottom: 1px solid #e9eaec;
    &:first-child {
      border-left: 1px solid #e9eaec;
      color: #495060;
      font-weight: 700;
    }
  }
}
</style>
