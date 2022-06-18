<template>
  <div class="favoritesContainer">
    <nav-bar @clickBarItem="clickBarItem" :navBarData="navBarData"></nav-bar>
    <router-view class="favorites"></router-view>
  </div>
</template>

<script>
import NavBar from "components/NavBar/NavBar.vue";
export default {
  components: { NavBar },
  name: "Favorites",
  data() {
    return {
      navBarData: [
        { name: "专辑", path: "/favorites/album" },
        { name: "歌手", path: "/favorites/singer" },
        { name: "视频", path: "/favorites/video" },
      ],
    };
  },
  methods: {
    // 事件
    //   点击navbaritem的回调
    clickBarItem(path) {
      this.$router.push(path);
    },
  },
  created() {
    // if (!this.$store.state.isLogin) {
    //   this.$message.error("收藏页面只有登录后才能访问哦!");
    //   this.$router.replace("/index");
    // }
  },
};
</script>

<style scoped>
.favoritesContainer {
  padding: 0 !important;
  overflow: hidden;
}
.favorites {
  /* padding: 0 30px; */
}
</style>