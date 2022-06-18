<template>
  <div class="containerBox">
    <div class="item" v-for="(item, index) in mvRankList" :key="index">
      <div class="rank">
        <span>{{ index | handleIndex }}</span>
        <i
          v-if="item.lastRank < index + 1"
          class="iconfont icon-shangsheng1"
        ></i>
        <div v-if="item.lastRank > index + 1" class="reverse">
          <i class="iconfont icon-shangsheng1"></i>
        </div>
        <i v-if="item.lastRank == index + 1">-</i>
      </div>
      <div class="cover">
        <div class="imgBox" @click="clickListCardItem(item)">
          <img :src="item.cover" alt="" />
          <span class="score">{{ item.score }}</span>
        </div>
      </div>
      <div class="info">
        <p class="name" @click="clickListCardItem(item)">{{ item.name }}</p>
        <p class="artistName" @click="toSingerDetail(item)">
          {{ item.artistName }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { handleIndex } from "../../plugins/utils";
export default {
  props: {
    mvRankList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    clickListCardItem(item) {
      this.$emit("clickListCardItem", { id: item.id });
    },
    toSingerDetail(item) {
      this.$router.push({
        name: "singerDetail",
        params: { id: item.artists[0].id },
      });
    },
  },
  filters: {
    handleIndex,
  },
};
</script>
<style  lang="less" scoped>
.containerBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.item {
  width: 49%;
  height: 130px;
  position: relative;
}
.item:nth-last-of-type(even) {
  border-bottom: 1px solid rgb(242, 242, 242);
  border-right: 1px solid rgb(242, 242, 242);
}
.item:nth-last-of-type(odd) {
  border-bottom: 1px solid rgb(242, 242, 242);
}
.rank {
  // display: inline-block;
  height: 100%;
  width: 40px;
  float: left;
  position: relative;
  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgb(159, 159, 159);
    font-size: 20px;
  }
  > i {
    position: absolute;
    font-size: 12px;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgb(44, 119, 202);
  }
}
.reverse {
  position: absolute;
  color: red;
  display: inline-flex;
  top: 70%;
  left: 50%;
  transform: rotate(180deg) translate(50%, 50%);
  i {
    font-size: 12px;
  }
}
.cover {
  // position: absolute;
  // top: 50%;
  // transform: translate(0, -50%);
  width: 180px;
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
  .imgBox {
    width: 180px;
    height: 100px;
    position: relative;
    cursor: pointer;
    img {
      // position: absolute;
      // top: 50%;
      // transform: translate(0, -50%);
      border-radius: 5px;
      height: 100px;
      width: 100%;
    }
    .score {
      position: absolute;
      top: 2%;
      right: 3%;
      color: white;
      font-size: 12px;
      transform: scale(0.9);
    }
  }
}
.info {
  // display: inline-block;
  width: calc(100% - 230px);
  float: left;
  margin: 10px 5px;
  .name {
    width: calc(100% - 80px);
    font-size: 12px;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #818181;
  }
  .name:hover {
    color: black;
  }
  .artistName {
    font-size: 12px;
    cursor: pointer;
    transform: scale(0.9) translateX(-5%);
    padding: 10px 0;
    color: #b9b9b9;
  }
  .artistName:hover {
    color: #898989;
  }
}
</style>