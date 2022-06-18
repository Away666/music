<template>
  <div class="navContainer">
    <el-popover
      placement="bottom-start"
      width="350"
      popper-class="sortPop"
      trigger="click"
      :visible-arrow="false"
      v-model="isSortPopShow"
    >
      <div class="SortBox" slot="reference">
        {{ currentTag.name }} <i class="iconfont icon-arrow-right-bold"></i>
      </div>
      <div class="tips" v-if="sub.length == 0">正在加载分类数据...</div>
      <div class="sortList" v-else>
        <div
          class="sortItme"
          :class="currentTag.name == item.name ? 'currentItem' : ''"
          v-for="(item, index) in sub"
          :key="index"
          @click="clickItem(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "SongListCategory",
  data() {
    return {
      // 是否显示分类选择框
      isSortPopShow: false,
    };
  },
  props: {
    sub: {
      type: Array,
      default() {
        return [];
      },
    },
    currentTag: {
      type: Object,
      default() {
        return {};
      },
    },
    categories: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    // 点击分类item的回调
    clickItem(item) {
      this.$emit("clickSongListItem", item);
      this.isSortPopShow = false;
    },
  },
};
</script>
<style  scoped>
.navContainer {
  /* margin: 10px 0; */
}
.SortBox {
  padding: 5px 10px;
  width: 100px;
  height: 20px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.SortBox i {
  font-size: 12px;
}

.tips {
  width: 100%;
  text-align: center;
  font-size: 12px;
  padding: 20px 0;
  color: rgb(145, 145, 145);
}

.sortList {
  display: flex;
  flex-wrap: wrap;
}

.sortItme {
  font-size: 12px;
  width: 25%;
  text-align: center;
  color: rgb(85, 85, 85);
  padding: 5px 0;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 30px;
  transform: scale(0.9);
}

.currentItem {
  color: #eb4f4f;
  background-color: #fcebeb;
}

</style>