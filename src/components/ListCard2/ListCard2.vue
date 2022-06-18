<template>
  <div class="itemList">
    <div v-if="FavoriteType == 'album'">
      <div
        v-for="(item, index) in itemList"
        :key="index"
        class="item"
        @click="clickItem(index)"
        @dblclick="dbClickItemAlbum(item.id)"
      >
        <img :src="item.picUrl" alt="" @click="toAlbum(item.id)" />
        <span class="name"
          ><span @click="toAlbum(item.id)">{{ item.name }}</span></span
        >
        <span class="singer" @click="toSinger(item.artists[0].id)">{{
          item.artists[0].name
        }}</span>
        <span class="size">{{ item.size }}首</span>
      </div>
    </div>
    <div v-else>
      <div
        v-for="(item, index) in itemList"
        :key="index"
        class="item"
        @click="clickItem(index)"
        @dblclick="dbClickItemSinger(item.id)"
      >
        <img :src="item.picUrl" alt="" @click="toSinger(item.id)" />
        <span class="name"
          ><span @click="toSinger(item.id)">{{ item.name }}</span></span
        >
        <span class="count">专辑：{{ item.albumSize }}</span>
        <span class="count">MV：{{ item.mvSize }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListCard2",
  data() {
    return {
      index: -1,
    };
  },
  props: {
    itemList: {
      type: Array,
      default: [],
    },
    FavoriteType: {
      type: String,
      default() {
        return "album";
      },
    },
  },
  methods: {
    clickItem(index) {
      this.index = index;
    },
    handleDom(current, last) {
      if (document.querySelector(".itemList")) {
        let tableRows = document
          .querySelector(".itemList")
          .querySelectorAll(".item");
        // console.log(tableRows[index]);
        // tableRows.classList.classList.remove("currentRow");
        tableRows[current].classList.add("currentRow");

        // 清除上一次的样式
        if (last != -1) {
          tableRows[last].classList.remove("currentRow");
        }
      }
    },
    toAlbum(id) {
      this.$router.push({ name: "album", params: { id } });
    },
    toSinger(id) {
      this.$router.push({ name: "singerDetail", params: { id } });
    },
    dbClickItemAlbum(id) {
      this.$router.push({ name: "album", params: { id } });
    },
    dbClickItemSinger(id) {
      this.$router.push({ name: "singerDetail", params: { id } });
    },
  },
  watch: {
    index(current, last) {
      this.handleDom(current, last);
    },
  },
  created() {},
};
</script>
<style lang="less" scoped>
.item {
  padding: 0 30px;
  height: 90px;
  // width: 100%;
  display: flex;
  align-items: center;
  img {
    height: 70px;
    border-radius: 5px;
    cursor: pointer;
  }
  .name {
    margin-left: 15px;
    width: 55%;
    font-size: 14px;
    cursor: pointer;
  }
  .singer {
    width: 25%;
    font-size: 12px;
    color: #bcbbbb;
    cursor: pointer;
  }
  .size {
    font-size: 12px;
    color: #aaa8a8;
  }
  .count {
    width: 25%;
    font-size: 12px;
    color: #bcbbbb;
  }
}
.item:nth-of-type(odd) {
  background-color: rgb(249, 249, 249);
}
.item:nth-of-type(even) {
  background-color: rgb(255, 255, 255);
}
.item:hover {
  background-color: rgb(240, 241, 242);
}
.currentRow {
  background-color: rgb(240, 241, 242) !important;
}
</style>