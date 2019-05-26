<template>
    <div class="tab-table-wrapper">
        <div class="filter">
            <Form ref="formFilter" :model="formFilter" inline :label-width="50">
                <FormItem label="类型：" prop="mediaType">
                    <Select v-model="formFilter.mediaType" style="width:160px" clearable placeholder="请选择类型">
                        <Option value="1001">图片</Option>
                        <Option value="1002">视频</Option>
                    </Select>
                </FormItem>
                <FormItem class=" filter-btn-group">
                    <Button type="primary" @click="handleFilter('formFilter')">查询</Button>
                    <Button type="ghost" @click="handleReset('formFilter')">重置</Button>
                </FormItem>
            </Form>
        </div>
        <div class="handle-btn">
            <Button type="primary" @click="handleNew">新建</Button>
            <!-- <span>最多添加5张banner图；对少保留1张banner图</span> -->
        </div>
        <DragableTable v-model="bannerList" @on-end="handleDragend" :columns-list="bannerColumns"></DragableTable>
        <Modal v-model="modal" :title="title" @on-cancel="handleReset('form','close')" :mask-closable="false" width="600px">
            <div class="form">
                <Form ref="form" :model="form" :rules="ruleValidate" :label-width="85">
                    <FormItem label="名称：" prop="name">
                        <Input v-model="form.name" type="text" :maxlength="20" placeholder="请输入名称"></Input>
                    </FormItem>
                    <FormItem label="描述：" prop="remark">
                        <Input v-model="form.remark" type="text" :maxlength="50" placeholder="请输入描述"></Input>
                    </FormItem>
                    <FormItem label="链接：" prop="url">
                        <Input v-model="form.url" type="text" :maxlength="200" placeholder="请输入链接"></Input>
                    </FormItem>
                    <FormItem label="上传类型：" prop="mediaType" required>
                        <RadioGroup v-model="form.mediaType" @on-change="handleTypeChange">
                            <Radio label="1001">图片</Radio>
                            <Radio label="1002">视频</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="上传：" prop="imgUrl">
                        <Upload :action="uploadUrl" :show-upload-list="false" :on-error="handleError" :on-progress="handleProgress" :on-success="handleSuccess" :format="formatType" :max-size="form.mediaType=='1001'?8192:20480" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
                            <Button type="ghost" class="btn-upload-banner" icon="ios-plus-empty"></Button>
                        </Upload>
                                       
                        <div class="upload-img-banner" v-if="form.imgUrl">
                            <div class="mask">
                                <Icon type="android-delete" size="50" @click.native="form.imgUrl=''"></Icon>
                            </div>
                            <img :src="form.imgUrl" alt=""  v-if="form.mediaType==1001">
                            <video v-else :src="form.imgUrl" class="video"></video>
                        </div>
                        <p v-if="form.mediaType==1001">图片格式：jpg、png；尺寸：1920*1080</p>
                        <p v-else>视频格式：mp4；尺寸：1920*1080</p>
                    </FormItem>
                    <Spin v-if="isSpinShow">
                        <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
                        <span class="uploda-tip">文件上传中...</span>
                    </Spin>
                </Form>
            </div>
            <div slot="footer" class="text-center">
                <Button type="primary" @click="handleSubmit('form')">保存</Button>
            </div>
        </Modal>
        <Modal v-model="viewModal" title="预览" :footerHide="true" class="baner-view-modal" width="900">
            <div style="text-align:center;">
                <img style="width:100%" :src="imgUrl" alt="" v-if="mediaType==1001">
                <video v-else class="video-view" x5-video-player-type="h5" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" poster="" preload="none" autoplay="" loop="">
                    <source :src="imgUrl" type="video/mp4" x5-video-player-type="h5" x-webkit-airplay="true" webkit-playsinline="true" playsinline="" poster="" preload="none" autoplay="" loop="">
                    </video>
            </div>
        </Modal>
    </div>
</template>
<script>
import api from '@/api/api'
import { bannerMixin } from '@/mixins/bannerMixin'

export default {
    mixins: [bannerMixin],

    data() {
        return {
            formFilter: {
                mediaType: '',
                positionId: 1001
            },
            type: 1001,
            positionId: 1001,
            mediaType:'1001'
        }
    },
    methods: {
        handleTypeChange(type) {

            if (this.form.imgUrl) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>文件已上传，确定更改上传类型？</p>',
                    width: '350',
                    closable:true,
                    onOk: () => {
                        this.form.imgUrl = ''
                    },
                    onCancel: () => {
                        this.form.mediaType = type == '1001' ? '1002' : '1001'
                    }
                });
            }
        }
    },
    computed: {
        bannerColumns() {
            const arr = this.columns.concat()
            arr.splice(2, 0, {
                title: '类型',
                key: 'mediaType',
                width: 60,
                render: (h, params) => {
                    const mediaType = params.row.mediaType
                    return h('span', mediaType == '1001' ? '图片':'视频')
                }
            })
            
            return arr
        }
    }
}
</script>
<style lang="less" scoped>
.tab-table-wrapper {
  padding-right: 30px;
}
.form {
  width: 500px;
  margin: 0 auto;
}
.video {
    width: 385px;
    height: 85px;
    object-fit: fill;
}
.video-view {
    width: 100%;
}
.mask {
    z-index: 20;
}
</style>
