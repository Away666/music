<template>
  <div class="navBarContainer">
    <div class="navBar">
      <div
        class="barItem"
        :class="index == activeNum ? 'active' : ''"
        v-for="(item, index) in navBarData"
        :key="index"
        @click="clickBarItem(item.path, index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      activeNum: 0,
    };
  },
  props: {
    navBarData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    clickBarItem(path, index) {
      if (this.activeNum == index) {
        return;
      }
      // console.log(path);
      this.activeNum = index;
      this.$emit("clickBarItem", path);
    },
  },
  created() {
    // console.log(this.$route.path);
    // 根据地址判断 activeNum
    this.navBarData.forEach((item, index) => {
      if (decodeURI(this.$route.path).search(item.path) != -1) {
        this.activeNum = index;
      }
    });
  },
};
</script>
<style  scoped>
.navBarContainer {
  height: 60px;
  width: 100%;
  position: relative;
}

.navBar {
  display: flex;
  position: relative;
  left: 0px;
  top: 0;
  background-color: #fff;
  z-index: 100;
  width: 100%;
  color: rgb(49, 49, 49);
  align-items: center;
  padding: 10px 0 10px 20px;
}

.barItem {
  font-size: 16px;
  margin: 0 10px;
  text-align: center;
  cursor: pointer;
}

.active {
  font-size: 18px;
  color: black;
  font-weight: 600;
  padding-bottom: 5px;
  border-bottom: 3px solid #ec4141;
  transform: translateY(4px);
}
</style>