<template>
  <div class="main">
    <Breadcrumb>
      <BreadcrumbItem>违规信息管理</BreadcrumbItem>
      <BreadcrumbItem>违规企业管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="main-content">
      <div class="filter">
        <Form ref="formFilter" :model="formFilter" inline :label-width="80">
          <FormItem label="企业名称：" prop="name">
            <Input type="text" v-model="formFilter.name" placeholder="请输入企业名称" clearable></Input>
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
        <Button type="ghost" @click="importModal=true">导入</Button>
      </div>
      <div class="table">
        <Table border :columns="columns" :data="illegalCompanyList"></Table>
      </div>
      <div class="page-wapper">
        <Pagination :totalPages="totalPages" :currentPage="currentPage" @on-change="handlePageNumChange"></Pagination>
      </div>
    </div>
    <Modal v-model="modal" :title="title" @on-cancel="handleReset('formAdd')" :mask-closable="false">
      <div class="form block-center">
        <Form ref="formAdd" :model="formAdd" :label-width="130" :rules="ruleValidate">
          <FormItem label="违规企业名称：" prop="name" class="po_re">
            <Input type="text" v-model="formAdd.name" :maxlength="30" placeholder="请输入违规企业名称" clearable></Input>
            <div class="safari-mask"></div>
          </FormItem>
          <FormItem label="统一社会信用代码：" prop="idCard" class="po_re">
            <Input type="text" v-model="formAdd.idCard" :maxlength="18" @on-keyup="handleInputChange" placeholder="请输入统一社会信用代码" clearable></Input>
            <div class="safari-mask"></div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" class="text-center">
        <Button type="primary" @click="handleSubmit('formAdd')">保存</Button>
      </div>
    </Modal>
    <Modal v-model="importModal" title="导入" @on-cancel="handleClose" :mask-closable="false">
      <div class="form block-center">
        <div class="clearfix">
          <div class="fl">
            <span style="color:#18b566;">成功：{{this.successNum}}</span>&nbsp;&nbsp;&nbsp;
            <span style="color:#ed3f14;">失败：{{this.failNum}}</span>
          </div>
          <div class="fr" v-if="this.failNum">
            <Button type="ghost" class="validate-tips" @click="handleExportFail">
              <Icon type="ios-cloud-download-outline"></Icon> 导出错误信息</Button>
          </div>
        </div>
        <Upload :action="uploadUrl" :before-upload="handleUpload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :format="['.xlsx']">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击上传</p>
          </div>
        </Upload>
        <a href="./static/template-company.xlsx" download="违规企业导入模板.xlsx" class="download">下载模板</a>
      </div>
      <div slot="footer" class="text-center">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import api from '@/api/api'
