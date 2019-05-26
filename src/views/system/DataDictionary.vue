<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>数据字典</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="filter">
                <Form ref="formFilter" :model="formFilter" inline :label-width="80">
                    <FormItem label="名称：" prop="dicName">
                        <Input type="text" v-model="formFilter.dicName" placeholder="请输入名称" clearable></Input>
                    </FormItem>
                    <FormItem label="发布状态：" prop="isAble">
                        <Select v-model="formFilter.isAble" style="width:160px" clearable placeholder="请选择发布状态">
                            <Option value="1">激活</Option>
                            <Option value="0">冻结</Option>
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
                <Button type="primary" @click="handleNew">新建</Button>
            </div>
            <div class="table">
                <Table border :columns="columns" :data="dictionaryList"></Table>
            </div>
            <div class="page-wapper">
                <Pagination :totalPages="totalPages" :currentPage="currentPage" @on-change="handlePageNumChange"></Pagination>
            </div>
        </div>
        <Modal v-model="modal" :title="title" @on-cancel="handleReset('formAdd')" :mask-closable="false" width="500">
            <div class="form block-center">
                <Form ref="formAdd" :model="formAdd" :label-width="80" :rules="ruleValidate">
                    <FormItem label="类型：" prop="classCode">
                        <Select v-model="formAdd.classCode" clearable placeholder="请选择发布状态">
                            <!-- <Option value="CONSULT">咨询事项</Option> -->
                            <Option value="REPORT">举报事项</Option>
                            <!-- <Option value="PERSON">个人违规事项</Option>
                            <Option value="COMPANY">企业违规事项</Option>
                            <Option value="ARTICLE">文章类型</Option> -->
                        </Select>
                    </FormItem>
                    <FormItem label="名称：" prop="dicName">
                        <Input type="text" v-model.trim="formAdd.dicName" :maxlength="20" placeholder="请输入名称" clearable></Input>
                    </FormItem>
                    <FormItem label="排序：" prop="sortNum">
                        <Input type="text" v-model="formAdd.sortNum" :maxlength="2" placeholder="请输入排序号" @on-keyup="handleInputChange" clearable></Input>
                    </FormItem>
                    <FormItem label="是否外链">
                        <RadioGroup v-model="formAdd.isOuter">
                            <Radio label="1">是</Radio>
                            <Radio class="outerlink" v-if="formAdd.isOuter==1">
                                <FormItem prop="url">
                                    <Input type="text" v-model.trim="formAdd.url" style="width:220px;" :maxlength="50" placeholder="请输入外链" clearable></Input>
                                </FormItem>
                            </Radio>
                            <Radio label="0">否</Radio>
                        </RadioGroup>
                        <!-- <p class="base-color" style="margin-top:20px;" v-if="formAdd.isOuter==1">添加外链的事项只显示在H5页面，web页面不显示</p> -->
                    </FormItem>

                    <FormItem label="备注：" prop="remark">
                        <Input v-model.trim="formAdd.remark" type="textarea" :maxlength="50" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" class="text-center">
                <Button type="primary" @click="handleSubmit('formAdd')">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import api from '@/api/api'
