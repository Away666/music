<template>
  <div class="container scroll">
    <div class="mv">
      <h3 class="mvTitle">
        最新MV<i class="iconfont icon-arrow-right-bold"></i>
      </h3>
      <div class="right">
        <nav-bar-two
          :SecondNavBarData="navBarData"
          :itemWidth="60"
          @clickSecondBarItem="clickSecondBarItemOne"
        ></nav-bar-two>
      </div>
    </div>
    <div class="itemList">
      <mv-list-card
        :videoList="newstMv"
        :videoType="'mv'"
        class="cardList"
        @clickListCardItem="goToVideoDetail"
      >
      </mv-list-card>
    </div>
    <div class="mv">
      <h3 class="mvTitle">
        网易出品<i class="iconfont icon-arrow-right-bold"></i>
      </h3>
    </div>
    <div class="itemList">
      <mv-list-card
        :videoList="officialMv"
        :videoType="'mv'"
        class="cardList"
        @clickListCardItem="goToVideoDetail"
      >
      </mv-list-card>
    </div>
    <div>
      <div class="mv">
        <h3 class="mvTitle">
          MV排行榜<i class="iconfont icon-arrow-right-bold"></i>
        </h3>
        <div class="right">
          <nav-bar-two
            :SecondNavBarData="navBarData"
            :itemWidth="60"
            :mvType="2"
            @clickSecondBarItem="clickSecondBarItemTwo"
          ></nav-bar-two>
        </div>
      </div>
      <div class="itemList">
        <mv-rank :mvRankList="mvRankList" @clickListCardItem="goToVideoDetail">
        </mv-rank>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarTwo from "../../../components/NavBar2/NavBar2.vue";
import MvListCard from "../../../components/MvListCard/MvListCard.vue";
import MvRank from "../../../components/MvRank/MvRank.vue";
export default {
  name: "MvList",
  components: { NavBarTwo, MvListCard, MvRank },
  data() {
    return {
      // mv 地区
      areaList: [
        { name: "全部", path: "" },
        { name: "内地", path: "内地" },
        { name: "港台", path: "港台" },
        { name: "欧美", path: "欧美" },
        { name: "日本", path: "日本" },
        { name: "韩国", path: "韩国" },
      ],
      // mv 类型
      typeList: [
        { name: "全部", path: "" },
        { name: "官方版", path: "官方版" },
        { name: "原生", path: "原生" },
        { name: "现场版", path: "现场版" },
        { name: "网易出品", path: "网易出品" },
      ],
      // 排序
      orderList: [
        { name: "上升最快", path: "" },
        { name: "最热", path: "最热" },
        { name: "最新", path: "最新" },
      ],
      // 当前地区
      area: "",
      // 当前类型
      type: "",
      // 当前排序
      order: "",
      // 最新Mv
      newstMv: [],
      // 网易出品Mv
      officialMv: [],
      // Mv排行榜数据
      mvRankList: [],
      // Mv排行榜当前地区
      mvArea: "",
    };
  },
  methods: {
    // 获取最新MV的数据
    async getNewstMv(area) {
      let res = await this.$http("/mv/first", {
        area: this.area == "" ? "内地" : area,
        limit: 8,
      });
      this.newstMv = res.data.data;
    },

    // 获取网易出品Mv的数据
    async getOfficialMv() {
      let res = await this.$http("/mv/exclusive/rcmd", {
        limit: 8,
      });
      console.log(res);
      this.officialMv = res.data.data;
    },
    // 点击标签的回调
    clickSecondBarItemOne(item, index) {
      this.area = item.name;
      this.getNewstMv(item.name);
    },
    // 点击标签的回调
    clickSecondBarItemTwo(item, index) {
      this.mvArea = item.name;
      this.getMvRankList(item.name);
    },
    // 跳转至详情
    goToVideoDetail({ id }) {
      this.$router.push({
        name: "videoDetail",
        params: { id, type: "mv" },
      });
    },
    // 获取Mv排行榜数据
    async getMvRankList(area) {
      let res = await this.$http("/top/mv", {
        limit: 10,
        area: this.mvArea == "" ? "内地" : area,
      });
      console.log(res);
      this.mvRankList = res.data.data;
    },
  },
  computed: {
    navBarData() {
      return this.areaList.splice(1);
    },
  },
  created() {
    this.getNewstMv();
    this.getOfficialMv();
    this.getMvRankList();
  },
};
</script>
<style  scoped>
.container {
  overflow-y: scroll;
  height: calc(100vh - 195px);
}
.mv {
  padding: 0 7.5%;
  height: 60px;
  position: relative;
}
.mvTitle {
  display: inline;
  cursor: pointer;
  line-height: 60px;
}
.right {
  position: absolute;
  display: inline;
  float: right;
  top: 50%;
  right: 7.5%;
  transform: translate(-0%, -50%);
}
.itemList {
  padding: 0 7.5%;
}
</style>