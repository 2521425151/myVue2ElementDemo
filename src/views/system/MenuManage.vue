<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>菜单维护</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <div class="table">
                <div class="tree-grid">
                    <div class="table-header">
                        <span class="table-th">菜单名称</span>
                        <span class="table-th table-th-link">链接</span>
                        <span class="table-th">创建时间</span>
                        <span class="table-th">创建人</span>
                        <span class="table-th table-th-btn">操作</span>
                    </div>
                    <div v-for="item in menuList" :key="item.id">
                        <div class="table-tr">
                            <span class="table-td">
                                <Icon type="arrow-right-b" :size="18" v-if="item.childList&&!item.expanded" @click.native="item.expanded=true"></Icon>
                                <Icon type="arrow-down-b" :size="18" v-if="item.childList&&item.expanded" @click.native="item.expanded=false"></Icon>
                                {{item.name}}
                            </span>
                            <span class="table-td table-td-link">{{item.url}}</span>
                            <span class="table-td">{{item.createTime | date}}</span>
                            <span class="table-td">{{item.updateCode}}</span>
                            <span class="table-td table-td-btn">
                                <Button type="text" @click="getDetail(item.id,item.parentId,item.level)">编辑</Button>
                            </span>
                        </div>
                        <template v-if="item.expanded">
                            <div class="table-tr second-level" v-for="child in item.childList" :key="child.id">
                                <span class="table-td">{{child.name}}</span>
                                <span class="table-td table-td-link">{{child.url}}</span>
                                <span class="table-td">{{child.createTime | date}}</span>
                                <span class="table-td">{{child.updateCode}}</span>
                                <span class="table-td table-td-btn">
                                    <Button type="text" @click="getDetail(child.id,child.parentId,child.level)">编辑</Button>
                                </span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-model="modal" title="编辑" @on-cancel="handleReset('formAdd')" :mask-closable="false" width="500">
            <div class="form block-center">
                <Form ref="formAdd" :model="formAdd" :label-width="80" :rules="ruleValidate">
                    <FormItem label="名称：" prop="name">
                        <Input type="text" v-model.trim="formAdd.name" :maxlength="5" placeholder="请输入名称" clearable></Input>
                    </FormItem>
                    <FormItem label="链接：" prop="url">
                        <Input v-model.trim="formAdd.url" type="text" :maxlength="200" placeholder="请输入链接"></Input>
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
import api from '@/api/api'
import Moment from 'moment'
export default {
    name: 'menuManage',
    data() {
        return {
            modal: false,
            ruleValidate: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { type: 'string', min: 2, message: '名称不能少于两个字符', trigger: 'blur' }
                ],
                url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
            },
            formAdd: {
                id: '',
                parentId: '',
                level: '',
                name: '',
                url: ''
            },
            menuList: [],
        }
    },
    created() {
        this.getMenuList()
    },
    filters: {
        date(value) {
            return Moment(value).format('YYYY-MM-DD HH:mm')
        }
    },
    methods: {
        getMenuList() {
            api.menuManage.menuList().then(res => {
                if (res.data.code === 200) {
                    this.initData(res.data.data || [])
                }
            })
        },
        initData(list) {
            this.menuList = []
            list.forEach(item => {
                item = Object.assign({}, item, {
                    "expanded": false
                });
                this.menuList.push(item)
            })
        },
        handleUpdate() {
            const formData = this.$qs.stringify(this.formAdd)
            api.menuManage.menuUpdate(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success('菜单保存成功!')
                    this.modal = false
                    this.$refs['formAdd'].resetFields();
                    this.getMenuList()
                }
            })
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.handleUpdate()
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields()
        },
        getDetail(id, parentId, level) {
            const params = { id }
            api.menuManage.menuDetail(params).then(res => {
                if (res.data.code === 200) {
                    for (let key in this.formAdd) {
                        this.formAdd[key] = res.data.data[key]
                    }
                    this.modal = true
                }
            })
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
.tree-grid {
  width: 100%;
  border: 1px solid #ebebeb;
}
.table-header {
  font-size: 0;
}
.table-th {
  width: 20%;
  font-size: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  display: inline-block;
  height: 40px;
  vertical-align: top;
  line-height: 40px;
  color: #495060;
  font-weight: 700;
  background-color: #f8f8f9;
}
.table-th-link {
  width: 30%;
}
.table-th-btn {
  width: 10%;
}
.table-tr {
  font-size: 0;
}
.table-td {
  font-size: 12px;
  display: inline-block;
  width: 20%;
  text-align: center;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  height: 48px;
  vertical-align: top;
  line-height: 48px;
  position: relative;
  i {
    position: absolute;
    top: 13px;
    left: 30px;
  }
  .ivu-btn {
    color: #fda775;
  }
}
.table-td-link {
  width: 30%;
}
.table-td-btn {
  width: 10%;
}
.second-level {
  background-color: #f8f8f9;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}
</style>