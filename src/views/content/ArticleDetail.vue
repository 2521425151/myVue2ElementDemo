<template>
  <div class="main">
    <Breadcrumb>
      <BreadcrumbItem>内容管理</BreadcrumbItem>
      <BreadcrumbItem to="/article">文章管理</BreadcrumbItem>
      <BreadcrumbItem>{{type === 'edit'?'编辑':'新建'}}</BreadcrumbItem>
    </Breadcrumb>
    <div class="main-content">
      <router-link to="/article" class="back-btn">
        <Icon type="chevron-left"></Icon>
        返回
      </router-link>
      <Form ref="form" :model="form" class="form" :rules="ruleValidate" :label-width="100">
        <FormItem label="发布时间：" prop="publishTime">
          <DatePicker type="date" style="width:300px" placeholder="请选择发布时间" :options="options" :editable="false"
                      :clearable="false" v-model="form.publishTime"></DatePicker>
        </FormItem>
        <FormItem label="文章类型：" prop="type">
          <Select v-model="form.type" style="width:300px" clearable placeholder="请选择文章类型">
            <Option v-for="item in articleTypeList" :value="item.id+''" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <div class="clearfix">
          <FormItem label="文章标题：" prop="title" class="fl">
            <Input v-model.trim="form.title" type="text" style="width:300px" :maxlength="100"
                   placeholder="请输入文章标题"></Input>
          </FormItem>
          <p class="tips fl" style="margin-top:6px;">限制100字以内</p>
        </div>
        <div class="clearfix">
          <FormItem label="文章简介：" prop="subtitle" class="fl">
            <Input v-model.trim="form.subtitle" type="textarea" style="width:300px" :maxlength="500"
                   :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入文章简介"></Input>
          </FormItem>
          <p class="fl tips">限制500字以内</p>
        </div>
        <div class="clearfix">
          <FormItem label="缩略图上传：" prop="logo" class="fl">
            <Input v-model="form.logo" ref="input" type="text" class="input-hidden"></Input>
            <!-- <Upload :action="uploadUrl" :show-upload-list="false" :on-success="handleSuccess" :format="['png','jpg']" :max-size="8192" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"> -->
            <Button type="ghost" class="btn-upload" icon="ios-plus-empty"
                    @click="uploadModal=true;logoFlag=true"></Button>
            <!-- </Upload> -->
            <div class="upload-img-banner" v-if="form.logo">
              <div class="mask">
                <Icon type="android-delete" size="50" @click.native="handleRemove(1)"></Icon>
              </div>
              <img :src="form.logo" alt="">
            </div>
            <p class="text-center">600*320</p>

          </FormItem>
          <FormItem prop="logoUrl" class="fl" v-if="form.type==2||form.type==5">
            <Input v-model="form.logo" ref="inputL" type="text" class="input-hidden"></Input>
            <!-- <Upload :action="uploadUrl" :show-upload-list="false" :on-success="handleSuccessL" :format="['png','jpg']" :max-size="8192" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"> -->
            <Button type="ghost" class="btn-upload" icon="ios-plus-empty"
                    @click="uploadModal=true;logoFlag=false"></Button>
            <!-- </Upload> -->
            <div class="upload-img-banner" v-if="form.logoUrl">
              <div class="mask">
                <Icon type="android-delete" size="50" @click.native="handleRemove(2)"></Icon>
              </div>
              <img :src="form.logoUrl" alt="">
            </div>
            <p class="text-center">680*680</p>
          </FormItem>
        </div>
        <FormItem label="内容编辑：" prop="content" style="width:900px" id="editorContent">
          <UEditor :content="form.content" ref="ue" @on-blur="handleEditorBlur"></UEditor>
          <div class="img-upload upload-self">
            <Upload :action="uploadUrl" :show-upload-list="false" :on-success="handleImgSuccess" :format="['png','jpg']"
                    :max-size="8192" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
              <Button type="ghost"><img src="../../assets/images/upload-img.png" alt=""></Button>
            </Upload>
          </div>
          <div class="video-upload upload-self">
            <Button type="ghost" @click="isShow=!isShow"><img src="../../assets/images/upload-video.png" alt="">
            </Button>
            <div class="video-upload-wrapper" v-if="isShow">
              <input type="text" v-model="videoSrc" placeholder="格式：<iframe src=... ></iframe>">
              <input type="text" v-show="false">
              <div class="btn-group">
                <button type="button" @click="isShow=false">取消</button>
                <button type="button" @click="handleVideoUpload">确定</button>
              </div>
            </div>
          </div>
          <Input v-model="form.content" ref="editorInput" type="text" class="conent-input"></Input>
        </FormItem>
        <FormItem class="text-center bottom-btn">
          <Button type="primary" @click="handleSubmit('form',0)">保存</Button>
          <Button type="primary" @click="handleSubmit('form',1)" style="margin-left: 8px" v-if="status!=1">保存并发布
          </Button>
          <Button type="ghost" @click="handleView" style="margin-left: 8px">预览</Button>
        </FormItem>
      </Form>
    </div>
    <Modal v-model="modal" title="预览" id="viewModal" :footerHide="true" width="95%">
      <div class="view-content-wrapper">
        <h2 class="title">{{form.title}}</h2>
        <div class="time">{{$moment(form.publishTime).format('YYYY/MM/DD')}}</div>
        <p class="brief">{{form.subtitle}}</p>
        <div v-html="form.content" class="view-content"></div>
      </div>
    </Modal>
    <Modal v-model="uploadModal" class="uploadModal" title="图片上传" width="750" @on-cancel="handleClose">
      <input type="file" id='file' name="image" accept="image/*" @change="setImage" v-show="false"/>
      <Button type="primary" @click="handleSelect">选择图片</Button>
      <br/>
      <br/>
      <div style="max-width: 100%; display: inline-block;">
        <vue-cropper ref='cropper' :src="imgSrc" :cropmove="cropImage" :zoom="cropImage"></vue-cropper>
      </div>
      <br/>
      <br/>
      <div>
        <Button type="primary" v-if="logoFlag" @click="setData(600,320)">固定尺寸600x320</Button>
        <Button type="primary" v-else @click="setData(680,680)">固定尺寸680x680</Button>
      </div>
      <br/>
      <div>宽：{{width}} 高：{{height}}</div>
      <br/>
      <div slot="footer">
        <Button type="text" @click="handleClose">取消</Button>
        <Button type="primary" @click="upload">上传</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {articleTypeMixin} from '@/mixins/articleTypeMixin'
  import api from '@/api/api'
  import UEditor from '@/components/UEditor'
  import VueCropper from 'vue-cropperjs';
  import {debounce} from 'lodash'

  export default {
    name: 'articleDetail',
    mixins: [articleTypeMixin],
    data() {
      return {
        height: 0,
        width: 0,
        imgSrc: require('../../assets/images/upload.png'),
        uploadModal: false,
        isShow: false,
        modal: false,
        type: '',
        id: '',
        editor: null,
        isEmpty: false,
        videoSrc: '',
        form: {
          publishTime: new Date(),
          type: '',
          title: '',
          subtitle: '',
          logo: '',
          logoUrl: '',
          content: '',
          status: ''
        },
        logoFlag: true,
        status: '',
        articleType: '',
        isTop: '',
        options: {
          disabledDate(date) {
            return date > new Date()
          }
        },
        ruleValidate: {
          publishTime: [
            {required: true, type: 'date', message: '请选择发布时间', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择文章类型', trigger: 'change'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '请输入文章标题', trigger: 'blur'},
            {type: 'string', min: 2, message: '文章标题不少于2个字符', trigger: 'blur'}
          ],
          subtitle: [
            {required: true, message: '请输入文章简介', trigger: 'blur'}
          ],
          logo: [
            {required: true, message: '请上传缩略图', trigger: 'change'}
          ],
          logoUrl: [
            {required: true, message: '请上传缩略图', trigger: 'change'}
          ]
        },
        file: null
      }
    },
    components: {
      UEditor,
      VueCropper
    },

    created() {
      this.type = this.$route.query.type
    },
    mounted() {
      this.editor = UE.getEditor('editor');
      if (this.type === 'edit') {
        this.id = this.$route.query.id
        this.getAticleTypelist().then(res => {
          this.getArticleDetail(this.id)
        })
      } else {
        this.getAticleTypelist()
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.name.toLowerCase() !== 'article') {
        this.$store.commit('changeIncludes', [])
      }
      next()
    },

    methods: {
      // 触发input
      handleSelect() {
        document.getElementById('file').click()
      },
      // 选择图片
      setImage(e) {
        this.file = e.target.files[0];

        if (this.file.size > 1024 * 1024 * 8) {
          this.$Notice.warning({
            title: '文件大小超过限制',
            desc: '文件  ' + this.file.name + ' 超限, 大小不能超过 8M.'
          });
          return
        }
        if (['image/jpg', 'image/jpeg', 'image/png'].indexOf(this.file.type) < 0) {
          this.$Notice.warning({
            title: '文件格式错误',
            desc: '文件 ' + this.file.name + ' 格式错误, 请选择 jpg 或者 png.'
          });
          return;
        }
        if (typeof FileReader === 'function') {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.imgSrc = event.target.result;
            this.$refs.cropper.replace(event.target.result);
          };
          reader.readAsDataURL(this.file);
          setTimeout(() => {
            let data = this.$refs.cropper.getData()
            this.height = Math.ceil(data.height)
            this.width = Math.ceil(data.width)

          }, 100);
        } else {
          alert('Sorry, FileReader API not supported');
        }
        event.target.value = ''
      },
      // 截取
      cropImage: debounce(function () {
        let data = this.$refs.cropper.getData()
        this.height = Math.ceil(data.height)
        this.width = Math.ceil(data.width)
        // this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      }, 100),
      // 设置固定宽高
      setData(width, height) {
        if (!this.file) {
          return
        }
        this.$refs.cropper.setData({
          height,
          width
        })
        this.height = height
        this.width = width
      },
      // 关闭模态框 初始化
      handleClose() {
        this.$refs.cropper.replace(require('../../assets/images/upload.png'));
        this.uploadModal = false
        this.$refs.cropper.reset()
        this.$refs.cropper.clear()
        this.height = 0
        this.width = 0
        this.file = null
      },
      // 上传图片
      upload() {
        if (this.logoFlag) {
          if (this.width !== 600 || this.height !== 320) {
            this.$Notice.warning({
              title: '图片尺寸不符合规格',
              desc: '请上传680*320分辨率图片'
            });
            return
          }
        } else {
          if (this.width !== 680 || this.height !== 680) {
            this.$Notice.warning({
              title: '图片尺寸不符合规格',
              desc: '请上传680*680分辨率图片'
            });
            return
          }
        }
        const vm = this
        // this.$refs.cropper.getCroppedCanvas().toBlob(function (blob) {
        //
        //   let formData = new FormData();
        //   formData.append('file', blob);
        //   api.base.upload(formData).then(res => {
        //     if (res.data.code === 200) {
        //       vm.$Message.success('图片已上传')
        //
        //       vm.handleClose()
        //       if (vm.logoFlag) {
        //         vm.form.logo = res.data.data
        //         this.$refs.input.focus()
        //         this.$refs.input.blur()
        //       } else {
        //         vm.form.logoUrl = res.data.data
        //         this.$refs.inputL.focus()
        //         this.$refs.inputL.blur()
        //       }
        //
        //     }
        //   })
        // });
        let blob = this.processData(this.$refs.cropper.getCroppedCanvas().toDataURL("image/jpeg"));
        let formData = new FormData();
        formData.append('file', blob);
        api.base.upload(formData).then(res => {
          if (res.data.code === 200) {
            vm.$Message.success('图片已上传')

            vm.handleClose()
            if (vm.logoFlag) {
              vm.form.logo = res.data.data
              this.$refs.input.focus()
              this.$refs.input.blur()
            } else {
              vm.form.logoUrl = res.data.data
              this.$refs.inputL.focus()
              this.$refs.inputL.blur()
            }

          }
        });

      },
      processData(dataUrl) {
        let binaryString = window.atob(dataUrl.split(',')[1]);
        let arrayBuffer = new ArrayBuffer(binaryString.length);
        let intArray = new Uint8Array(arrayBuffer);
        for (let i = 0, j = binaryString.length; i < j; i++) {
          intArray[i] = binaryString.charCodeAt(i);
        }

        let data = [intArray],
          blob;

        try {
          blob = new Blob(data);
        } catch (e) {
          window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
          if (e.name === 'TypeError' && window.BlobBuilder) {
            let builder = new BlobBuilder();
            builder.append(arrayBuffer);
            blob = builder.getBlob(imgType); // imgType为上传文件类型，即 file.type
          } else {
            console.log('版本过低，不支持上传图片');
          }
        }
        return blob;
      },
      // 提交表单
      handleSubmit(name, status) {
        this.form.content = this.$refs.ue.getUEContent();
        this.$refs[name].validate((valid) => {
          if (valid) {
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
        this.form.publishTime = this.$moment(this.form.publishTime || new Date()).format('YYYY-MM-DD')
        const formData = this.$qs.stringify(Object.assign({}, this.form, {status}))
        api.articleManage.articleAdd(formData).then(res => {
          if (res.data.code === 200) {
            this.$Message.success(status ? '文章发布成功！' : '文章保存成功')
            this.$router.push('article')
          }
        })
      },
      handleUpdate(status, id) {
        if (this.isTop == 1 && this.status == 1 && this.articleType != this.form.type) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>当前文章为首页首页配置文章，修改文章分类后需重新配置，是否继续？</p>',
            width: '400',
            onOk: () => {
              this.update(this.status, id)
            }
          });
        } else if (this.status == 1) {
          this.update(this.status, id)
        } else {
          this.update(status, id)
        }

      },
      update(status, id) {
        const form = Object.assign({}, this.form, {status, id})
        form.publishTime = this.$moment(form.publishTime).format('YYYY-MM-DD')
        const formData = this.$qs.stringify(form)
        api.articleManage.articleUpdate(formData).then(res => {
          if (res.data.code === 200) {
            this.$Message.success(status ? '文章发布成功！' : '文章保存成功')
            this.$router.push('article')
          }
        })
      },
      getArticleDetail(id) {
        const params = {id}
        api.articleManage.articleDetail(params).then(res => {
          if (res.data.code === 200) {
            const data = res.data.data
            for (let key in this.form) {
              if (key === 'type') {
                this.form.type = String(data.type)
              } else if (key === 'publishTime') {
                this.form.publishTime = this.$moment(data.publishTime).format('YYYY-MM-DD')
              } else {
                this.form[key] = data[key]
              }
            }
            this.status = res.data.data.status
            this.isTop = res.data.data.isTop
            this.articleType = res.data.data.type
            setTimeout(() => {
              this.$refs.ue.handleSetContent(this.form.content)
            }, 100);
          }
        })
      },
      // handleSuccess(res, file, fileList) {
      //     if (res.code === 200) {
      //         const image = new Image();
      //         image.onload = () => {
      //             const width = image.width;
      //             const height = image.height;
      //             if (width !== 600 || height !== 320) {
      //                 this.$Message.error('图片尺寸不符合规格！')
      //             } else {
      //                 this.form.logo = res.data
      //                 this.$refs.input.focus()
      //                 this.$refs.input.blur()
      //             }

      //         }
      //         image.src = res.data
      //     }
      // },
      // handleSuccessL(res, file) {
      //     if (res.code === 200) {
      //         const image = new Image();
      //         image.onload = () => {
      //             const width = image.width;
      //             const height = image.height;
      //             if (width !== 680 || height !== 680) {
      //                 this.$Message.error('图片尺寸不符合规格！')
      //             } else {
      //                 this.form.logoUrl = res.data
      //                 this.$refs.input.focus()
      //                 this.$refs.input.blur()
      //             }

      //         }
      //         image.src = res.data
      //     }
      // },
      handleImgSuccess(res, file) {
        const img = `<img src="${res.data}" style="max-width:100%;" alt="">`
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
      handleRemove(id) {
        if (id === 1) {
          this.form.logo = ''
          this.$refs.input.focus()
          this.$refs.input.blur()
        } else {
          this.form.logoUrl = ''
          this.$refs.inputL.focus()
          this.$refs.inputL.blur()
        }
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
      handleView() {
        this.form.content = this.$refs.ue.getUEContent()
        this.modal = true
      }
    },
    computed: {
      uploadUrl() {
        return this.$axios.defaults.baseURL + api.base.fileUpload
      }
    }
  }
</script>
<style lang="less" scoped>
  .validate-tips {
    height: 32px;
    position: absolute;
  }

  .tips {
    color: #666;
    margin-left: 20px;
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
    min-width: 1000px;
  }

  .btn-upload {
    width: 100px;
    height: 100px;
    /deep/ .ivu-icon-ios-plus-empty {
      font-size: 80px;
    }
  }

  .input-hidden {
    width: 0;
    position: absolute;
    z-index: -1;
  }

  .upload-img-banner {
    width: 100px;
    height: 100px;
    .mask {
      width: 100px;
      height: 100px;
    }
  }

  .uploadModal {
    /deep/ .ivu-modal {
      top: 20px;
    }
    /deep/ .ivu-modal-wrap {
      margin-right: -17px;
    }
  }
</style>
