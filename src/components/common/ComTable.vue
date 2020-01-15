<template>
  <div class="com-table">
    <el-table
      border
      stripe
      :data="data"
      row-key="id"
      :lazy="lazy"
      :load="load"
      @selection-change="listSelect"
      @row-click="listClick"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :default-expand-all="isopen || false"
      style="width:100%"
      :max-height="tableHeight"
    >
      <template v-for="(item, index) in fields">
        <!-- checkbox -->
        <el-table-column
          v-if="item.type === 'selection'"
          :key="'check' + index"
          type="selection"
          :width="item.width ? item.width + 'px' : ''"
          :selectable="selectable"
        >
        </el-table-column>
        <!-- expand -->
        <el-table-column
          v-else-if="item.type === 'expand' && !item.ismenu"
          type="expand"
          :key="'expand' + index"
        >
          <template slot-scope="scope">
            <template v-for="(sub, m) in item.props">
              <el-row :key="m">
                <el-col :span="2">{{ sub.label }}：</el-col>
                <el-col :span="22" class="moreinfo">{{
                  scope.row[sub.prop]
                }}</el-col>
              </el-row>
              <el-divider
                v-if="m < item.props.length - 1"
                :key="m"
              ></el-divider>
            </template>
          </template>
        </el-table-column>
        <!-- expandTable -->
        <el-table-column
          v-else-if="item.type === 'expandTable'"
          type="expand"
          :key="'expand' + index"
        >
          <template slot-scope="scope">
            <el-table :data="scope.row[item.prop]" :show-header="false">
              <el-table-column
                v-for="(sub, key) in item.fields"
                :key="'expandTableItem' + key"
                :width="sub.width ? sub.width + 'px' : ''"
              >
                <template slot-scope="scopeSub">
                  <template v-if="sub.enum">
                    {{ sub.enum[scopeSub.row[sub.prop]] }}
                  </template>
                  <template v-else>
                    {{ scopeSub.row[sub.prop] }}
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- order -->
        <el-table-column
          v-else-if="item.type === 'order'"
          :label="item.label"
          align="center"
          :key="'order' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <i
              class="el-icon-top"
              @click="item.fn('up', scope.$index, scope.row)"
            ></i>
            <i
              class="el-icon-bottom"
              @click="item.fn('down', scope.$index, scope.row)"
            ></i>
          </template>
        </el-table-column>
        <!-- link -->
        <el-table-column
          v-else-if="item.type === 'link'"
          :label="item.label"
          :key="'link' + index"
          :show-overflow-tooltip="item.tip || false"
          :width="item.width ? item.width + 'px' : ''"
          class-name="link-cell"
        >
          <template slot-scope="scope">
            <el-link
              :underline="false"
              :type="item.style || 'primary'"
              @click="item.fn(scope.row)"
            >
              {{ scope.row[item.prop] }}
            </el-link>
          </template>
        </el-table-column>
        <!-- pics -->
        <el-table-column
          v-else-if="item.type === 'pics'"
          :label="item.label"
          :key="'pics' + index"
          class-name="pics-cell"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <!-- <template v-for="(pic, n) in scope.row[item.prop]"> -->
              <el-image
                fit="cover"
                :src="scope.row[item.prop]"
                :preview-src-list="[scope.row[item.prop]]"
              >
              </el-image>
            <!-- </template> -->
          </template>
        </el-table-column>
        <!-- icon -->
        <el-table-column
          v-else-if="item.type === 'icon'"
          :label="item.label"
          :key="'icon' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <i
              :class="scope.row[item.prop]"
              @click="listItemEvent(item, scope.row)"
            />
          </template>
        </el-table-column>
        <!-- switch -->
        <el-table-column
          v-else-if="item.type === 'switch'"
          :label="item.label"
          :key="'switch' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <el-switch v-model="scope.row[item.prop]" @change="listItemEvent(item, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- input -->
        <el-table-column
          v-else-if="item.type === 'input'"
          :label="item.label"
          :key="'input' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row[item.prop]" @change="listItemEvent(item, scope.row)"></el-input>
          </template>
        </el-table-column>
        <!-- line -->
        <el-table-column
          v-else-if="item.type === 'line'"
          :label="item.label"
          :key="'line' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <template v-for="(line, lineIndex) in item.props">
              <el-row v-if="lineIndex == 0" :key="lineIndex" class="link-cell">
                <el-link v-if="line.type == 'link'" :underline="false" :type="line.style || 'primary'">
                  {{ scope.row[line.prop] }}
                </el-link>
                <tempalte v-else>{{ scope.row[line.prop] }}</tempalte>
              </el-row>
              <span :key="lineIndex" v-else>{{line.label}}:{{scope.row[line.prop]}}</span>
            </template>
          </template>
        </el-table-column>
        <!-- html -->
        <el-table-column
          v-else-if="item.type === 'html'"
          :label="item.label"
          :key="'html' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <div class="html-cell" v-html="scope.row[item.prop]"></div>
          </template>
        </el-table-column>
        <!-- action -->
        <el-table-column
          v-else-if="item.type === 'action'"
          :key="'action' + index"
          :label="item.label"
          :width="item.width"
          class-name="actions link-cell"
          fixed="right"
        >
          <template slot-scope="scope">
            <template v-for="(action, n) in item.actions">
              <el-link
                v-if="!('show' in action) || action.show"
                :key="'action' + n"
                :underline="false"
                :type="action.style || 'primary'"
                :disabled="action.disabled || false"
                @click="action.fn(scope.row, scope.$index)"
              >
                {{ action.text }}
              </el-link>
            </template>
          </template>
        </el-table-column>
        <!-- 其他文本类型 -->
        <el-table-column
          v-else
          :key="index"
          :label="item.label"
          :show-overflow-tooltip="item.tip || false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            {{ scope.row[item.prop] }}
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <el-row class="list-ft" v-if="total > 0">
      <el-col :span="6">
        <template v-if="batDel">
          <el-button
            v-for="(item, key) in actions"
            :key="key"
            :type="item.style || 'danger'"
            @click="item.fn(listSelects)"
          >
            {{ item.text }}
          </el-button>
        </template>
        <!-- 如果内容为空，宽度会撑不起来，所以加一个占位符 -->
        <span v-else>&nbsp;</span>
      </el-col>
      <el-col :span="18">
        <el-pagination
          v-if="total"
          background
          layout="->, total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="pageNo"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          :pager-count="pageCount"
          @current-change="onPage"
          @size-change="onSizeChange"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ComTable',
  props: {
    isopen: {
      required: false,
      type: Boolean,
      default() {
        return false;
      }
    },
    // data item 包含 label prop tip type
    data: {
      required: true,
      type: Array,
      default() {
        return [];
      }
    },
    // 显示的字段
    fields: {
      required: true,
      type: Array,
      default() {
        return [];
      }
    },
    // 是否懒加载
    lazy: {
      required: false,
      type: Boolean,
      default() {
        return false;
      }
    },
    // 懒加载函数
    load: {
      required: false,
      type: Function,
      default() {
        return () => {};
      }
    },
    // 总过有多少条数据
    total: {
      required: false,
      type: Number,
      default() {
        return 0;
      }
    },
    // 当前分页
    currPage: {
      required: false,
      type: Number,
      default() {
        return 1;
      }
    },
    // 页码按钮数
    pageCount: {
      required: false,
      type: Number,
      default() {
        return 5;
      }
    },
    // 批量操作列表
    actions: {
      required: false,
      type: Array,
      default() {
        return [
          {
            text: '删除',
            style: 'danger',
            fn: () => {
              this.$emit('listBatAction', this.listSelects);
            }
          }
        ];
      }
    },
    // 有选择框的时候，行的选择框是否禁用/启用
    selectable: {
      required: false,
      type: Function,
      default() {
        return () => {
          return true;
        };
      }
    }
  },
  data() {
    return {
      listSelects: [],
      batDel: false,
      pageNo: 1,
      pagesizes: [10, 20, 30, 50, 100, 200, 500],
      pagesize: 10,
      tableHeight: 300
    };
  },
  mounted() {
    this.hasSelect();
    this.handleTableHeight();
  },
  methods: {
    handleTableHeight() {
      let _this = this;
      let fixHeight = 0;
      window.onresize = () => {
        let timer = setTimeout(function() {
          let searchBar = document.getElementById('com-search-bar');
          let headerBar = document.getElementById('com-header-bar');
          let actionBar = document.getElementById('com-action-bar');
          if (searchBar) {
            fixHeight += searchBar.offsetHeight;
          }
          if (headerBar) {
            fixHeight += headerBar.offsetHeight;
          }
          if (actionBar) {
            fixHeight += actionBar.offsetHeight;
          }
          _this.tableHeight = window.innerHeight - fixHeight;
          if (_this.total <= 0) {
            _this.tableHeight += 53;
          }
          if (_this.tableHeight < 300) {
            _this.tableHeight = 300;
          }
          window.clearTimeout(timer);
        }, 100);
      };
      window.onresize();
    },
    // 判断fields里面有没有type等于selection的
    hasSelect() {
      let flag = false;
      this.fields.forEach(item => {
        if (item.type && item.type === 'selection') {
          flag = true;
        }
      });

      this.batDel = flag;
    },
    // 列表选择
    listSelect(rows) {
      this.listSelects = rows;
      this.$emit('listSelect', rows);
    },
    // 列表点击事件
    listClick(row, column, event) {
      this.$emit('listClick', row, column, event);
    },
    // 批量操作
    listBatAction() {
      this.$emit('listBatAction', this.listSelects);
    },
    // 分页
    onPage(pageno) {
      this.pageNo = pageno;

      this.$emit('onpage', pageno);
    },
    // 每页显示数量改变事件
    onSizeChange(size) {
      this.pageNo = 1;
      this.pagesize = size;

      this.$emit('onsize', size);
    },
    // 单元格内容点击事件
    listItemEvent(item, row) {
      item.fn && item.fn(row);
    },
  },
  watch: {
    currPage(val) {
      this.pageNo = val;
    },
    total() {
      this.handleTableHeight();
    }
  }
};
</script>

