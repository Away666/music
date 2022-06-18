<template>
  <div class="container">
    <div class="box">
      <div class="banner">
        <div class="carousel">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="(item, index) in bannerList" :key="index">
              <img :src="item.imageUrl" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="recommend">
        <h3>
          <span @click="toSongList()"
            >推荐歌单<i class="iconfont icon-arrow-right-bold"></i
          ></span>
        </h3>
        <card-list
          :itemList="itemList"
          @clickListCardItem="clickListCardItem"
        ></card-list>
      </div>
      <div class="exclusive">
        <h3>
          <span>独家放送<i class="iconfont icon-arrow-right-bold"></i></span>
        </h3>
        <card-list
          :itemList="exclisiveList"
          @clickListCardItem="clickListCardItem"
        ></card-list>
      </div>
      <div class="newestMusic">
        <h3>
          <span>最新音乐<i class="iconfont icon-arrow-right-bold"></i></span>
        </h3>
        <newest-music
          :itemList="newestMusicList"
          @clickNewestMusicItem="clickNewestMusicItem"
        ></newest-music>
      </div>
    </div>
  </div>
</template>

<script>
import CardList from "../../../components/ListCard/ListCard.vue";
import NewestMusic from "../../../components/NewestMusic/NewestMusic.vue";
export default {
  name: "recommend",
  components: { CardList, NewestMusic },
  data() {
    return {
      bannerList: [],
      itemList: [],
      exclisiveList: [],
      newestMusicList: [],
    };
  },
  methods: {
    async getBanner() {
      let res = await this.$http("/banner");
      this.bannerList = res.data.banners;
    },
    async getItemList() {
      let res = await this.$http("/personalized", { limit: 10 });
      this.itemList = res.data.result;
    },
    async getExclusiveList() {
      let res = await this.$http("/personalized/privatecontent/list", {
        limit: 3,
      });
      this.exclisiveList = res.data.result;
    },
    async getNewestMusicList() {
      let res = await this.$http("/top/song");
      this.newestMusicList = res.data.data.slice(0, 12);
    },
    clickListCardItem(id) {
      console.log(id);
      this.$router.push({ name: "songListDetail", params: { id } });
    },
    clickNewestMusicItem() {},
    toSongList() {
      this.$router.push({ name: "songlist" });
    },
  },
  created() {
    this.getBanner();
    this.getItemList();
    this.getExclusiveList();
    this.getNewestMusicList();
  },
};
</script>
<style lang="less" scoped>
.banner {
  width: 100%;
}
.carousel {
  width: 100%;
}
.el-carousel {
  margin: auto;
  /* width: 85%; */
}
.el-carousel__item {
  border-radius: 10px;
}

.el-carousel__item img {
  height: 100%;
  width: 100%;
}
.recommend,
.exclusive {
  display: block;
  /* width: 85%; */
  margin: 0 auto;
}
.newestMusic {
  display: block;
  /* width: 85%; */
  margin: 0 auto;
}
.box {
  width: 85%;
  margin: auto;
}
h3 {
  span {
    cursor: pointer;
  }
}
</style>