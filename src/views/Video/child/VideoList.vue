<template>
  <div class="container">
    <!-- 切换歌单分类 -->
    <div class="nav">
      <div class="left">
        <song-list-category
          :sub="sub"
          :currentTag="currentTag"
          @clickSongListItem="clickSongListItem"
        >
        </song-list-category>
      </div>
      <div class="right">
        <second-nav-bar
          :SecondNavBarData="hotVideoSub"
          :itemWidth="0"
          :currentTag="currentTag"
          @clickSecondBarItem="clickSecondBarItem"
        >
        </second-nav-bar>
      </div>
    </div>
    <!-- 视频卡片列表 -->
    <video-list-card
      :videoList="videoList"
      :isLoad="true"
      :videoType="'video'"
      class="cardList scroll"
      @clickListCardItem="goToVideoDetail"
      @bottomLoad="bottomLoad"
    >
    </video-list-card>
    <go-top scrollObj=".cardList"></go-top>
  </div>
</template>

<script>
import SongListCategory from "../../../components/SongListCategory/SongListCategory.vue";
import SecondNavBar from "../../../components/secondNavBar/SecondNavBar.vue";
import VideoListCard from "../../../components/VideoListCard/VideoListCard.vue";
import GoTop from "../../../components/GoTop/GoTop.vue";

export default {
  name:"VideoList",
  components: {
    SongListCategory,
    SecondNavBar,
    VideoListCard,
    GoTop,
  },
  data() {
    return {
      // 视频全部分类
      sub: [],
      // 当前视频标签
      currentTag: {},
      // 热门视频分类
      hotVideoSub: [],
      // 视频列表
      videoList: [],
      // 当前视频页数
      videoPage: 1,
      // 是否还有更多视频数据
      hasMore: true,
    };
  },
  methods: {
    // 获取视频分类
    async getVideoSub() {
      let res = await this.$http("/video/group/list");
      this.sub = res.data.data;
      this.currentTag = {
        name: "全部视频",
      };
    },
    // 点击标签的回调
    clickSongListItem(item) {
      this.videoPage = 1;
      this.currentTag = item;
      this.hasMore = true;
      this.videoList = [];
      this.getVideoList(item.id);
    },
    // 获取热门视频分类
    async getHotVideoSub() {
      let res = await this.$http("/video/category/list");
      this.hotVideoSub = res.data.data;
    },
    // 点击热门标签的回调
    clickSecondBarItem(item) {
      this.videoPage = 1;
      this.currentTag = item;
      this.hasMore = true;
      this.videoList = [];
      this.getVideoList(item.id);
    },
    // 获取视频列表
    // 这个接口一次只能获取8条数据, 所以我每次请求循环2次这个请求 拿16条数据
    // 因为是每次8条数据push进去的 push了前 8条时因为高度不够，触发了组件video-list-card的触底，
    // 又调用了一次请求，所以第一次请求会请求32条数据，后面高度够了都是一次请求16条，我觉得挺好的，就不理这个bug了
    async getAllVideoList() {
      let i = 2;
      while (i) {
        if (this.hasMore) {
          let res = await this.$http("/video/timeline/all", {
            offset: 8 * (this.videoPage - 1),
          });
          console.log(res);
          if (!res.data.hasmore) {
            this.currentTag = this.hotVideoSub[0];
            this.getVideoList(this.currentTag.id);
          } else {
            this.hasMore = res.data.hasmore;
            this.videoList.push(...res.data.datas);
            this.videoPage += 1;
            i--;
          }
        } else {
          return;
        }
      }
    },
    // 获取对应标签分类的视频列表
    async getVideoList(id) {
      let i = 2;
      while (i) {
        if (this.hasMore) {
          let res = await this.$http("/video/group", {
            id,
            offset: 8 * (this.videoPage - 1),
          });
          this.hasMore = res.data.hasmore;
          this.videoList.push(...res.data.datas);
          this.videoPage += 1;
          i--;
        } else {
          return;
        }
      }
    },
    // 点击视频跳转到视频详情
    goToVideoDetail({ id }) {
      this.$router.push({
        name: "videoDetail",
        params: { id, type: "video" },
      });
    },
    // 上拉触底的回调
    bottomLoad() {
      if (this.hasMore) {
        if (this.currentTag.id) {
          this.getVideoList(this.currentTag.id);
        } else {
          this.getAllVideoList();
        }
      }
    },
  },
  created() {
    this.getVideoSub();
    this.getHotVideoSub();
    this.getAllVideoList();
  },
};
</script>
<style scoped>
.container {
  /* width: 85%; */
  margin: 0 auto;
}
.nav {
  margin: 10px 0;
  padding: 0 7.5%;
}
.left {
  display: inline-block;
}
.right {
  display: inline;
  float: right;
  text-align: center;
}
.cardList {
  overflow-y: scroll;
  padding: 0 7.5%;
  height: calc(100vh - 247px);
}
</style>