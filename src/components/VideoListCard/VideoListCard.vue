<template>
  <!-- singermv 和 mv -->
  <div>
    <div
      class="videoListCard"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="300"
      :infinite-scroll-immediate="false"
      v-if="videoType == 'singerMv'"
    >
      <div
        class="cardItem"
        v-for="(item, index) in videoList"
        :key="index"
        @click="clickListCardItem(item.id, index, item.type)"
      >
        <div class="videoCover">
          <img
            :src="
              (videoType == 'singerMv' ? item.imgurl : item.cover) +
              '?param=680y400'
            "
            alt=""
          />
          <div class="playCount">
            <i class="iconfont icon-shipin"></i>{{ item.playCount | handleNum }}
          </div>
          <div class="videoTime" v-if="videoType == 'singerMv'">
            {{ item.duration | handleMusicTime }}
          </div>
        </div>
        <div class="videoTitle">{{ item.name }}</div>
        <div class="singer" v-if="videoType == 'mv'">{{ item.artistName }}</div>
      </div>
    </div>
    <!-- video -->
    <div
      class="videoListCard"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="300"
      :infinite-scroll-immediate="false"
      v-else-if="videoType == 'video'"
    >
      <div
        class="cardItem"
        v-for="(item, index) in videoList"
        :key="index"
        @click="clickListCardItem(item.vid || item.data.vid, index, item.type)"
      >
        <div class="videoCover">
          <img
            :src="(item.coverUrl || item.data.coverUrl) + '?param=1260y800'"
            alt=""
          />
          <div class="playCount">
            <i class="iconfont icon-shipin"></i
            >{{ (item.playTime || item.data.playTime) | handleNum }}
          </div>
          <div class="videoTime">
            {{ (item.durationms || item.data.durationms) | handleMusicTime }}
          </div>
        </div>
        <div class="videoTitle">{{ item.title || item.data.title }}</div>
        <div class="creator" v-if="item.data">
          by<span>{{ item.data.creator.nickname }}</span>
        </div>
      </div>
    </div>
    <!-- favoriteVideo -->
    <div
      class="videoListCard"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="300"
      :infinite-scroll-immediate="false"
      v-else-if="videoType == 'favoriteVideo'"
    >
      <div
        class="cardItem"
        v-for="(item, index) in videoList"
        :key="index"
        @click="clickListCardItem(item.vid || item.data.vid, index, item.type)"
      >
        <div class="videoCover">
          <img
            :src="(item.coverUrl || item.data.coverUrl) + '?param=1260y800'"
            alt=""
          />
          <div class="playCount">
            <i class="iconfont icon-shipin"></i
            >{{ (item.playTime || item.data.playTime) | handleNum }}
          </div>
          <div class="videoTime">
            {{ (item.durationms || item.data.durationms) | handleMusicTime }}
          </div>
        </div>
        <div class="videoTitle">{{ item.title || item.data.title }}</div>
        <div class="creator">
          by<span>{{ item.creator[0].userName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleMusicTime, handleNum } from "plugins/utils.js";

export default {
  name: "VideoListCard",
  data() {
    return {
      // 无限滚动是否可用
      disabled: true,
    };
  },
  props: {
    videoList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否触底加载
    isLoad: {
      type: Boolean,
      default() {
        return false;
      },
    },
    videoType: {
      type: String,
      default() {
        return "singerMv";
      },
    },
  },
  methods: {
    clickListCardItem(id, index, type) {
      this.$emit("clickListCardItem", { id, index, type });
    },
    // 上拉触底触发
    load() {
      this.$emit("bottomLoad");
      // 触发load后加载数据 期间不允许再次触发load事件
      this.disabled = true;
    },
  },
  filters: {
    handleMusicTime,
    handleNum,
  },
  watch: {
    //   数据更新后，再次运行触发load事件
    videoList() {
      if (this.isLoad == true) {
        if (this.videoList.length != 0) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.videoListCard {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
  margin-top: 20px;
}

.cardItem {
  /* max-width: 228px; */
  /* width: 14.64vw; */
  /* margin-right: 1%; */
  /* margin-left: 1%; */
  /* margin-bottom: 20px; */
  width: 22%;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
}

/* .cardItem:nth-child(4n) {
  margin: 0;
} */

.videoCover {
  position: relative;
  /* height: 11.6vw; */
  height: 9.28vw;
  width: 100%;
  max-height: 144px;
  overflow: hidden;
  border-radius: 10px;
  display: flex;
  align-items: center;
  background-color: black;
}

.videoCover img {
  width: 18.3vw;
}

.playCount {
  font-size: 12px;
  color: white;
  position: absolute;
  top: 0;
  right: 5px;
  transform: scale(0.9);
}

.videoTime {
  font-size: 12px;
  color: white;
  position: absolute;
  bottom: 5px;
  transform: scale(0.9);
  right: 5px;
}

.videoTitle {
  margin-top: 8px;
  font-size: 12px;
  line-height: 16px;
  color: rgb(32, 32, 32);
  word-break: break-all;
  /* 两行溢出 */
  /*text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.creator {
  margin-top: 5px;
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  color: #c7c5c5;
  span {
    margin-left: 5px;
  }
  span:hover {
    color: gray;
  }
}

.singer {
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  margin: 1px 0 0 -1px;
  padding: 0;
}
</style>