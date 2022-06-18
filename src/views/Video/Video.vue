<template>
  <div class="video">
    <nav-bar @clickBarItem="clickBarItem" :navBarData="navBarData"></nav-bar>
    <router-view class="videoList"></router-view>
  </div>
</template>

<script>
import NavBar from "components/NavBar/NavBar.vue";
export default {
  components: { NavBar },
  name: "Video",
  data() {
    return {
      navBarData: [
        { name: "视频", path: "/video/videolist" },
        { name: "MV", path: "/video/mvlist" },
      ],
    };
  },
  methods: {
    // 接收navbar传来的点击事件
    clickBarItem(path) {
      this.$router.push(path);
    },
  },
  created() {
    // if (!this.$store.state.isLogin) {
    //   this.$message.error("视频页面只有登录后才能访问哦!");
    //   this.$router.replace("/index");
    // }
  },
};
</script>

<style scoped>
.video {
  overflow: hidden;
  padding: 0 !important;
}
</style>