<style lang="scss" scoped>
.com-table { margin: 15px 0; }
.el-icon-top,
.el-icon-bottom {
  font-size: 20px;
  cursor: pointer;
}
.el-table {
  width: 100%;
  font-size: 14px;

  /deep/ {
    .pics-cell span {
      display: inline-block;
      height: 40px;
      margin: 0 3px;
      vertical-align: middle;
    }

    .pics-cell .el-image, .pics-cell img {
      vertical-align: middle;
    }
    .pics-cell .el-image {
      width: 40px;
      height: 40px;
    }
    .moreinfo {
      word-break: break-all;
    }
    .el-divider {
      margin: 15px 0;
    }
    .link-cell .el-link {
      font-weight: normal;
    }
    .link-cell .el-tooltip .el-link {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cell.el-tooltip {
      max-width: 240px;
    }
    .cell .el-icon-success { color:#409eff; }
    .cell .el-icon-circle-close { color:#f56c6c; }
  }
}

.expandTable /deep/ .el-table .el-table__expanded-cell[class*='cell'] {
  padding: 0;
}

.actions .cell .el-link:nth-child(n+2) { margin-left: 10px; }

.list-ft { margin: 15px 0; }

.cell span { margin-right: 10px; font-size:12px; color:#999; }
</style>
