<template>
  <div class="navBar">
    <!-- 如果传入的宽度是0则不设置宽度，宽度自适应 -->
    <div
      class="item"
      v-for="(item, index) in SecondNavBarData"
      :key="index"
      @click="clickSecondBarItem(item, index)"
    >
      <div
        class="barItem"
        :class="index == activeNum ? 'active' : ''"
        :style="itemWidth == 0 ? '' : 'width:' + itemWidth + 'px;'"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar2",
  data() {
    return {
      activeNum: 0,
    };
  },
  props: {
    SecondNavBarData: {
      type: Array,
      default() {
        return [];
      },
    },
    itemWidth: {
      type: Number,
      default() {
        return 40;
      },
    },
    currentTag: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    clickSecondBarItem(item, index) {
      if (this.activeNum == index) {
        return;
      }

      this.activeNum = index;
      // 将点击事件发射出去 供使用改组件接收事件使用
      this.$emit("clickSecondBarItem", item, index);
    },
  },
  watch: {
    currentTag(current) {
      this.activeNum = this.SecondNavBarData.findIndex(
        (item) => item.name == current.name
      );
    },
  },
  computed: {
    navBarData() {
      return this.SecondNavBarData.splice(1);
    },
  },
};
</script>

<style scoped>
.navBar {
  display: flex;
  flex-wrap: wrap;
}

.item {
  padding: 0 2px;
  position: relative;
  margin: 0 2px;
}

.barItem {
  /* margin: 4px -2px; */
  padding: 6px 0px;
  font-size: 12px;
  /* width: 40px; */
  text-align: center;
  box-sizing: content-box;
  cursor: pointer;
  position: relative;
}

.barItem::after {
  position: absolute;
  content: "";
  bottom: 5px;
  right: -4px;
  /* width: 10px; */
  height: 15px;
  border-right: 1px solid #d9d9d9;
  /* border-bottom: 2px solid #02a6b5; */
}

.item:last-child .barItem:after {
  content: inherit;
}

.active {
  background-color: #fdf5f5;
  color: #ec4747;
  border-radius: 11px;
}
</style>