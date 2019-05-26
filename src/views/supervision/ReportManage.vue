<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>监督管理</BreadcrumbItem>
            <BreadcrumbItem>举报管理</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="filter">
                <Form ref="formFilter" :model="formFilter" inline :label-width="100">
                    <FormItem label="举报名称：" prop="theme">
                        <Input type="text" v-model="formFilter.theme" :maxlength="50" placeholder="请输入举报名称" clearable></Input>
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
                    <FormItem label="员工类型：" prop="entityType">
                        <Select v-model="formFilter.entityType" style="width:160px" clearable placeholder="请选择员工类型">
                            <Option value="1">滴滴员工</Option>
                            <Option value="2">合作伙伴</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="举报对象姓名：" prop="personName">
                        <Input type="text" v-model="formFilter.personName" :maxlength="50" placeholder="请输入举报对象姓名" clearable></Input>
                    </FormItem>
                    <FormItem label="举报渠道：" prop="source">
                        <Select v-model="formFilter.source" style="width:160px" clearable placeholder="请选择举报渠道">
                            <Option value="3">微信</Option>
                            <Option value="1">web</Option>
                            <Option value="2">手机</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="跟进状态：" prop="processStatus">
                        <Select v-model="formFilter.processStatus" style="width:160px" clearable placeholder="请选择跟进状态">
                            <Option value="2">未查看</Option>
                            <Option value="3">已查看-未导入系统</Option>
                            <Option value="4">已查看-已导入系统</Option>
                            <Option value="5">完成</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="回复状态：" prop="replayStatus">
                        <Select v-model="formFilter.replayStatus" style="width:160px" clearable placeholder="请选择回复状态">
                            <Option value="0">未回复</Option>
                            <Option value="1">已回复</Option>
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
                <Button type="primary" @click="handleExport">导出</Button>
                <div class="inline-block">
                    <Button type="primary" class="no-margin-right" @click="isShow=!isShow">批量操作</Button>
                    <ButtonGroup v-show="isShow">
                        <Button type="ghost" class="no-margin-right btn-batch-item" @click="handleImportBatch">导入系统</Button>
                        <Button type="ghost" class="no-margin-right btn-batch-item" @click="handleCompleteBatch">完成</Button>
                    </ButtonGroup>
                </div>
            </div>
            <div class="table">
                <Table border :columns="isShow?columnsSelect:columns" @on-sort-change="handleSortChange" @on-selection-change="handeSelectionChange" :data="reportList"></Table>
            </div>
            <div class="page-wapper">
                <Pagination :totalPages="totalPages" :currentPage="currentPage" @on-change="handlePageNumChange"></Pagination>
            </div>
        </div>
        <Modal v-model="modal" title="举报详情" class="modal" :mask-closable="false" width="800">
            <div slot="header" class="ivu-modal-header-inner">
                <span class="base-color detail-code">{{detail.code}}</span>
                <span>举报详情</span>
            </div>
            <div class="category">
                <h5>举报信息</h5>
                <div class="content">
                    <div class="clearfix item">
                        <span class="label fl">举报对象：</span>
                        <div class="fl">
                            <div class="detail" v-for="item in detail.reportedPersonList">
                                <span>{{item.type==1?'滴滴员工':'合作伙伴'}}</span>
                                <ul>
                                    <li>
                                        <span class="person-detail">姓名：{{item.name}}</span>
                                        <span class="person-detail" v-if="item.type==1">工号：{{item.empId}}</span>
                                        <span class="person-detail person-detail-dpt" v-if="item.type==1">部门：{{item.department}}</span>
                                        <span class="person-detail person-detail-dpt" v-if="item.type==2">公司：{{item.companyName}}</span>
                                        <span class="person-detail fr">职位：{{item.position}}</span>
                                    </li>
                                    <li></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix item">
                        <span class="label fl">违规性质：</span>
                        <div class="fl" style="width:600px;">
                            {{detail.itemId}}
                        </div>
                    </div>
                    <div class="clearfix item">
                        <span class="label fl">举报名称：</span>
                        <div class="fl">
                            {{detail.theme}}
                        </div>
                    </div>
                    <div class="clearfix item">
                        <span class="label fl">举报详情：</span>
                        <div class="fl" style="max-width:650px;">
                            {{detail.content}}
                        </div>
                    </div>
                    <div class="clearfix item">
                        <span class="label fl">附件：</span>
                        <div class="fl" v-if="detail.fileList&&detail.fileList.length">
                            <div v-for="item in detail.fileList" :key="item.id">
                                <span style="margin-right:5px;">{{item.fileName}}</span>
                                <a href="javascript:;" @click="handleDownload(item.fileKey)">下载</a>
                            </div>
                        </div>
                        <span v-else>无</span>

                    </div>
                    <div class="clearfix item">
                        <span class="label fl">举报渠道：</span>
                        <div class="fl">
                            {{computedReportSource(detail.source)}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="category">
                <h5>举报人信息</h5>
                <div class="content">
                    <div class="clearfix item">
                        <span class="label-long  fl">举报人姓名：</span>
                        <div class="fl">
                            {{detail.applicantName}}
                        </div>
                    </div>
                    <div class="clearfix item">
                        <span class="label-long  fl">举报人联系方式：</span>
                        <div class="fl">
                            {{detail.applicantPhone}}
                        </div>
                    </div>
                    <div class="clearfix item">
                        <span class="label-long  fl">举报人邮箱：</span>
                        <div class="fl">
                            {{detail.applicantEmail}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="category">
                <h5>跟进信息
                    <span>（距举报时间已累计{{detail.totalDays}}天）</span>
                </h5>
                <div class="report-process-wrapper">
                    <div class="line"></div>
                    <div v-for="item in detail.reportProcessList" :key="item.id" class="report-process-w">
                        <div class="content report-process" v-if="item.type==2">
                            <span class="label">举报时间：</span>{{computedDate(item.createTime)}}</div>
                        <div class="content report-process clearfix" v-if="item.type!==2">
                            <div class="item">
                                <p class="status">
                                    <span class="label">跟进状态：</span>
                                    <span>{{computedStutas(item.type)}}</span>
                                </p>
                                <p v-if="item.remark" class="remark clearfix">
                                    <span class="label fl">备注：</span>
                                    <span class="fl remark-content">{{item.remark}}</span>

                                </p>
                            </div>
                            <!-- <div class="duration">
                                累计时长：
                                <span>（{{item.days}}）天</span>
                            </div> -->
                            <div class="time-line">
                                <span class="dot"></span>
                                <span class="date">{{computedDate(item.createTime)}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="category">
                <h5>回复信息</h5>
                <div class="report-process-wrapper">
                    <div class="content">
                        <div class="clearfix item">
                            <span class="label fl">{{detail.replayStatus?'已回复':'未回复'}}</span>
                        </div>
                        <div class="clearfix item">
                            <span class="label fl">备注：</span>
                            <div class="fl">
                                {{detail.remark}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="text-center">
                <Button class="base-color" v-if="detail.processStatus == 2 || detail.processStatus == 3 " type="text" @click="modalReply = true;title='导入系统'">导入系统</Button>
                <Poptip confirm placement='bottom' ok-text='回复' cancel-text='未回复' @on-ok="handleReply(1,detail.replayStatus)" @on-cancel="handleReply(0,detail.replayStatus)">
                    <Button type="text">回复</Button>
                </Poptip>
                <Button class="base-color" v-if="detail.processStatus == 4 || detail.processStatus == 3 " type="text" @click="modalComplete = true">完成</Button>
                <Button type="primary" @click="modal=false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="modalReply" @on-cancel="handleClose" :title="title">
            <div class="clearfix">
                <span class="remark fl">备注：</span>
                <Input class="fl" v-model.trim="updatePramas.remark" type="textarea" style="width:440px;" :maxlength="40" :autosize="{minRows: 2,maxRows: 8}" placeholder="请输入备注"></Input>
            </div>
            <div slot="footer" class="text-center">
                <Button type="primary" @click="handleSave('import')">保存</Button>
            </div>
        </Modal>
        <Modal v-model="modalReplyBatch" @on-cancel="handleClose" title="导入系统">
            <div class="clearfix">
                <span class="remark fl">备注：</span>
                <Input class="fl" v-model.trim="updatePramas.remark" type="textarea" style="width:440px;" :maxlength="40" :autosize="{minRows: 2,maxRows: 8}" placeholder="请输入备注"></Input>
            </div>
            <div slot="footer" class="text-center">
                <Button type="primary" @click="handleUpdateBatch(4)">保存</Button>
            </div>
        </Modal>
        <Modal v-model="modalComplete" class="modalComplete" title="提示" width="300">
            <Icon size="36" color="#ff9900" type="help-circled"></Icon>
            <span>确定完成该举报案件？</span>
            <div slot="footer">
                <Button type="text" @click="handleClose">取消</Button>
                <Button type="primary" @click="handleSave('complete')">确定</Button>
            </div>
        </Modal>
        <Modal v-model="modalCompleteBatch" class="modalComplete" title="提示" width="300">
            <Icon size="36" color="#ff9900" type="help-circled"></Icon>
            <span>确定完成该举报案件？</span>
            <div slot="footer">
                <Button type="text" @click="handleClose">取消</Button>
                <Button type="primary" @click="handleUpdateBatch(5)">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { reportTypeMixin } from '@/mixins/reportTypeMixin'
import api from '@/api/api'
export default {
    name: 'report',
    mixins: [reportTypeMixin],
    components: {
        Pagination
    },
    data() {
        return {
            isShow: false,
            totalPages: 30,
            modal: false,
            modalComplete: false,
            modalReplyBatch: false,
            modalCompleteBatch: false,
            modalReply: false,
            currentPage: 1,
            illegalList: [],
            title: '',
            formFilter: {
                queryStartTime: '',
                queryEndTime: '',
                entityType: '',
                replayStatus: '',
                itemId: '',
                theme: '',
                processStatus: '',
                source: '',
                personName: ''
            },
            updatePramas: {
                ids: '',
                id: '',
                status: '',
                remark: ''
            },
            formFilterCache: {},
            columns: [
                {
                    title: '编号',
                    key: 'code'
                },
                {
                    title: '举报名称',
                    key: 'theme',
                    width: 200,
                },
                {
                    title: '举报性质',
                    key: 'itemId',
                    className: 'td-overflow-auto',
                    width: 150,
                },
                {
                    title: '举报对象姓名',
                    key: 'address',
                    className: 'td-overflow-auto',
                    render: (h, params) => {
                        const list = params.row.reportedPersonList || []
                        let name = ''
                        list.forEach(item => {
                            if (item.name) {
                                name += item.name + ','
                            }

                        })
                        return h('span', name.slice(0, -1))
                    }
                },
                {
                    title: '举报时间',
                    key: 'createTime',
                    sortable: true,
                    render: (h, params) => {
                        const time = this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm')
                        return h('span', time)
                    }
                }, {
                    title: '举报渠道',
                    key: 'source',
                    width: 80,
                    render: (h, params) => {
                        let source = this.computedReportSource(params.row.source)
                        return h('span', source)
                    }
                },
                {
                    title: '跟进状态',
                    key: 'processStatus',
                    render: (h, params) => {
                        let status = this.computedProcessStatus(params.row.processStatus)
                        return h('span', status)
                    }
                },
                {
                    title: '回复状态',
                    key: 'replayStatus',
                    width: 80,
                    render: (h, params) => {
                        let status = ''
                        if (params.row.replayStatus == 0) {
                            status = '未回复'
                        } else {
                            status = '已回复'
                        }
                        return h('span', status)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        const processStatus = params.row.processStatus
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
                                        this.reportId = params.row.id
                                        this.getReportDetail('view', 3, params.row.processStatus)
                                    }
                                }
                            }, '查看'),
                            processStatus == 3 ?
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
                                            this.title = '导入系统'
                                            this.modalReply = true
                                            this.reportId = params.row.id
                                        }
                                    }
                                }, '导入系统') : '',
                            processStatus == 4 || processStatus == 3 ?
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
                                            this.reportId = params.row.id
                                            this.modalComplete = true
                                        }
                                    }
                                }, '完成') : '',
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    placement: 'bottom',
                                    'ok-text': '回复',
                                    'cancel-text': '未回复'
                                },
                                style: {
                                    color: '#FC9153',
                                    cursor: 'pointer'
                                },
                                on: {
                                    'on-ok': () => {
                                        if (params.row.replayStatus == 1) {
                                            return
                                        }
                                        this.title = '已回复'
                                        this.modalReply = true
                                        this.reportId = params.row.id
                                    },
                                    'on-cancel': () => {
                                        if (params.row.replayStatus == 0) {
                                            return
                                        }
                                        this.title = '未回复'
                                        this.modalReply = true
                                        this.reportId = params.row.id
                                    },
                                }
                            }, '回复')
                        ])
                    }
                }
            ],
            detail: {},
            reportId: '',
            reportList: []
        }
    },
    created() {
        this.getReportList()
    },
    methods: {
        handleDownload(code) {
            const params = {
                code
            }
            api.reportManage.fileDownload(params).then(res => {
                location.href = res.request.responseURL
            })
        },
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
            this.updatePramas.ids = ''
            this.handleFormCache()
            this.getReportList()
        },
        getReportList() {
            const form = this.formFilterCache
            form.queryStartTime = form.queryStartTime ? this.$moment(form.queryStartTime).format('YYYY-MM-DD') : '2000-01-01'
            form.queryEndTime = form.queryEndTime ? this.$moment(form.queryEndTime).format('YYYY-MM-DD') : '3000-01-01'

            const params = Object.assign({}, form, {
                pageNum: this.currentPage,
                pageSize: 10,
            })
            api.reportManage.reportList(params).then(res => {
                if (res.data.code === 200) {
                    this.reportList = res.data.data.list.map(item => {
                        return Object.assign({}, item, {
                            _disabled: item.processStatus === 5 || item.processStatus === 2 ? true : false
                        })
                    })
                    this.totalPages = res.data.data.total
                    this.updatePramas.ids = ''
                }
            })
        },
        getReportDetail(type, status, processStatus) {
            const params = { id: this.reportId }
            api.reportManage.reportDetail(params).then(res => {
                if (res.data.code === 200) {
                    const data = res.data.data
                    this.updatePramas.id = data.id
                    if (type === 'repaly') {
                        this.modalReply = true
                    } else if (type === 'process') {
                        this.modalComplete = true
                    } else if (type === 'view') {
                        this.updatePramas.status = status
                        this.modal = true
                        this.detail = data
                        this.detail.fileList = data.fileList.filter(item => {
                            if (item.fileKey) {
                                return item
                            }
                        })
                        if (processStatus == 2) {
                            this.handleUpdate('view')
                        }

                    }

                }
            })
        },
        computedItem(id) {
            for (let key in this.reportTypeList) {
                if (this.reportTypeList[key].id == id) {
                    return this.reportTypeList[key].dicName
                }
            }
        },
        computedStutas(status) {
            if (status == 2) {
                return '未查看'
            } else if (status == 3) {
                return '已查看-未导入系统'
            } else if (status == 4) {
                return '已查看-已导入系统'
            } else if (status == 5) {
                return '完成'
            }
        },
        handleImportBatch() {
            if (!this.updatePramas.ids) {
                this.$Message.info('请选择要导入举报案件！')
                return
            }
            this.modalReplyBatch = true
        },
        handleCompleteBatch() {
            if (!this.updatePramas.ids) {
                this.$Message.info('请选择要完成举报案件！')
                return
            }
            this.modalCompleteBatch = true
        },
        handeSelectionChange(list) {

            this.updatePramas.ids = list.map(item => {
                return item.id
            }).toString()
        },
        handleSortChange(value) {
            console.log(value);
        },
        handleReply(type, status) {
            if (type == status) {
                return
            }
            this.title = type ? '已回复' : '未回复'
            this.modalReply = true
        },
        handleSave(type) {
            this.updatePramas.id = this.reportId
            if (type === 'import') {
                if (this.title === '导入系统') {
                    this.updatePramas.status = 4
                } else if (this.title === '已回复') {
                    this.updatePramas.status = 1
                } else {
                    this.updatePramas.status = 0
                }

            } else if (type === 'complete') {
                this.updatePramas.status = 5
            }
            this.handleUpdate()
        },
        handleReset(name) {
            this.updatePramas.ids = ''
            this.$refs[name].resetFields();
            this.handleFormCache()
            this.getReportList()
        },

        handleExport() {
            const form = this.formFilterCache

            form.queryStartTime = form.queryStartTime ? this.$moment(form.queryStartTime).format('YYYY-MM-DD') : ''
            form.queryEndTime = form.queryEndTime ? this.$moment(form.queryEndTime).format('YYYY-MM-DD') : ''

            api.reportManage.reportExport(form).then(res => {
                location.href = res.request.responseURL
            })
        },

        handleClose() {
            this.modalComplete = false
            this.modalReply = false
            this.modalReplyBatch = false
            this.modalCompleteBatch = false
            this.updatePramas.remark = ''
        },

        handleUpdateBatch(status) {
            this.updatePramas.status = status
            const formData = this.$qs.stringify(this.updatePramas)
            api.reportManage.reportUpdateBatch(formData).then(res => {
                if (res.data.code === 200) {
                    this.updatePramas.ids = ''
                    this.modalReplyBatch = false
                    this.modalCompleteBatch = false
                    this.updatePramas.remark = ''
                    this.getReportList()
                    if (status === 4) {
                        this.$Message.success('导入成功')
                    }

                } else {
                    if (status === 4) {
                        this.$Message.error('导入失败')
                    }

                }
            })
        },
        handleUpdate(type) {
            const formData = this.$qs.stringify(this.updatePramas)
            api.reportManage.reportUpdate(formData).then(res => {
                if (res.data.code === 200) {
                    this.modalReply = false
                    this.modalComplete = false
                    if (!type) {
                        this.modal = false
                    }
                    if (this.title == '导入系统') {
                        this.$Message.success('导入成功')
                    }

                    this.updatePramas.remark = ''
                    this.getReportList()
                } else {
                    if (this.title == '导入系统') {
                        this.$Message.error('导入失败')
                    }
                }
            })
        },
        handlePageNumChange(pageNum) {
            this.updatePramas.ids = ''
            this.currentPage = pageNum
            this.getReportList()
        },
        computedReportSource(status) {
            let source = ''
            if (status == 1) {
                source = 'web'
            } else if (status == 2) {
                source = '手机'
            } else {
                source = '微信'
            }
            return source
        },
        computedDate(date, type) {
            return this.$moment(date).format('YYYY-MM-DD HH:mm')
        }
    },
    computed: {
        isSeletDateError() {
            return this.formFilter.queryStartTime && this.formFilter.queryEndTime && this.formFilter.queryStartTime > this.formFilter.queryEndTime
        },
        columnsSelect() {
            return [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                ...this.columns
            ]
        }
    }
}
</script>
<style lang="less" scoped>
.pop-tip {
  /deep/ .ivu-poptip-body {
    display: none;
  }
}
.table,
.modal {
  /deep/ .ivu-poptip {
    vertical-align: middle;
    margin-left: 8px;
    .ivu-btn {
      background: #fff;
      border: none;
      color: #fda775;
    }
  }
  /deep/ .ivu-poptip-body {
    display: none;
  }
  /deep/ .ivu-poptip-content {
    width: 90px;
  }
  /deep/ .ivu-poptip-footer {
    padding: 10px;
    text-align: center;
  }
}
.modal {
  /deep/ .ivu-modal {
    top: 20px;
  }
  .detail-code {
    position: absolute;
    left: 10px;
  }
  .ivu-modal-header-inner {
    text-align: center;
  }
  .category {
    margin-bottom: 10px;
    h5 {
      margin-bottom: 10px;
    }
  }
  .content {
    background-color: #f4f5f7;
    padding: 10px;
    border-radius: 4px;

    .item {
      margin-bottom: 10px;
    }
    .label {
      width: 80px;
      text-align: right;
    }
    .label-long {
      width: 100px;
      text-align: right;
    }
    .detail {
      background: #ffffff;
      width: 650px;
      border-radius: 4px;
      padding: 10px;
    }
  }
}
.modalComplete {
  /deep/ .ivu-modal {
    .ivu-modal-header,
    .ivu-modal-footer {
      border: none;
    }
    .ivu-modal-footer {
      padding: 16px;
    }
    .ivu-modal-body {
      padding: 5px 16px;
    }
    .ivu-icon-help-circled {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
}
.report-process-w {
    margin-bottom: 10px;
      &:last-child {
      margin-bottom: 0;
  }
}
.report-process {
//   margin-bottom: 10px;
  width: 600px;
  position: relative;
  z-index: 1;
//   &:last-child {
//       margin-bottom: 0;
//   }
  .duration {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
  .time-line {
    width: 100px;
    height: 100%;
    top: 0;
    position: absolute;
    right: -130px;
    display: flex;
    align-items: center;
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fda775;
      margin-right: 10px;
    }
    .date {
      width: 65px;
      text-align: center;
    }
  }
  .label {
    display: inline-block;
  }
  .remark {
    margin-top: 10px;
  }
  .item {
    margin-bottom: 0 !important;
    width: 370px;
  }
}
.report-process-wrapper {
  position: relative;
  overflow: hidden;
}
.line {
  position: absolute;
  height: 100%;
  width: 2px;
  top:50px;
  background: #c9c9c9;
  right: 131px;
}
.remark-content {
  width: 280px;
}
.person-detail {
  display: inline-block;
  width: 22%;
}
.person-detail-dpt {
  width: 30%;
}
</style>


