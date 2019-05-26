<template>
    <div class="main">
        <Breadcrumb>
            <BreadcrumbItem>内容管理</BreadcrumbItem>
            <BreadcrumbItem to="/FAQ">常见问题</BreadcrumbItem>
            <BreadcrumbItem>{{type === 'edit'?'编辑':'新建'}}</BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content">
            <router-link to="/FAQ" class="back-btn">
                <Icon type="chevron-left"></Icon>返回</router-link>
            <Form ref="form" :model="form" class="form" :rules="ruleValidate" :label-width="100">

                <div class="clearfix">
                    <FormItem label="标题：" class="fl" prop="title">
                    <Input v-model.trim="form.title" type="textarea" style="width:300px" :minlength="2" :maxlength="100" :autosize="{minRows: 2,maxRows: 8}" placeholder="请输入文章标题"></Input>
                    
                </FormItem>
                <p class="fl tips" style="margin-left:20px;">限制100字以内</p>
                </div>
                <FormItem label="内容编辑：" prop="content" style="width:900px" id="editorContent">
                    <UEditor :content="form.content" :config="config" ref="ue" @on-blur="handleEditorBlur"></UEditor>
                    <p class="fl tips" style="margin-top:20px;">限制500字以内</p>
                    <!-- <div class="img-upload upload-self">
                        <Upload :action="uploadUrl" :show-upload-list="false" :on-success="handleImgSuccess" :format="['png','jpg']" :max-size="8192" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
                            <Button type="ghost"><img src="../../assets/images/upload-img.png" alt=""></Button>
                        </Upload>
                    </div>
                    <div class="video-upload upload-self">
                        <Button type="ghost" @click="isShow=!isShow"><img src="../../assets/images/upload-video.png" alt=""></Button>
                        <div class="video-upload-wrapper" v-if="isShow">
                            <input type="text" v-model="videoSrc" placeholder="格式：<iframe src=... ></iframe>">
                            <input type="text" v-show="false">
                            <div class="btn-group">
                                <button type="button" @click="isShow=false">取消</button>
                                <button type="button" @click="handleVideoUpload">确定</button>
                            </div>
                        </div>
                    </div> -->
                    <!-- <Input v-model="form.content" ref="editorInput" type="text" class="conent-input"></Input> -->
                </FormItem>
                
                <FormItem class="text-center bottom-btn">
                    <Button type="primary" @click="handleSubmit('form',0)" :disabled="isDisabled">保存</Button>
                    <Button type="primary" @click="handleSubmit('form',1)" v-if="publishStatus!=1" style="margin-left: 8px" :disabled="isDisabled">保存并发布</Button>
                </FormItem>
            </Form>
        </div>
        <Modal v-model="modal" title="预览" class="modal" :mask-closable="false" width="1000px">
            <div v-html="form.content" class="view-content"></div>
            <div slot="footer" class="text-center">
                <Button type="primary" @click="modal=false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import api from '@/api/api'
import UEditor from '@/components/UEditor'
export default {
    name: 'FAQDetail',
    data() {
        return {
            isShow: false,
            modal: false,
            isDisabled: false,
            type: '',
            id: '',
            editor: null,
            isEmpty: false,
            publishStatus:'',
            form: {
                title: '',
                content: '',
            },
            ruleValidate: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                    { type: 'string', min: 2, message: '文章标题不少于2个字符', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
            },
            config: {
                toolbars: [
                    ['link', 'unlink']
                ],
                // retainOnlyLabelPasted: true,
                enableContextMenu: false,
                pasteplain: true
            }
        }
    },
    components: {
        UEditor
    },
    created() {
        this.type = this.$route.query.type
    },
    mounted() {
        this.editor = UE.getEditor('editor');
        if (this.type === 'edit') {
            this.id = this.$route.query.id
            this.getFaqDetail(this.id)
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.name.toLowerCase() !== 'faq') {
            this.$store.commit('changeIncludes', [])
        }
        next()
    },
    methods: {
        handleSubmit(name, status) {

            this.form.content = this.$refs.ue.getUEContent();
      
            if (this.form.content.length > 530) {
                this.$Message.error('内容限制500字！')
                return
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.isDisabled = true
                    if (this.type === 'edit') {
                        this.handleUpdate(status, this.id)
                    } else {
                        this.handleAdd(status)
                    }
                } else {

                }
            })
        },
        handleAdd(status) {
            const formData = this.$qs.stringify(Object.assign({}, this.form, { status }))
            api.articleManage.faqAdd(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success(status ? '常见问题发布成功' : '常见问题保存成功')
                    this.$router.push('FAQ')
                } else {
                    this.isDisabled = false
                }
            })
        },
        handleUpdate(status, id) {
        status=  this.publishStatus==1?this.publishStatus: status
            const formData = this.$qs.stringify(Object.assign({}, this.form, { status, id }))
            api.articleManage.faqUpdate(formData).then(res => {
                if (res.data.code === 200) {
                    this.$Message.success(status ? '常见问题发布成功' : '常见问题保存成功')
                    this.$router.push('FAQ')
                } else {
                    this.isDisabled = false
                }
            })
        },
        getFaqDetail(id) {
            const params = { id }
            api.articleManage.faqDetail(params).then(res => {
                if (res.data.code === 200) {
                    this.form.title = res.data.data.title
                    this.form.content = res.data.data.content
                    this.publishStatus = res.data.data.status
                    setTimeout(() => {
                        this.$refs.ue.handleSetContent(this.form.content)
                    }, 100);
                }
            })
        },
        handleEditorBlur(res) {
            this.form.content = res
            this.$refs.editorInput.focus()
            this.$refs.editorInput.blur()
        },
        handleVideoUpload() {
            if (!this.videoSrc) {
                return
            }
            this.$refs.ue.handleInsertHtml(this.videoSrc)
            this.isShow = false
            this.videoSrc = ''
        },
        handleImgSuccess(res, file) {
            const img = `<img src="${res.data}" alt="">`
            this.$refs.ue.handleInsertHtml(img)
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '文件格式错误',
                desc: '文件 ' + file.name + ' 格式错误, 请选择 jpg 或者 png.'
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '文件大小超过限制',
                desc: '文件  ' + file.name + ' 超限, 大小不能超过 8M.'
            });
        },
    },
    computed: {
        uploadUrl() {
            return this.$axios.defaults.baseURL + api.base.fileUpload
        }
    }
}
</script>
<style lang="less" scoped>
.modal {
  /deep/ .ivu-modal {
    top: 20px;
  }
}
.view-content {
  padding: 0 30px;
}
.tips {
    color: #666;
}
.validate-tips {
  height: 32px;
  position: absolute;
}
.bottom-btn {
  width: 900px;
  margin-top: 30px;
  margin-bottom: 50px;
}
.back-btn {
  font-size: 18px;
  color: #fc9153;
  i {
    margin-right: 10px;
  }
}
.form {
  margin-top: 20px;
}
.main-content {
  padding-left: 50px;
}
.btn-upload {
  width: 100px;
  height: 100px;
  /deep/ .ivu-icon-ios-plus-empty {
    font-size: 80px;
  }
}
</style>
