<template>
  <div class="discoverContainer">
    <nav-bar :navBarData="navBarData" @clickBarItem="clickBarItem"></nav-bar>
    <router-view class="discover"></router-view>
  </div>
</template>

<script>
import NavBar from "../../components/NavBar/NavBar.vue";
export default {
  components: { NavBar },
  name: "DisCover",
  data() {
    return {
      navBarData: [
        { name: "个性推荐", path: "/discover/recommend" },
        { name: "歌单", path: "/discover/songlist" },
        { name: "排行榜", path: "/discover/rank" },
        { name: "歌手", path: "/discover/singer" },
      ],
    };
  },
  methods: {
    clickBarItem(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style lang="less"  scoped>
.discoverContainer {
  overflow: hidden;
  padding: 0 !important;
}
.discover {
  margin: auto;
  overflow-y: scroll;
  height: calc(100vh - 195px);
  padding: 0 20px;
}
.discover::-webkit-scrollbar {
  width: 5px;
}
.discover::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.1);
}
.discover::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0);
}
</style>