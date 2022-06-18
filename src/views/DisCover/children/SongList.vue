<template>
  <div class="container">
    <!-- 歌单信息展示 -->
    <div class="box">
      <div class="SongListInfo" v-if="isShow">
        <img :src="showInfo.coverImgUrl" alt="" class="backgroundImg" />
        <div class="cover">
          <img :src="showInfo.coverImgUrl" alt="" />
        </div>
        <div class="EntryInfo">
          <div class="tag"><i class="iconfont icon-good"></i> 精品歌单</div>
          <div class="name">{{ showInfo.name }}</div>
          <div class="desc">{{ showInfo.copywriter }}</div>
        </div>
      </div>
      <!-- 切换歌单分类 -->
      <div class="nav">
        <div class="left">
          <song-list-category
            :sub="sub"
            :currentTag="currentTag"
            @clickSongListItem="clickSongListItem"
          ></song-list-category>
        </div>
        <div class="right">
          <!-- <div class="navBar">
          <div
            class="barItem"
            :class="index == activeNum ? 'active' : ''"
            v-for="(item, index) in hotSongList"
            :key="index"
            @click="clickSecondBarItem(item, index)"
          >
            {{ item.name }}
          </div>
        </div> -->
          <second-nav-bar
            :SecondNavBarData="hotSongList"
            :itemWidth="0"
            :currentTag="currentTag"
            @clickSecondBarItem="clickSecondBarItem"
          >
          </second-nav-bar>
        </div>
      </div>
      <!-- 展示对应歌单分类的数据 -->
      <div class="SongListContent">
        <card-list
          :itemList="songList"
          @clickListCardItem="clickListCardItem"
        ></card-list>
      </div>
      <!-- 分页 -->
      <div class="page" v-if="songList[0]">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="50"
          small
          :current-page="currentPage"
          @current-change="pageChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SongListCategory from "../../../components/SongListCategory/SongListCategory.vue";
import SecondNavBar from "../../../components/secondNavBar/SecondNavBar.vue";
import CardList from "../../../components/ListCard/ListCard.vue";
export default {
  name: "SongList",
  components: { SongListCategory, CardList, SecondNavBar },
  data() {
    return {
      isShow: true,
      showInfo: [],
      sub: [],
      hotSongList: [],
      currentTag: {},
      category: {},
      songList: [],
      activeNum: -1,
      currentPage: 1,
      total: 0,
    };
  },
  methods: {
    // 获取歌单信息
    async getHighquality(tag) {
      let res = await this.$http("/top/playlist/highquality", {
        limit: 1,
        cat: tag,
      });
      this.isShow = res.data.more;
      this.showInfo = res.data.playlists[0];
    },
    // 获取歌单分类
    async getSongListCategory() {
      let res = await this.$http("/playlist/catlist");
      this.sub = res.data.sub;
      this.currentTag = res.data.all;
    },
    // 获取热门歌单分类
    async getHotSongList() {
      let res = await this.$http("/playlist/hot");
      this.hotSongList = res.data.tags;
    },
    // 获取歌单列表
    async getSongList(tag) {
      this.songList = [];
      let res = await this.$http("/top/playlist", {
        cat: tag,
        offset: 50 * (this.currentPage - 1),
      });
      this.total = res.data.total;
      this.songList = res.data.playlists;
    },
    // 点击歌单分类item的回调
    clickSongListItem(item) {
      this.currentPage = 1;
      this.currentTag = item;
      this.getHighquality(item.name);
      this.getSongList(item.name);
    },
    // 点击二级导航的回调
    clickSecondBarItem(item, index) {
      if (this.activeNum == index) {
        return;
      }
      this.currentPage = 1;
      this.activeNum = index;
      this.currentTag = this.hotSongList[index];
      this.getHighquality(item.name);
      this.getSongList(item.name);
    },
    // 点击歌单的回调
    clickListCardItem(id) {
      console.log(id);
      this.$router.push({ name: "songListDetail", params: { id } });
    },
    // 分页
    pageChange(page) {
      this.currentPage = page;
      this.getSongList();
    },
  },
  created() {
    this.getHighquality();
    this.getSongListCategory();
    this.getHotSongList();
    this.getSongList();
  },
};
</script>
<style lang="less" scoped>
.box {
  width: 85%;
  margin: auto;
}
.SongListInfo {
  width: 100%;
  position: relative;
  height: 160px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  cursor: pointer;
}
.backgroundImg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 100%;
  transform: translateY(-40%);
  filter: blur(50px) brightness(70%);
}

.cover {
  width: 140px;
  height: 140px;
  margin: 10px;
}

.cover img {
  border-radius: 10px;
  width: 100%;
}

.tag {
  color: #d59e54;
  border: 1px solid #d59e54;
  padding: 8px 10px;
  width: 88px;
  font-size: 12px;
  margin: 25px 10px 22px;
  border-radius: 15px;
  text-align: center;
}

.tag i {
  font-size: 14px;
}

.name {
  color: white;
  font-size: 14px;
  margin: 10px 0;
}

.desc {
  color: rgba(255, 255, 255, 0.5);
  /* 字体直接写小于12没有效果 */
  font-size: 12px;
  margin-top: 10px;
}
.nav {
  margin: 10px 0;
}
.left {
  display: inline-block;
}
.right {
  display: inline;
  float: right;
  text-align: center;
}
.navBar {
  display: flex;
  flex-wrap: wrap;
}

.barItem {
  margin: 4px -2px;
  padding: 6px 10px;
  font-size: 12px;
  /* width: 40px; */
  text-align: center;
  box-sizing: content-box;
  transform: scale(0.9, 0.9);
  cursor: pointer;
}

.active {
  background-color: #fdf5f5;
  color: #ec4747;
  border-radius: 11px;
}
.SongListContent {
  margin: 10px 0;
}
.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}
</style>