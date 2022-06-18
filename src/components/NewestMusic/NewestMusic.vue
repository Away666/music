<template>
  <div class="container">
    <div class="left">
      <div class="item" v-for="(item, index) in leftItemList" :key="index">
        <img :src="item.album.picUrl" alt="" />
        <div class="content">
          <div class="songName">{{ item.name }}</div>
          <div class="singer" @click="goToSingerDetail(item.artists[0].id)">
            {{ item.artists[0].name }}
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="item" v-for="(item, index) in centerItemList" :key="index">
        <img :src="item.album.picUrl" alt="" />
        <div class="content">
          <div class="songName">{{ item.name }}</div>
          <div class="singer">{{ item.artists[0].name }}</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="item" v-for="(item, index) in rightItemList" :key="index">
        <img :src="item.album.picUrl" alt="" />
        <div class="content">
          <div class="songName">{{ item.name }}</div>
          <div class="singer">{{ item.artists[0].name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "newestMusicList",
  data() {
    return {};
  },
  props: {
    itemList: {
      type: Array,
      default: [],
    },
  },
  methods: {
    goToSingerDetail(id) {
      console.log(id);
      this.$router.push({ name: "singerDetail", params: { id } });
    },
  },
  computed: {
    leftItemList() {
      let res = this.itemList.filter(function (x, index) {
        return index < 4;
      });
      return res;
    },
    centerItemList() {
      let res = this.itemList.filter(function (x, index) {
        return index >= 4 && index < 8;
      });
      return res;
    },
    rightItemList() {
      let res = this.itemList.filter(function (x, index) {
        return index >= 8 && index < 12;
      });
      return res;
    },
  },
  created() {},
};
</script>
<style  scoped>
.container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.left,
.center,
.right {
  width: 32%;
  overflow: hidden;
  margin-bottom: 20px;
}
.item {
  height: 60px;
  margin: 10px 0;
  position: relative;
}
.item:hover {
  background-color: rgb(234, 234, 234);
  border-radius: 10px;
}
img {
  height: 100%;
  border-radius: 10px;
  cursor: pointer;
}
.content {
  height: 60px;
  display: inline-block;
  position: absolute;
  top: 0;
  margin-left: 8px;
}
.songName {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
.singer {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  cursor: pointer;
  color: #999;
}
.singer:hover {
  color: #666;
}
</style>