export default {
  name: 'illegalCompany',
  components: {
    Pagination
  },
  data() {
    const validateId = (rule, value, callback) => {
      const reg = /^[0-9A-Z]+$/;
      if (value === '') {
        callback(new Error('请输入统一社会信用代码'));
      } else if (value.length !== 18 || !reg.test(value)) {
        callback(new Error('请输入正确的统一社会信用代码'));
      } else {
        callback();
      }
    };
    return {
      modal: false,
      importModal: false,
      title: '',
      totalPages: 0,
      currentPage: 1,
      successNum: 0,
      failNum: 0,
      formFilter: {
        name: ''
      },
      formFilterCache: {},
      formAdd: {
        name: '',
        idCard: ''
      },
      currentCompanyId: '',
      ruleValidate: {
        name: [
          { required: true, message: '请输入违规企业名称', trigger: 'blur' },
          { type: 'string', min: 2, message: '企业名称不能少于两个字符', trigger: 'blur' }
        ],
        idCard: [
          { required: true, validator: validateId, trigger: 'blur' }
        ]
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
          title: '企业名称',
          key: 'name'
        },
        {
          title: '统一社会信用代码',
          key: 'idCard'
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
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
                    this.currentCompanyId = params.row.id
                    this.getCompanyDetail(params.row.id)
                  }
                }
              }, '修改'),
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
                      content: '<p>确定删除当前违规企业信息？</p>',
                      width: '300',
                      onOk: () => {
                        this.handleDelete(params.row.id)
                      }
                    });
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      illegalCompanyList: []
    }
  },
  created() {
    this.getIllegalCompanyList()
  },
  methods: {
    // 缓存表单数据
    handleFormCache() {
      this.formFilterCache = Object.assign({}, this.formFilter)
      this.currentPage = 1
    },
    getIllegalCompanyList() {
      let params = {
        name: this.formFilterCache.name,
        pageNum: this.currentPage,
        pageSize: 10,
      }
      api.illegalInfoManage.illegalCompanyList(params).then(res => {
        if (res.data.code === 200) {
          this.illegalCompanyList = res.data.data.list || []
          this.totalPages = res.data.data.total
        }
      })
    },
    handleFilter(name) {
      this.handleFormCache()
      this.getIllegalCompanyList()
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
    handleInputChange(e) {
      this.formAdd.idCard = e.target.value.toUpperCase()
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      if (name === 'formFilter') {
        this.handleFormCache()
        this.getIllegalCompanyList()
      }
    },
    handleNew() {
      this.modal = true
      this.title = '新建'
    },
    handleAdd() {
      const formData = this.$qs.stringify(this.formAdd)
      api.illegalInfoManage.illegalCompanyAdd(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('违规企业信息保存成功!')
          this.modal = false
          this.$refs['formAdd'].resetFields();
          this.getIllegalCompanyList()
        } else if (res.data.code === 403) {
          this.$Message.error(res.data.msg)
        }
      })
    },
    handleUpdate() {
      const formData = this.$qs.stringify(Object.assign(this.formAdd, { id: this.currentCompanyId }))
      api.illegalInfoManage.illegalCompanyUpdate(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('违规企业信息保存成功!')
          this.modal = false
          this.$refs['formAdd'].resetFields();
          this.getIllegalCompanyList()
        } else if (res.data.code === 403) {
          this.$Message.error(res.data.msg)
        }
      })
    },
    handleExportFail() {
      api.illegalInfoManage.illegalCompanyFailExport().then(res => {
        location.href = res.request.responseURL
      })
    },
    handleImport(file) {
      const formData = new FormData()
      formData.append('file', file)
      api.illegalInfoManage.illegalCompanyImport(formData).then(res => {
        if (res.data.code === 200) {
          this.successNum = res.data.data.successNum
          this.failNum = res.data.data.failNum
          this.getIllegalCompanyList()
        } else if(res.data.code === 400) {
          this.$Message.error(res.data.msg);
        }
      })
    },
    handleClose() {
      this.successNum = this.failNum = 0
      this.importModal = false
    },
    handleUpload(file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$Notice.warning({
          title: '文件格式错误',
          desc: '文件 ' + file.name + ' 格式错误, 请选择xlsx格式文件'
        })
        return false
      }
      if (file.size / 1024 / 1024 > 8) {
        this.$Notice.warning({
          title: '文件大小超过限制',
          desc: '文件  ' + file.name + ' 超限, 大小不能超过 8M.'
        });
        return false
      }
      this.handleImport(file)
      return false;
    },
    getCompanyDetail(id) {
      const params = { id }
      api.illegalInfoManage.illegalCompanyDetail(params).then(res => {
        if (res.data.code === 200) {
          for (let key in this.formAdd) {
            this.formAdd[key] = res.data.data[key]
          }
          this.modal = true
          this.title = '编辑'
        }
      })
    },
    handleDelete(id) {
      const formData = this.$qs.stringify({ id })
      api.illegalInfoManage.illegalCompanyDelete(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('违规企业信息删除成功!')
          this.getIllegalCompanyList()
        }
      })
    },
    handlePageNumChange(pageNum) {
      this.currentPage = pageNum
      this.getIllegalCompanyList()
    }
  },
  computed: {
    uploadUrl() {
      return this.$axios.defaults.baseURL + 'company/import'
    }
  }
}
</script>
<style lang="less" scoped>
.form {
  width: 400px;
  /deep/ .ivu-upload {
    text-align: center;
    border: 1px dashed #2d8cf0;
    margin: 10px 0;
    .ivu-upload-select {
      width: 100%;
      border: none;
    }
  }
}
</style>
