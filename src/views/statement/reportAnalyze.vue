<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>监督管理</BreadcrumbItem>
            <BreadcrumbItem>举报管理</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="filter">
                <Form ref="formFilter" :model="formFilter" inline :label-width="85">
                    <FormItem label="举报标题：">
                        <Input type="text" v-model="formFilter.docTitle" placeholder="请输入姓名" clearable></Input>
                    </FormItem>

                    <FormItem label="违规事项：">
                        <Select v-model="formFilter.illegalType" style="width:160px" clearable placeholder="请选择违规事项">
                            <Option v-for="item in illegalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="举报日期：">
                        <Row>
                            <Col span="11">
                            <DatePicker type="date" placeholder="请选择开始日期" v-model="formFilter.startDate"></DatePicker>
                            </Col>
                            <Col span="2" style="text-align: center">&nbsp;</Col>
                            <Col span="11">
                            <DatePicker type="date" placeholder="请选择结束日期" v-model="formFilter.endDate"></DatePicker>
                            </Col>
                        </Row>
                        <span class="time-error-tips" v-if="isSeletDateError">开始日期不能小于结束日期</span>
                    </FormItem>
                    <FormItem label="被举报对象：" class="">
                        <Select v-model="formFilter.docType" style="width:160px" clearable placeholder="请选择跟进状态">
                            <Option v-for="item in reportedList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="跟进状态：" class="">
                        <Select v-model="formFilter.docType" style="width:160px" clearable placeholder="请选择跟进状态">
                            <Option v-for="item in followList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem class=" filter-btn-group">
                        <Button type="primary" @click="handleFilter('formFilter')">查询</Button>
                        <Button type="ghost" @click="handleReset('formFilter')">重置</Button>
                    </FormItem>

                    <input type="text" style="display:none" />
                </Form>
            </div>
            <div class="handle-btn">
                <Button type="primary" @click="handleNew">新建</Button>
                <Button type="ghost" @click="handleImport">导入</Button>
            </div>
            <div class="table">
                <Table border @on-selection-change="handleSelectChange" :columns="columns" :data="data"></Table>
            </div>
            <div class="page-wapper">
                <Page :total="total" :current="currentPage" show-elevator @on-change="handlePageNumChange"></Page>
                <Button type="ghost" class="btn-go" @click="handleFilter('formFilter')">go</Button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'document',
    data() {
        return {
            total: 30,
            currentPage: 1,
            reportedList:[],
            followList:[],
            illegalList: [],
            formFilter: {
                illegalType: '',
                docTitle: '',
                startDate: '',
                endDate: ''
            },
            columns: [
                // {
                //   type: 'selection',
                //   width: 60,
                //   align: 'center'
                // },
                {
                    title: '序号',
                    render: (h, params) => {
                        return h('span', params.index + 1)
                    }
                },
                {
                    title: '咨询标题',
                    key: 'age'
                },
                {
                    title: '违规事项',
                    key: 'address'
                },
                {
                    title: '咨询人姓名',
                    key: 'address'
                }, {
                    title: '咨询人联系方式',
                    key: 'address'
                }, {
                    title: '咨询时间',
                    key: 'address'
                }, {
                    title: '跟进状态',
                    key: 'address'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    type: 'text',
                                    size: 'small',
                                    title: "确认删除？"
                                },
                                style: {
                                    marginRight: '15px',
                                    marginLeft: '8px'
                                },
                                on: {
                                    click: () => {
                                        this.handleDelete(params.row.id)
                                    }
                                }
                            }, '跟进'),
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
                                        this.handleView(params.row.id)
                                    }
                                }
                            }, '详情')
                        ])
                    }
                }
            ],
            data: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01'
                }
            ]
        }
    },
    methods: {
        handleFilter(name) {

        },
        handleReset() {

        },
        handleView() {

        },
        handleNew() {

        },
        handleImport() {

        },
        handleDelete() {

        },
        handlePageNumChange(pageNum) {
            console.log(pageNum);
            this.currentPage = pageNum
        },
        handleSelectChange(select) {
          console.log(select);
        }
    },
    computed: {
        isSeletDateError() {
            return this.formFilter.startDate && this.formFilter.endDate && this.formFilter.startDate > this.formFilter.endDate
        }
    }
}
</script>
<style lang="less" scoped>

</style>
