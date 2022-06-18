<template>
  <div
    class="listCard"
    v-infinite-scroll="load"
    :infinite-scroll-disabled="disabled"
    :infinite-scroll-distance="300"
    :infinite-scroll-immediate="false"
    ref="listCard"
  >
    <div
      v-for="(item, index) in itemList"
      :key="index"
      @click="clickListCardItem(item.id)"
      :class="{
        listCardItem: item.type == 0 || item.tags || item.alias,
        exclusiveItem: item.type == 5,
      }"
    >
      <div
        :class="{
          image: item.type == 0 || item.tags || item.alias,
          exclusiveImage: item.type == 5,
        }"
      >
        <img
          :src="(item.picUrl || item.coverImgUrl) + '?param=400y400'"
          alt=""
        />
        <span v-if="item.type == 0 || item.tags" class="playCount">{{
          item.playCount | showPlayCount
        }}</span>
      </div>
      <div class="title">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { handleNum } from "../../plugins/utils";
export default {
  name: "ListCard",
  data() {
    return {
      disabled: true,
    };
  },
  props: {
    itemList: {
      type: Array,
      default: [],
    },
    isLoad: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  methods: {
    clickListCardItem(id) {
      this.$emit("clickListCardItem", id);
    },
    // 上拉触底触发
    load() {
      //   console.log("滑动到底部");
      this.$emit("bottomLoad");
      // 触发load后加载数据 期间不允许再次触发load事件
      this.disabled = true;
    },
  },
  filters: {
    showPlayCount(num) {
      return handleNum(num);
    },
  },
  created() {},
  watch: {
    //   数据更新后，可再次运行触发load事件
    itemList() {
      if (this.isLoad == true) {
        if (this.itemList.length != 0) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      }
    },
  },
};
</script>
<style  lang="less" scoped>
.listCard {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
  justify-content: space-between;
}

.listCardItem {
  width: 18.4%;
  margin: 0 2% 20px 0;
  overflow: hidden;
  cursor: pointer;
}

.listCardItem:nth-child(5n) {
  margin-right: 0;
}

.exclusiveItem {
  width: 32%;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 20px;
}

.image {
  width: 100%;
  padding-bottom: 100%;
  height: 0;
  position: relative;
  .playCount {
    position: absolute;
    right: 10px;
    top: 4px;
    color: white;
    font-size: 12px;
  }
}

.image::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url("~@/assets/images/imgLoading.png") no-repeat center;
  background-size: contain;
  border-radius: 10px;
  z-index: -1;
}

.image img {
  width: 100%;
  border-radius: 10px;
}

.exclusiveImage {
  width: 100%;
  position: relative;
}

.exclusiveImage::after {
  content: "";
  width: 100%;
  height: 950%;
  position: absolute;
  top: 0;
  left: 0;
  background: url("~@/assets/images/imgLoading.png") no-repeat center;
  background-size: contain;
  border-radius: 10px;
  z-index: -1;
}

.exclusiveImage img {
  width: 100%;
  border-radius: 10px;
}

.title {
  margin-top: 8px;
  padding: 0 2px;
  font-size: 14px;
  color: black;
  line-height: 17px;
  /* 两行溢出 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>