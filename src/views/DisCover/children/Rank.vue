<template>
  <div class="container">
    <div class="box">
      <div class="ranking" v-if="officialListDetail.length != 0">
        <div class="offical">
          <div class="title">官方榜</div>
          <list-table
            :officialListDetailItem="item"
            v-for="(item, index) in officialListDetail"
            :key="index"
            @handleRowClick="handleRowClick"
            @handleRowDbClick="handleRowDbClick"
            @clickCheckAll="clickListCardItem"
          ></list-table>
        </div>
        <div class="global">
          <div class="title">全球榜</div>
          <!-- 展示歌单列表 -->
          <list-card
            class="listCard"
            :itemList="globalList"
            @clickListCardItem="clickListCardItem"
          ></list-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListTable from "../../../components/ListTable/ListTable.vue";
import ListCard from "../../../components/ListCard/ListCard.vue";
import { handleMusicTime } from "../../../plugins/utils";
export default {
  name: "Rank",
  components: { ListCard, ListTable },
  data() {
    return {
      officialList: [],
      officialListDetail: [],
      globalList: [],
    };
  },
  methods: {
    // 获取所有排行榜列表
    async getRankList() {
      let res = await this.$http("/toplist");
      this.officialList = res.data.list.slice(0, 4);
      this.globalList = res.data.list.slice(4);
    },
    // 根据榜单id请求详细数据
    // 根据传来的 id 查询歌单
    async getMusicListDetail(id) {
      let result = await this.$http("/playlist/detail", { id: id });
      result = result.data.playlist;
      // 对时间进行处理
      result.tracks.forEach((item, index) => {
        result.tracks[index].dt = handleMusicTime(item.dt);
      });
      this.officialListDetail.push(result);
    },
    // 行点击事件的回调
    handleRowClick(event) {
      // console.log(event);
      if (document.querySelector(".selectRow")) {
        document.querySelector(".selectRow").classList.remove("selectRow");
      }
      event.classList.add("selectRow");
    },
    // 行双击事件的回调
    // id 歌单id   index 双击歌曲在歌单中的索引
    handleRowDbClick({ id, index }) {
      // console.log(id);
      // console.log(index);
      let musicListIndex = this.officialListDetail.findIndex(
        (item) => item.id == id
      );
      // console.log(musicListIndex);
      this.$store.commit(
        "updateMusicId",
        this.officialListDetail[musicListIndex].tracks[index].id
      );
      // 如果歌单发生变化,则提交歌单到vuex
      if (id != this.$store.state.musicListId) {
        // 将歌单传到vuex
        this.$store.commit("updateMusicList", {
          musicList: this.officialListDetail[musicListIndex].tracks,
          musicListId: id,
        });
      }
    },
    // 点击榜单进入歌单详情界面
    clickListCardItem(id) {
      if (!this.$store.state.isLogin) {
        this.$message.error("登录后才能查看全部歌曲哦!");
        return;
      }
      if (id.id) {
        id = id.id;
      }
      this.$router.push({ name: "songListDetail", params: { id } });
    },
  },
  created() {
    this.getRankList().then(() => {
      this.officialList.forEach((item) => {
        this.getMusicListDetail(item.id);
      });
    });
  },
};
</script>
<style  scoped>
.box {
  width: 85%;
  margin: auto;
}


.listCard {
  margin-top: 15px;
}
</style>