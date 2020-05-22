export const dialogForm = {
  props: {
      data: {
          required: false,
          type: Object,
          default() {
              return {};
          }
      }
  },
  mounted() {
      this.setFrom();
  },
  methods: {
      // 编辑的时候，设置表单数据
      setFrom() {
          // 这里用JSON处理一下，是因为不影响列表的数据
          if (this.data) {
              this.form = JSON.parse(JSON.stringify(this.data));
          }
      },
      // 关闭
      dialogClose() {
          if (this.form) {
              Object.keys(this.form).map(item => {
                  this.form[item] = null;
              });
          }
          this.$refs.form.resetFields();
          this.$emit("onclose");
      },
      // 保存
      async dialogSave() {
          this.$refs.form.validate(async valid => {
              if (!valid) {
                  return;
              }
              let data = JSON.parse(JSON.stringify(this.form));

              this.$emit("onsave", data, this.$refs.form);
          });
      }
  },
  watch: {
      data(val) {
          if (val) {
              this.setFrom();
          }
      }
  }
};