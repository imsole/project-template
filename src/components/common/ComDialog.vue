<template>
  <div class="widget-dialog">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      :before-close="closeBefore"
      :width="width+'px'"
    >
      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">{{btnOkText}}</el-button>
        <el-button type="primary" @click="dialogSave">{{btnOkText}}</el-button>
        <template v-for="(item, key) in btns">
          <el-button :key="key" :type="item.type || 'default'" @click="item.fn">{{item.text}}</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      required: true,
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      required: true,
      type: String,
      default() {
        return '';
      }
    },
    btnOkText: {
      required: false,
      type: String,
      default() {
        return '取 消';
      }
    },
    btnCancelText: {
      required: false,
      type: String,
      default() {
        return '确 定';
      }
    },
    btns: {
      required: false,
      type: Array,
      default() {
        return [];
      }
    },
    row: {
      required: false,
      type: Object,
      default() {
        return {};
      }
    },
    id: {
      required: false,
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      
    };
  },
  methods: {
    // 获取详细信息
    async getShow() {
      if (!this.row.id) {
        return;
      }
      let res = await this.$request[this.apiName].show({ id: this.row.id });
      if (res.success) {
        this.form = res.result;
      }
    },
    // 关闭
    dialogClose() {
      if (this.form) {
        Object.keys(this.form).map(item => {
          this.form[item] = null;
        });
      }
      this.$refs.form && this.$refs.form.resetFields();
      this.$emit('onclose');
    },
    closeBefore() {
      this.dialogClose();
    },
    async dialogSave() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return;
        }
        let res = null;
        let data = JSON.parse(JSON.stringify(this.form));
        this.saveBefore && this.saveBefore(data);
        if (Object.keys(this.row).length) {
          // 编辑
          res = await this.$request[this.apiName].edit(data);
        } else {
          // 添加
          res = await this.$request[this.apiName].add(data);
        }
        if (res.success) {
          this.$notify.success({ title: '提示', message: '操作成功!' });
          this.dialogClose();
          this.$emit('onsaved');
        }
      });
    }
  },
  watch: {
    dialogStatu(val) {
      this.$emit('update:visible', val);
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.resetFields();
        if (Object.keys(this.row).length) {
          this.form = JSON.parse(JSON.stringify(this.row));
        }
      });
    }
  }
}
</script>
  
  <style>
  
  </style>