<template>
  <div class="page-st">
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="visible"
      :before-close="closeBefore"
      width="500px"
    >
      <el-form label-width="100px" ref="form" :model="form" :rules="rules">
        <el-form-item label="频道编码" prop="value">
          <el-input
            v-model.number="form.value"
            placeholder="请输入频道编码"
            maxlength="8"
          ></el-input>
        </el-form-item>
        <el-form-item label="频道名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入频道名称"
            maxlength="16"
          ></el-input>
        </el-form-item>
        <el-form-item label="英文缩写" prop="addr">
          <el-input
            v-model.number="form.addr"
            placeholder="请输入英文缩写"
            maxlength="15"
          ></el-input>
        </el-form-item>
        <el-form-item label="在首页显示" prop="isShow">
          <el-radio v-model="form.isShow" :label="true">是</el-radio>
          <el-radio v-model="form.isShow" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="显示颜色" prop="color">
          <el-input
            v-model.number="form.color"
            placeholder="请输入显示颜色"
            maxlength="7"
          ></el-input>
        </el-form-item>
        <el-form-item label="频道描述">
          <el-input
            type="textarea"
            :rows="3"
            resize="none"
            maxlength="50"
            show-word-limit
            v-model="form.description"
            placeholder="请输入频道描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { stDialogRow } from '@/mixins/stDialogRow';
export default {
  name: 'StChannelAdd',
  mixins: [stDialogRow],
  data() {
    return {
      visible: this.dialogStatu,
      form: {
        value: null,
        name: null,
        description: null,
        // 英文缩写
        addr: null,
        // color频道颜色
        color: null,
        // 是否在首页显示
        isShow: false
      },
      rules: {
        value: [
          { required: true, message: '请输入频道编码', trigger: 'blur' },
          { type: 'number', message: '频道编码只能是数字' },
          { pattern: /^\d+?$/, message: '频道编码格式错误' }
        ],
        name: [
          { required: true, message: '请输入频道名称', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '频道名称只能是汉字' }
        ],
        addr: [
          { required: true, message: '请输入英文缩写', trigger: 'blur' },
          { pattern: /^[A-Za-z]+$/, message: '只能输入字母' }
        ],
        color: [
          {
            required: true,
            message: '请输入颜色值，HEX格式，例如：#XXXXXX',
            trigger: 'blur'
          },
          { pattern: /^#[A-Fa-f0-9]{6}$/, message: '颜色值格式错误' }
        ]
      },
      apiName: 'channel'
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped></style>
