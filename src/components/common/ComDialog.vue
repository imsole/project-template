<template>
  <el-dialog
    :title="title"
    append-to-body
    :show-close="false"
    :width="width + 'px'"
    :visible.sync="visible"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  name: "ComDialog",
  props: {
    visible: {
      required: true,
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      required: false,
      type: String,
      default() {
        return "";
      }
    },
    width: {
      required: true,
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    // 关闭
    dialogClose() {
      this.$emit("update:visible", false);
      this.$emit("onclose");
    }
  },
  watch: {
    visible(val) {
      this.$emit("update:visible", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper /deep/ {
  .el-dialog {
    padding: 0 30px;
    border-radius: 20px;
  }
  .el-dialog__title {
    font-weight: bold;
  }
}
</style>