<template>
  <div class="FavoriteSingerContainer scroll">
    <div class="FavoriteSinger">
      <div v-if="count != 0">
        <div class="title">
          收藏的歌手<span>({{ count }})</span>
          <span class="searchBox"
            ><el-input
              placeholder="搜索收藏歌手"
              suffix-icon="el-icon-search"
              v-model="input"
              clearable
              @input="inputHandler"
            >
            </el-input
          ></span>
        </div>
        <list-card-two
          :itemList="favoriteSingerList"
          :FavoriteType="'singer'"
        ></list-card-two>
      </div>
      <div v-else class="tip"><div>暂无收藏歌手</div></div>
    </div>
  </div>
</template>

<script>
import ListCardTwo from "components/ListCard2/ListCard2.vue";
export default {
  components: { ListCardTwo },
  name: "FavoriteSinger",
  data() {
    return {
      favoriteSingerList: [],
      count: 0,
      input: "",
    };
  },
  methods: {
    // 请求
    // 请求已收藏的歌手
    async getFavoriteSingerList() {
      let timestamp = Date.parse(new Date());
      let res = await this.$http("/artist/sublist", timestamp);
      this.favoriteSingerList = res.data.data;
      console.log(res);
      this.count = res.data.count;
      this.$store.commit("updateSubSingerList", res.data.data);
    },

    // 事件
    // 点击卡片的事件
    clickListCardItem(id) {
      this.$router.push({ name: "singerDetail", params: { id } });
    },
    inputHandler(value) {
      if (value == "") {
        this.getFavoriteSingerList();
      } else {
        this.favoriteSingerList = this.favoriteSingerList.filter((item) => {
          return item.name.indexOf(value) >= 0;
        });
      }
    },
  },
  created() {
    if (this.$store.state.subSingerList == null) {
      this.getFavoriteSingerList();
      console.log("发送了请求");
    } else {
      this.favoriteSingerList = this.$store.state.subSingerList;
      this.count = this.$store.state.subSingerList.length;
    }
  },
  watch: {
    "$store.state.subSingerList"(current) {
      this.favoriteSingerList = current;
      this.count = current.length;
    },
  },
};
</script>

<style lang="less" scoped>
.FavoriteSingerContainer {
  /* display: flex;
  justify-content: center;
  padding: 0 25px; */
  overflow-y: scroll;
  height: calc(100vh - 195px);
}

.FavoriteSinger {
  /* padding: 0 7.5%; */
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