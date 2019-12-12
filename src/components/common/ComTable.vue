<template>
  <div class="widget-table">
    <el-table
      border
      stripe
      :data="list"
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
      <template slot="empty">
        <label>没有符合条件的数据</label>
      </template>
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
        <!-- 排序 -->
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
            <template v-for="(pic, n) in scope.row[item.prop]">
              <el-image
                :key="'img' + n"
                v-if="pic.fileUrl"
                fit="cover"
                :src="pic.fileUrl"
                :preview-src-list="[pic.fileUrl]"
              >
              </el-image>
            </template>
          </template>
        </el-table-column>
        <!-- chat -->
        <el-table-column
          v-else-if="item.type === 'chat'"
          :label="item.label"
          :key="'chat' + index"
          class-name="link-cell"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <template v-if="scope.row[item.prop].type === 'text'">
              {{ scope.row[item.prop].content }}
            </template>
            <template v-if="scope.row[item.prop].type === 'pics'">
              <template v-for="(pic, n) in scope.row[item.prop].content">
                <el-image
                  :key="'img' + n"
                  v-if="pic.fileUrl && scope.row[item.prop].fn"
                  fit="cover"
                  style="width: 40px; height: 40px;cursor: pointer"
                  :src="pic.fileUrl"
                  @click.native="scope.row[item.prop].fn(scope.row)"
                >
                </el-image>
                <el-image
                  v-else-if="pic.fileUrl"
                  :key="'img' + n"
                  fit="cover"
                  style="width: 40px; height: 40px"
                  :src="pic.fileUrl"
                  :preview-src-list="[pic.fileUrl]"
                >
                </el-image>
              </template>
            </template>
            <template v-if="scope.row[item.prop].type === 'share'">
              <el-link
                type="primary"
                :underline="false"
                :href="scope.row[item.prop].content.url"
                target="_blank"
              >
                {{ scope.row[item.prop].content.title }}
              </el-link>
            </template>
            <template v-if="scope.row[item.prop].type === 'file'">
              <el-link
                type="primary"
                :underline="false"
                :href="scope.row[item.prop].content.url"
                target="_blank"
              >
                {{ scope.row[item.prop].content.title }}
              </el-link>
            </template>
            <template v-if="scope.row[item.prop].type === 'audio'">
              <i
                class="el-icon-video-play"
                @click="scope.row[item.prop].fn(scope.row)"
              ></i>
            </template>
            <template v-if="scope.row[item.prop].type === 'video'">
              <el-image
                fit="cover"
                style="width: 40px; height: 40px"
                class="video-cover"
                :src="
                  'data:image/jpeg;base64,' + scope.row[item.prop].content.title
                "
                @click.native="scope.row[item.prop].fn(scope.row)"
              >
              </el-image>
            </template>
            <template v-if="scope.row[item.prop].type === 'unknow'">
              {{ scope.row[item.prop].content }}
            </template>
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
              @click="listItemClick(item, scope.row)"
            />
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
            <template v-if="item.enum">
              {{ item.enum[scope.row[item.prop]] }}
            </template>
            <template v-else>
              {{ scope.row[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
      <!-- 如果action存在 再显示 -->
      <el-table-column
        label="操作"
        :width="actionWidth"
        v-if="actions.length"
        class-name="actions link-cell"
        fixed="right"
      >
        <!-- actionTrigger 这个目前只在im的群组用到，用于检测是不是群主，群主不限时操作按钮 -->
        <template slot-scope="scope">
          <template
            v-if="
              !actionTrigger.field ||
                scope.row[actionTrigger.field] != actionTrigger.value
            "
          >
            <template v-for="(action, n) in actions">
              <!-- 显示链接 -->
              <template v-if="!action.type || action.type === 'link'">
                <!-- 根据trigger判断显示操作按钮 -->
                <template v-if="action.trigger">
                  <el-link
                    v-if="
                      scope.row[action.trigger.field] == action.trigger.value
                    "
                    :key="'btn' + n"
                    :underline="false"
                    :type="action.style || 'primary'"
                    @click="action.fn(scope.row, scope.$index)"
                  >
                    {{ action.text }}
                  </el-link>
                </template>
                <el-link
                  v-else
                  :key="n"
                  :underline="false"
                  :type="action.style || 'primary'"
                  @click="action.fn(scope.row, scope.$index)"
                >
                  {{ action.text }}
                </el-link>
              </template>
              <!-- 显示按钮 -->
              <template v-if="action.type === 'button'">
                <template v-if="action.trigger">
                  <el-button
                    v-if="
                      scope.row[action.trigger.field] == action.trigger.value
                    "
                    size="mini"
                    :key="n"
                    :type="action.style || 'default'"
                    @click="action.fn(scope.row, scope.$index)"
                  >
                    {{ action.text }}
                  </el-button>
                </template>
                <el-button
                  v-else
                  size="mini"
                  :key="n"
                  :type="action.style || 'default'"
                  @click="action.fn(scope.row, scope.$index)"
                >
                  {{ action.text }}
                </el-button>
              </template>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-row class="list-ft" v-if="total > 0">
      <el-col :span="6">
        <!-- <el-button v-if="batDel" type="danger" @click="listBatAction">
          {{ listBatActionText }}
        </el-button> -->
        <template v-if="batDel">
          <el-button
            v-for="(item, key) in batActions"
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
    // list item 包含 label prop tip type
    list: {
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
    // 最右侧操作按钮
    actions: {
      required: false,
      type: Array,
      default() {
        return [];
      }
    },
    // 检测操作按钮是否显示的条件
    actionTrigger: {
      required: false,
      type: Object,
      default() {
        return {};
      }
    },
    // 操作列宽度
    actionWidth: {
      required: false,
      type: String,
      default() {
        return '';
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
    // 批量操作列表
    batActions: {
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
      // actionWidth: '240px',
      listSelects: [],
      batDel: false,
      pageNo: 1,
      pagesizes: [10, 20, 30, 50, 100, 200, 500],
      pagesize: 10,
      tableHeight: 200
    };
  },
  mounted() {
    // this.initActionWidth();
    this.hasSelect();
    this.handleTableHeight();
  },
  methods: {
    handleTableHeight: function() {
      var _this = this;
      window.onresize = function() {
        var t1 = null;
        window.clearTimeout(t1);
        t1 = setTimeout(function() {
          var tableSearch = document.getElementById('tableSearch');
          if (!tableSearch) {
            return;
          }
          _this.tableHeight =
            window.innerHeight - tableSearch.clientHeight - 285;
          if (_this.total <= 0) {
            _this.tableHeight += 53;
          }
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
    listItemClick(item, row) {
      item.fn && item.fn(row);
    }
  },
  watch: {
    currPage(val) {
      this.pageNo = val;
    },
    total(val) {
      this.handleTableHeight();
    }
  }
};
</script>

<style scoped>
.el-icon-top,
.el-icon-bottom {
  font-size: 20px;
  cursor: pointer;
}
.el-table {
  width: 100%;
}
.el-table >>> .pics-cell span {
  display: inline-block;
  height: 40px;
  margin: 0 3px;
  vertical-align: middle;
}
.el-table >>> .pics-cell .el-image,
.el-table >>> .pics-cell img {
  vertical-align: middle;
}
.el-table >>> .pics-cell .el-image {
  width: 40px;
  height: 40px;
}
.el-table >>> .moreinfo {
  word-break: break-all;
}
.el-table >>> .el-divider {
  margin: 15px 0;
}

.el-table >>> .link-cell .el-icon-video-play {
  cursor: pointer;
  font-size: 20px;
}
.el-table .link-cell .el-link--text {
  cursor: auto;
}
.el-table >>> .link-cell .el-link {
  font-size: 12px;
  font-weight: normal;
}
.el-table >>> .link-cell .el-tooltip .el-link {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-table >>> .video-cover {
  cursor: pointer;
}
.el-table >>> .video-cover:before {
  position: absolute;
  left: 10px;
  top: 10px;
  content: '\E7C0';
  font-family: 'element-icons' !important;
  color: #fff;
  font-size: 18px;
}
.expandTable >>> .el-table .el-table__expanded-cell[class*='cell'] {
  padding: 0;
}
.el-table >>> .cell.el-tooltip {
  max-width: 240px;
}
</style>