export default {
    name: 'dataDictionary',
    components: {
        Pagination
    },
    data() {
        const validateUrl = (rule, value, callback) => {
            var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
            if (value == '') {
                callback(new Error('请输入外链'))
            }
            else if (!Expression.test(value)) {
                callback(new Error('链接格式错误'))
            } else {
                callback()
            }
        }
        return {
            modal: false,
            title: '',
            totalPages: 0,
            currentPage: 1,
            ruleValidate: {
                classCode: [{ required: true, message: '请选择类型', trigger: 'change' },],
                dicName: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { type: 'string', min: 2, message: '名称不能少于两个字符', trigger: 'blur' }
                ],
                url: [{ required: true, validator: validateUrl,  trigger: 'blur' }],
            },
            formFilter: {
                dicName: '',
                isAble: ''
            },
            formFilterCache: {},
            formAdd: {
                classCode: '',
                sortNum: '',
                dicName: '',
                isOuter: '0',
                url: ''
            },
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
                    title: '名称',
                    key: 'dicName'
                },
                {
                    title: '链接',
                    key: 'url'
                },
                {
                    title: '类型',
                    key: 'classCode',
                    render: (h, params) => {
                        const classCode = params.row.classCode
                        let classText = ''
                        switch (classCode) {
                            case 'CONSULT':
                                classText = '咨询事项'
                                break
                            case 'REPORT':
                                classText = '举报事项'
                                break
                            case 'PERSON':
                                classText = '个人违规事项'
                                break
                            case 'COMPANY':
                                classText = '企业违规事项'
                                break
                            case 'ARTICLE':
                                classText = '文章类型'
                                break
                            default:
                                break
                        }
                        return h('span', classText)
                    }
                },
                {
                    title: '备注',
                    key: 'remark',
                    // width: 200,
                    render: (h, params) => {
                        const remark = params.row.remark
                        return h('div', {
                            attrs: {
                                class: 'td-font',
                            }
                        }, [h('div', {
                            attrs: {
                                class: 'font-hidden-two',
                            }
                        }, remark),
                        h('div', {
                            attrs: {
                                class: 'td-hover',
                            }
                        }, remark)])
                    }
                },
                {
                    title: '状态',
                    key: 'isAble',
                    width: 80,
                    render: (h, params) => {
                        return h('span', params.row.isAble ? '激活' : '冻结')
                    }
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 150,
                    render: (h, params) => {
                        const time = this.$moment(params.row.createTime).format(
                            'YYYY-MM-DD HH:mm'
                        )
                        return h('span', time)
                    }
                },
                {
                    title: '创建人',
                    key: 'createCode',
                    width: 150
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 110,
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
                                        this.dictionaryId = params.row.id
                                        this.getDictionaryDetail(params.row.id)
                                    }
                                }
                            }, '修改'),
                            params.row.isAble == 1 ?
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
                                                content: '<p>确定冻结当前举报事项？</p>',
                                                width: '300',
                                                onOk: () => {
                                                    this.handleFreeze(params.row.id)
                                                }
                                            });
                                        }
                                    }
                                }, '冻结') : '',
                            params.row.isAble == 0 ?
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
                                                content: '<p>确定解冻当前举报事项？</p>',
                                                width: '300',
                                                onOk: () => {
                                                    this.handleUnFreeze(params.row.id)
                                                }
                                            });
                                        }
                                    }
                                }, '解冻') : ''
                        ])
                    }
                }
            ],
            dictionaryList: [],
            dictionaryId: ''
        }
    },
    created() {
        this.getDictionaryList()
    },
    methods: {
        // 缓存表单数据
        handleFormCache() {
            this.formFilterCache = Object.assign({}, this.formFilter)
            this.currentPage = 1
        },
        getDictionaryList() {
            let params = {
                dicName: this.formFilterCache.dicName,
                isAble: this.formFilterCache.isAble,
                pageNum: this.currentPage,
                pageSize: 10,
            }
            api.dictionaryManage.dictionaryList(params).then(res => {
                if (res.data.code === 200) {
                    this.dictionaryList = res.data.data.list || []
                    this.totalPages = res.data.data.total
                }
            })
        },
        handleFilter(name) {
            this.handleFormCache()
            this.getDictionaryList()
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (this.title === '新建') {
                        this.handleAdd()
                    } else {
                        this.handleUpdate()
                    }
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields();
            if (name === 'formFilter') {
                this.handleFormCache()
                this.getDictionaryList()
            }
        },
        handleNew() {
            this.modal = true
            this.title = '新建'
        },
        handleAdd() {
            this.formAdd.url = this.formAdd.isOuter == 0 ? '' : this.formAdd.url
            const formData = this.$qs.stringify(this.formAdd)
            api.dictionaryManage.dictionaryAdd(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success('字典信息保存成功!')
                    this.modal = false
                    this.$refs['formAdd'].resetFields();
                    this.getDictionaryList()
                }
            })
        },
        handleUpdate() {
            this.formAdd.url = this.formAdd.isOuter == 0 ? '' : this.formAdd.url
            const formData = this.$qs.stringify(Object.assign(this.formAdd, { id: this.dictionaryId }))
            api.dictionaryManage.dictionaryUpdate(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success('字典信息保存成功!')
                    this.modal = false
                    this.$refs['formAdd'].resetFields();
                    this.getDictionaryList()
                }
            })
        },

        getDictionaryDetail(id) {
            const params = { id }
            api.dictionaryManage.dictionaryDetail(params).then(res => {
                if (res.data.code === 200) {
                    for (let key in this.formAdd) {
                        this.formAdd[key] = res.data.data[key]
                    }
                    this.formAdd.isOuter = this.formAdd.isOuter + ''
                    this.modal = true
                    this.title = '编辑'
                }
            })
        },
        handleFreeze(id) {
            const formData = this.$qs.stringify({ id })
            api.dictionaryManage.dictionaryFreeze(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success('数据已经激活!')
                    this.getDictionaryList()
                }
            })
        },
        handleUnFreeze(id) {
            const formData = this.$qs.stringify({ id })
            api.dictionaryManage.dictionaryUnFreeze(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success('数据已经冻结!')
                    this.getDictionaryList()
                }
            })
        },
        handlePageNumChange(pageNum) {
            this.currentPage = pageNum
            this.getDictionaryList()
        },
        handleInputChange(e) {
            this.formAdd.sortNum = e.target.value.replace(/[^\d]/g, '')
        }
    }
}
</script>
<style lang="less" scoped>
.form {
  width: 400px;
}
.outerlink {
  /deep/ .ivu-radio {
    display: none;
  }
}
</style>
