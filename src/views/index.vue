<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container class="container">
      <el-aside width="200px">
        <el-menu
          active-text-color="black"
          router
          :default-active="defaultActive"
          :default-openeds="defaultOpeneds"
        >
          <el-menu-item index="/discover">
            <i class="iconfont icon-yinle"></i>
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item index="/video">
            <i class="iconfont icon-shipin"></i>
            <span slot="title">视频</span>
          </el-menu-item>
          <el-menu-item index="/favorites">
            <i class="iconfont icon-more"></i>
            <span slot="title">收藏</span>
          </el-menu-item>
          <el-menu-item index="/recommendmusic">
            <i class="iconfont icon-good"></i>
            <span slot="title">每日推荐</span>
          </el-menu-item>
          <el-submenu v-if="createdMusicList.length != 0" index="create">
            <template slot="title"
              ><span slot="title" class="groupTitle">创建的歌单</span></template
            >
            <el-menu-item
              v-for="(item, index) in createdMusicList"
              :key="index"
              :index="'/songlistdetail/' + item.id"
              class="item"
            >
              <i class="iconfont icon-xihuan"></i>{{ item.name }}</el-menu-item
            >
          </el-submenu>

          <el-submenu v-if="collectedMusicList.length != 0" index="collect">
            <span slot="title" class="groupTitle">收藏的歌单</span>
            <el-menu-item
              v-for="item in collectedMusicList"
              :key="item.id"
              :index="'/songlistdetail/' + item.id"
              class="item"
            >
              <i class="iconfont icon-gedan"></i
              ><i class="iconfont song-list-name">{{
                item.name
              }}</i></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <!-- 给router-view添加key有可能对性能有一定的损耗，
        但是可以解决push同一个地址不同参数时不会重新渲染router-view的问题 -->
          <router-view class="routerView" :key="$route.fullPath"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-footer class="footer"><bottom></bottom></el-footer>
    <song-detail></song-detail>
  </el-container>
</template>

<script>
import Header from "./Header/Header.vue";
import Bottom from "./Bottom/Bottom.vue";
import SongDetail from "views/SongDetail/SongDetail.vue";

export default {
  components: { Header, Bottom, SongDetail, SongDetail },
  data() {
    return {
      defaultActive: "",
      defaultOpeneds: ["create", "collect"],
      // 用户信息
      // userInfo: {},
      // 创建的歌单
      createdMusicList: [],
      // 收藏的歌单
      collectedMusicList: [],
      // 下载的音乐的信息
      downloadMusicInfo: {
        name: "",
        url: "",
      },
    };
  },
  methods: {
    // 请求
    // 请求用户歌单
    async getUserMusicList() {
      if (!this.$store.state.isLogin) {
        // 说明已经退出登录
        this.$message.error("请先进行登录操作");
        return;
      }
      let timestamp = Date.parse(new Date());
      // 先从localStorage里面读取用户信息  如果登录成功是有存的
      // this.userInfo =
      //   window.localStorage.getItem("userInfo") &&
      //   JSON.parse(window.localStorage.getItem("userInfo"));

      let res = await this.$http("/user/playlist", {
        uid: window.localStorage.getItem("userId"),
        timestamp,
      });
      // 对数据进行处理分类
      res = res.data.playlist;
      let index = res.findIndex((item) => item.subscribed == true);
      this.createdMusicList = res.slice(0, index);
      this.collectedMusicList = res.slice(index);
      this.createdMusicList[0].name = "我喜欢的音乐";
      // console.log(this.createdMusicList, this.collectedMusicList);
      // 将收藏的歌单上传至vuex
      this.$store.commit("updateCollectMusicList", this.collectedMusicList);
      // 将创建的歌单上传至vuex
      this.$store.commit("updateCreatedMusicList", this.createdMusicList);
    },
  },
  created() {
    if (this.$route.path.search("/songlistdetail") == -1) {
      this.defaultActive = "/" + this.$route.path.split("/")[1];
    } else {
      this.defaultActive = this.$route.path;
    }
  },
  watch: {
    // $route(to, from) {
    //   if (to !== from) {
    //     // 直接 go会导致整个页面进行刷新
    //     // this.$router.go(0);
    //   }
    // },
    // 监听收藏歌单的变化
    "$store.state.collectMusicList"(current) {
      // console.log(current);
      this.collectedMusicList = current;
    },
    "$route.path"(current) {
      // 取路由中的首地址 用于侧边栏的导航active
      if (current.search("/songlistdetail") == -1) {
        this.defaultActive = "/" + current.split("/")[1];
      } else {
        this.defaultActive = current;
      }
      // console.log(current, this.defaultActive);
    },

    // 监听当前下载音乐信息
    "$store.state.downloadMusicInfo"(current) {
      axios
        .get(current.url, { responseType: "blob" })
        .then((res) => {
          let blob = res.data;
          let url = URL.createObjectURL(blob);
          // console.log(url);
          let a = document.querySelector("#downloadCurrentMusic");
          this.downloadMusicInfo.url = url;
          this.downloadMusicInfo.name = current.name;
          this.$nextTick(() => {
            a.click();
            // 用完释放URL对象
            URL.revokeObjectURL(url);
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("下载失败,请稍后重试!");
        });

      // this.downloadMusicInfo = current;
      // let a = document.querySelector("#downloadCurrentMusic");
      // this.$nextTick(() => {
      //   a.click();
      // });
    },
    // 监听vuex中的登录状态
    "$store.state.isLogin"(current) {
      // console.log(current);
      if (current) {
        this.getUserMusicList();
      } else {
        // 清空收藏和创建歌单
        this.createdMusicList = [];
        this.collectedMusicList = [];
      }
    },
  },
};
</script>
<style lang="less"  scoped>
.is-active {
  background-color: #f6f6f7;
  font-size: 14px;
  font-weight: 600;
}
.el-header {
  padding: 0;
}
.el-menu {
  height: 100%;
}
.el-menu-item,
.el-submenu__title {
  height: 40px;
  line-height: 40px;
  margin: 5px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-container.is-vertical {
  height: 100%;
}
.el-submenu .el-menu-item {
  min-width: unset;
  height: 40px;
  line-height: 40px;
  padding: unset;
}
.item {
  padding-left: 20px !important;
}

.el-submenu {
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }
}

.groupTitle {
  font-size: 12px;
  opacity: 0.6;
}
.container {
  overflow: auto;
}
.footer {
  border-top: 1px solid #ddd;
  height: 75px !important;
}
.el-main {
  padding: 0px;
}
.song-list-name {
  font-size: 14px;
}
</style>