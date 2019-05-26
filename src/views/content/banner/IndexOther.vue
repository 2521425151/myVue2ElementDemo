<template>
    <div class="tab-table-wrapper">
        <div class="filter">
            <Form ref="formFilter" :model="formFilter" inline :label-width="80">
                <FormItem label="版块选择：" prop="positionId">
                    <Select v-model="formFilter.positionId" style="width:160px" clearable placeholder="请选择板块">
                        <Option v-for="item in plateTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
        </div>
        <DragableTable v-model="bannerList" @on-end="handleDragend" :columns-list="columns"></DragableTable>
        <Modal v-model="modal" :title="title" @on-cancel="handleReset('form','close')" :mask-closable="false" width="600px">
            <div class="form">
                <Form ref="form" :model="form" :rules="ruleValidate" :label-width="85">
                    <FormItem label="名称：" prop="name">
                        <Input v-model="form.name" type="text" :maxlength="20" placeholder="请输入名称"></Input>
                    </FormItem>
                    <FormItem label="描述：" prop="remark">
                        <Input v-model="form.remark" type="text" :maxlength="50" placeholder="请输入描述"></Input>
                    </FormItem>
                    <FormItem label="版块选择：" prop="positionId">
                        <Select v-model="form.positionId" style="width:160px" clearable placeholder="请选择板块">
                            <Option v-for="item in plateTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="图片上传：" prop="imgUrl">
                        <Upload :action="uploadUrl" :show-upload-list="false" :on-error="handleError" :on-progress="handleProgress" :on-success="handleSuccess" :format="['jpg','png']" :max-size="8192" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize">
                            <Button type="ghost" class="btn-upload-banner" icon="ios-plus-empty"></Button>
                        </Upload>
                        <div class="upload-img-banner" v-if="form.imgUrl">
                            <div class="mask">
                                <Icon type="android-delete" size="50" @click.native="form.imgUrl=''"></Icon>
                            </div>
                            <img :src="form.imgUrl" alt="">
                        </div>
                        <p>图片尺寸为960*1080</p>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" class="text-center">
                <Button type="primary" @click="handleSubmit('form')">保存</Button>
            </div>
        </Modal>
        <Modal v-model="viewModal" title="预览" :footerHide="true" class="baner-view-modal" width="900">
            <div style="text-align:center;">
                <img style="width:100%" :src="imgUrl" alt="">
            </div>
        </Modal>
    </div>
</template>
<script>
import { bannerMixin } from '@/mixins/bannerMixin'
export default {
    mixins: [bannerMixin],
    data() {
        return {
            type: 1002,
            positionId: '',
            formFilter: {
                positionId: ''
            },
            form: {
                mediaType: '1001',
            },
            plateTypeList: [
                {
                    value: '1004',
                    label: '公告通知'
                },
                {
                    value: '1005',
                    label: '规章制度'
                }
            ]
        }
    },
    methods: {
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
</style>
