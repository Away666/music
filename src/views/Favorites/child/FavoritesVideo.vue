<template>
  <div class="FavoriteVideoContainer scroll">
    <div class="FavoriteVideo">
      <div v-if="favoriteMvList.length == 0" class="tip">
        <div>暂无收藏视频</div>
      </div>
      <div>
        <div class="title" v-if="favoriteMvList.length != 0">
          收藏的视频<span>({{ count }})</span>
          <span class="searchBox"
            ><el-input
              placeholder="搜索收藏视频"
              suffix-icon="el-icon-search"
              v-model="input"
              clearable
              @input="inputHandler"
            >
            </el-input
          ></span>
        </div>
        <video-list-card
          class="list"
          :videoList="favoriteMvList"
          :videoType="'favoriteVideo'"
          :isLoad="true"
          @clickListCardItem="clickMvItem"
          @bottomLoad="bottomLoad"
        ></video-list-card>
      </div>
    </div>
  </div>
</template>

<script>
import VideoListCard from "components/VideoListCard/VideoListCard.vue";
export default {
  components: { VideoListCard },
  name: "FavoriteVideo",
  data() {
    return {
      favoriteMvList: [],
      hasMore: false,
      currentPage: 1,
      count: 0,
      input: "",
    };
  },
  methods: {
    // 请求
    // 请求已收藏的专辑
    // 因为这边是下拉加载 不同与收藏歌手和专辑 且每次请求条数比较少 所以这里每次进入重新请求数据 请求的数据也不上传vuex
    async getFavoriteMvList() {
      let timestamp = Date.parse(new Date());
      let res = await this.$http("/mv/sublist", {
        limit: 50,
        offset: 50 * (this.currentPage - 1),
        timestamp,
      });
      console.log(res);
      this.favoriteMvList.push(...res.data.data);
      this.count = this.favoriteMvList.length;
    },

    // 事件
    // 点击卡片的事件
    clickMvItem({ id, index }) {
      if (this.favoriteMvList[index].type == 0) {
        this.$router.push({ name: "videoDetail", params: { id, type: "mv" } });
      } else {
        this.$router.push({
          name: "videoDetail",
          params: { id, type: "video" },
        });
      }
    },
    // 上拉触底的回调
    bottomLoad() {
      if (this.hasMore) {
        console.log("触底加载");
        this.currentPage += 1;
        this.getFavoriteMvList();
      }
    },
    inputHandler(value) {
      if (value == "") {
        this.favoriteMvList = [];
        this.getFavoriteMvList();
      } else {
        this.favoriteMvList = this.favoriteMvList.filter((item) => {
          return item.title.indexOf(value) >= 0;
        });
      }
    },
  },
  created() {
    this.getFavoriteMvList();
  },
};
</script>

<style lang="less" scoped>
.FavoriteVideoContainer {
  /* display: flex;
  justify-content: center;
  padding: 0 25px; */
  overflow-y: scroll;
  height: calc(100vh - 195px);
}

.FavoriteVideo {
  // padding: 0 7.5%;
}

.list {
  padding: 0px 30px;
}

.title {
  margin: 20px 30px;
  height: 30px;
  span {
    font-size: 12px;
    color: #cecece;
  }
}

.tip {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: rgb(34, 34, 34);
}
.searchBox {
  float: right;
  width: 150px;
  /deep/ input::-webkit-input-placeholder {
    /* 修改字体颜色 */
    color: #bababa !important;
    /* 修改字号，默认继承input */
    font-size: 12px;
  }

  /deep/ .el-input__inner {
    background-color: rgb(247, 247, 247) !important;
    color: gray !important;
    height: 30px;
    line-height: 30px;
  }
  /deep/ .el-input__icon {
    height: 30px !important;
    line-height: 30px;
  }
}
</style>