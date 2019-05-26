<template>
  <div class="main">
    <Breadcrumb>
      <BreadcrumbItem>违规信息管理</BreadcrumbItem>
      <BreadcrumbItem>违规人员管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="main-content">
      <div class="filter">
        <Form ref="formFilter" :model="formFilter" inline :label-width="50">
          <FormItem label="姓名：" prop="name">
            <Input type="text" v-model="formFilter.name" placeholder="请输入姓名" clearable></Input>
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
        <Table border :columns="columns" :data="illegalPersonList"></Table>
      </div>
      <div class="page-wapper">
        <Pagination :totalPages="totalPages" :currentPage="currentPage" @on-change="handlePageNumChange"></Pagination>
      </div>
    </div>
    <Modal v-model="modal" :title="title" @on-cancel="handleReset('formAdd')" :mask-closable="false">
      <div class="form block-center">
        <Form ref="formAdd" :model="formAdd" :label-width="130" :rules="ruleValidate">
          <FormItem label="违规人员姓名：" prop="name" class="po_re">
            <Input type="text" v-model.trim="formAdd.name" :maxlength="20" placeholder="请输入违规人员姓名" clearable></Input>
            <div class="safari-mask"></div>
          </FormItem>
          <FormItem label="违规人员身份证号：" prop="idCard" class="po_re">
            <Input type="text" v-model.trim="formAdd.idCard" :maxlength="18" placeholder="请输入违规人员身份证号" clearable></Input>
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
        <a href="./static/template-person.xlsx" download="违规人员导入模板.xlsx" class="download">下载模板</a>
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
  name: 'illegalPerson',
  components: {
    Pagination
  },
  data() {
    const validateId = (rule, value, callback) => {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (value === '') {
        callback(new Error('请输入违规人员身份证号'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号'));
      } else {
        callback();
      }
    };
    return {
      successNum: 0,
      failNum: 0,
      importModal: false,
      modal: false,
      title: '',
      totalPages: 0,
      currentPage: 1,
      ruleValidate: {
        name: [
          { required: true, message: '请输入违规人员姓名', trigger: 'blur' },
          { type: 'string', min: 2, message: '姓名不能少于两个字符', trigger: 'blur' }
        ],
        idCard: [
          { required: true, validator: validateId, trigger: 'blur' }
        ]
      },
      formFilter: {
        name: ''
      },
      formFilterCache: {},
      formAdd: {
        name: '',
        idCard: ''
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
          title: '姓名',
          key: 'name'
        },
        {
          title: '身份证号',
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
                    this.currentPersonId = params.row.id
                    this.getPersonDetail(params.row.id)
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
                      content: '<p>确定删除当前违规人员信息？</p>',
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
      illegalPersonList: [],
      currentPersonId: ''
    }
  },
  created() {
    this.getIllegalPersonList()
  },
  methods: {
    // 缓存表单数据
    handleFormCache() {
      this.formFilterCache = Object.assign({}, this.formFilter)
      this.currentPage = 1
    },
    getIllegalPersonList() {
      let params = {
        name: this.formFilterCache.name,
        pageNum: this.currentPage,
        pageSize: 10,
      }
      api.illegalInfoManage.illegalPersonList(params).then(res => {
        if (res.data.code === 200) {
          this.illegalPersonList = res.data.data.list || []
          this.totalPages = res.data.data.total
        }
      })
    },
    handleFilter(name) {
      this.handleFormCache()
      this.getIllegalPersonList()
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
        this.getIllegalPersonList()
      }
    },
    handleNew() {
      this.modal = true
      this.title = '新建'
    },
    handleAdd() {
      const formData = this.$qs.stringify(this.formAdd)
      api.illegalInfoManage.illegalPersonAdd(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('违规人员信息保存成功!')
          this.modal = false
          this.$refs['formAdd'].resetFields();
          this.getIllegalPersonList()
        } else if (res.data.code === 403) {
          this.$Message.error(res.data.msg)
        }
      })
    },
    handleUpdate() {
      const formData = this.$qs.stringify(Object.assign({
        name:this.formAdd.name,
        idCard:this.formAdd.idCard
      }, { id: this.currentPersonId }))
      api.illegalInfoManage.illegalPersonUpdate(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('违规人员信息保存成功!')
          this.modal = false
          this.$refs['formAdd'].resetFields();
          this.getIllegalPersonList()
        } else if (res.data.code === 403) {
          this.$Message.error(res.data.msg)
        }
      })
    },
    handleExportFail() {
      api.illegalInfoManage.illegalPersonFailExport().then(res => {
        location.href = res.request.responseURL
      })
    },
    handleImport(file) {
      const formData = new FormData()
      formData.append('file', file)
      api.illegalInfoManage.illegalPersonImport(formData).then(res => {
        if (res.data.code === 200) {
          this.successNum = res.data.data.successNum
          this.failNum = res.data.data.failNum
          this.getIllegalPersonList()
        }else if(res.data.code === 400) {
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
    getPersonDetail(id) {
      const params = { id }
      api.illegalInfoManage.illegalPersonDetail(params).then(res => {
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
      api.illegalInfoManage.illegalPersonDelete(formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('违规人员信息删除成功!')
          this.getIllegalPersonList()
        }
      })
    },
    handlePageNumChange(pageNum) {
      this.currentPage = pageNum
      this.getIllegalPersonList()
    }
  },
  computed: {
    uploadUrl() {
      return this.$axios.defaults.baseURL + 'person/import'
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
.safari-mask {
  background: #fff;
  width: 30px;
  height: 24px;
  position: absolute;
  top: 5px;
  right: 4px;
}
</style>
