<template>
  <div class="header">
    <div class="left">
      <img src="../../assets/images/logo.png" alt="" width="160" height="40" />
    </div>
    <div class="center">
      <div class="buttons">
        <i
          class="iconfont icon-arrow-left-bold back"
          @click="$router.go(-1)"
        ></i>
        <i
          class="iconfont icon-arrow-right-bold forward"
          @click="$router.go(1)"
        ></i>
      </div>
      <div class="search">
        <el-popover
          placement="bottom"
          width="300"
          v-model="isSearchPopShow"
          popper-class="searchPop"
          trigger="focus"
          :visible-arrow="false"
        >
          <el-input
            v-model="searchInput"
            placeholder="搜索"
            prefix-icon="el-icon-search"
            size="mini"
            slot="reference"
            @input="inputSearch"
            class="searchInput"
          ></el-input>
          <!-- 搜索历史不想做了，做的话可以将搜索历史存到localstorage中 -->
          <!-- 热搜榜 -->
          <div
            class="hotSearch"
            v-if="!searchSuggestList.songs && !inputSearch == ''"
          >
            <div class="hotSearchTitle">热搜榜</div>
            <div
              class="hotSearchItem"
              v-for="(item, index) in hotSearchList"
              :key="index"
              @click="clickHotSearchItem(item.searchWord)"
            >
              <div class="hotSearchIndex" :class="index < 3 ? 'topThree' : ''">
                {{ index + 1 }}
              </div>
              <div class="hotSearchInfo">
                <div
                  class="hotSearchWord"
                  :class="index < 3 ? 'hotSearchWordTopThree' : ''"
                >
                  {{ item.searchWord }}
                </div>
                <div class="hotSearchContent">{{ item.content }}</div>
              </div>
            </div>
          </div>
          <!-- 搜索建议 -->
          <div class="searchSuggest">
            <div class="hotSearchTitle" v-if="searchSuggestList.songs">
              搜索建议
            </div>
            <!-- 单曲 -->
            <div
              class="searchSuggestItem"
              v-if="
                searchSuggestList.songs && searchSuggestList.songs.length != 0
              "
            >
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-yinle"></i> 单曲
              </div>
              <div
                class="suggestItemDetail"
                v-for="(item, index) in searchSuggestList.songs"
                :key="index"
                @click="clickSuggestSong(item.id)"
              >
                {{ item.name + " - " + item.artists[0].name }}
              </div>
            </div>
            <!-- 歌手 -->
            <div
              class="searchSuggestItem"
              v-if="
                searchSuggestList.artists &&
                searchSuggestList.artists.length != 0
              "
            >
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-mic"></i> 歌手
              </div>
              <div
                class="suggestItemDetail"
                v-for="(item, index) in searchSuggestList.artists"
                :key="index"
                @click="clickSuggestSinger(item.id)"
              >
                {{ item.name }}
              </div>
            </div>
            <!-- 专辑 -->
            <div
              class="searchSuggestItem"
              v-if="
                searchSuggestList.albums && searchSuggestList.albums.length != 0
              "
            >
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-more"></i> 专辑
              </div>
              <div
                class="suggestItemDetail"
                v-for="(item, index) in searchSuggestList.albums"
                :key="index"
                @click="clickSuggestAlbum(item.id)"
              >
                {{ item.name + " - " + item.artist.name }}
              </div>
            </div>
            <!-- 歌单 -->
            <div
              class="searchSuggestItem"
              v-if="
                searchSuggestList.playlists &&
                searchSuggestList.playlists.length != 0
              "
            >
              <div class="searchSuggestItemTitle">
                <i class="iconfont icon-gedan"></i> 歌单
              </div>
              <div
                class="suggestItemDetail"
                v-for="(item, index) in searchSuggestList.playlists"
                :key="index"
                @click="clickSuggestMusicList(item.id)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <!-- <img src="~assets/img/searh.png" alt="" /> -->
        </el-popover>
      </div>
    </div>
    <div class="right">
      <el-popover
        placement="bottom"
        width="330"
        trigger="click"
        v-if="!userInfo.avatarUrl"
        :visible-arrow="false"
      >
        <div class="popover" slot="reference">
          <img
            src="../../assets/images/person.png"
            alt=""
            @click="isPopoverShow = !isPopoverShow"
            width="30"
            height="30"
          />
          <div class="username">
            <span>未登录 ▼</span>
          </div>
        </div>
        <login
          @getUserInfo="
            (info) => {
              userInfo = info;
              isPopoverShow = false;
            }
          "
        ></login>
      </el-popover>
      <div v-else>
        <img :src="userInfo.avatarUrl" alt="" width="30" height="30" />
        <el-popover
          placement="bottom"
          width="200"
          trigger="click"
          v-if="userInfo.nickname"
          popper-class="popoverBox"
          :visible-arrow="false"
        >
          <div class="username" slot="reference">
            <span>{{ userInfo.nickname }} ▼</span>
          </div>
          <div class="item" @click="logout">退出登录</div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { handleMusicTime } from "plugins/utils";
import Login from "../../components/Header/Login.vue";
// 节流定时器名称
let timer;
export default {
  name: "Header",
  components: { Login },
  data() {
    return {
      userInfo: {},
      searchInput: "",
      isLogin: true,
      isSearchPopShow: false,
      // 热搜列表数据
      hotSearchList: [],
      // 搜索推荐列表
      searchSuggestList: {},
    };
  },
  methods: {
    // 获取热搜列表
    async getHotSearch() {
      let res = await this.$http("/search/hot/detail");
      this.hotSearchList = res.data.data;
    },
    // 搜索框输入的回调
    inputSearch(e) {
      clearTimeout(timer);
      if (e != "") {
        timer = setTimeout(() => {
          this.getSearchSuggest(e);
        }, 500);
      } else {
        // 清空searchSuggestList
        this.searchSuggestList = {};
        return;
      }
    },

    // 获取搜索建议
    async getSearchSuggest(keywords) {
      // let res = await this.$http.post("/search/suggest", {
      //   keywords,
      //   timestamp: new Date().getTime(),
      // });
      let res = await this.$http("/search/suggest", { keywords });
      this.searchSuggestList = res.data.result;
    },

    // 根据id获取歌曲详情
    async getMusicInfo(ids) {
      let res = await this.$http("/song/detail", { ids });
      // 处理时间
      res.data.songs[0].dt = handleMusicTime(res.data.songs[0].dt);
      return res.data.songs[0];
    },

    // 在输入框按下回车的回调
    onSubmit(e) {
      if (e.keyCode == 13 && this.searchInput != "") {
        this.goSearch();
      }
    },

    // 跳转到搜素页
    goSearch() {
      this.isSearchPopShow = false;
      this.$router.push({ name: "search", params: { id: this.searchInput } });
    },

    // 点击搜素框热门歌曲
    clickHotSearchItem(name) {
      this.searchInput = name;
      this.goSearch();
    },

    // 点击搜索建议中专辑的回调
    clickSuggestAlbum(id) {
      this.$router.push({ name: "album", params: { id } });
      this.isSearchPopShow = false;
    },
    // 点击搜索建议中歌手的回调
    clickSuggestSinger(id) {
      this.$router.push({ name: "singerDetail", params: { id } });
      this.isSearchPopShow = false;
    },
    // 点击搜索建议中歌单的回调
    clickSuggestMusicList(id) {
      this.$router.push({ name: "songListDetail", params: { id } });
      this.isSearchPopShow = false;
    },
    // 点击搜索建议中单曲的回调
    async clickSuggestSong(id) {
      let row = await this.getMusicInfo(id);
      this.isSearchPopShow = false;
      // 首先获取当前的歌单列表和歌曲索引
      let musicList = this.$store.state.musicList;
      let currentIndex = this.$store.state.currentIndex;
      // 先判断该歌曲是否已经在歌单中存在，避免重复点击导致歌单出现相同歌曲
      let isExist = musicList.find((item) => item.id == row.id);
      if (isExist) {
        // 如果已经存在 则只提交歌曲id并return出去
        this.$store.commit("updateMusicId", row.id);
        return;
      }
      this.$store.commit("changePlayState", false);
      // 将请求到的歌曲详情插入到歌单对应位置并提交至vuex
      musicList.splice(currentIndex + 1, 0, row);
      this.$store.commit("updateMusicId", row.id);
      this.$store.commit("updateMusicList", {
        musicList,
        musicListId: this.$store.state.musicListId,
      });
    },

    // 获取当前用户信息
    async getCurrentUserInfo() {
      var timestamp = Date.parse(new Date());
      let res = await this.$http("/user/account", {
        timestamp,
      });
      if (res.data.profile != null) {
        this.userInfo = res.data.profile;
        // 更新登录状态
        this.$store.commit("updataLoginState", true);
        // 更新当前用户id
        // this.$store.commit("updateCurrentUserId", res.data.profile.userId);
        // 将请求到的用户id存入localstorage
        window.localStorage.setItem("userId", res.data.profile.userId);
      } else {
        // 未登录
        this.$store.commit("updataLoginState", false);
        // 如果localstorage存有userId就清除
        if (window.localStorage.getItem("userId")) {
          window.localStorage.removeItem("userId");
        }
      }
    },
    async logout() {
      let res = await this.$http("/logout");
      // console.log(res);

      if (res.data.code != 200) {
        this.$message("退出登录失败, 请稍后重试!");
        return;
      }

      // 清空data和localstorage中的数据，以及cookie
      // window.localStorage.setItem("userInfo", "");
      // this.clearAllCookie();
      // 删除localstoarge的userId
      window.localStorage.removeItem("userId");
      //   在vuex中更新登录状态
      this.$store.commit("updataLoginState", false);
      this.$message.success("退出成功!");
      // this.isCurrentUser = false;
      this.userInfo = {};
    },
  },

  async created() {
    this.getHotSearch();
    this.getCurrentUserInfo();
  },
};
</script>

<style lang="less" scoped>
@import "./Header.css";

.header {
  height: 60px;
  width: 100%;
  background-color: rgb(236, 65, 65);
}
.left {
  float: left;
  width: 200px;
  height: 100%;
  text-align: center;
  position: relative;
  img {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
  }
}
.center {
  float: left;
  margin-left: 50px;
  height: 60px;
}

.buttons {
  float: left;
  color: rgb(235, 235, 235);
  // display: flex;
  height: 60px;
}

.buttons i {
  background-color: #e13e3e;
  font-size: 12px;
  transform: scale(0.8);
  padding: 5px;
  height: 22px;
  line-height: 60px;
  width: 22px;
  border-radius: 50%;
  margin: 0 3px;
}
.search {
  float: left;
  margin-left: 30px;
  height: 60px;
}
.searchInput {
  height: 35px !important;
  line-height: 60px;
  width: 140px;
}
.right {
  float: right;
  height: 60px;
  width: 300px;
  position: relative;
  // .avatar {
  //   float: left;
  //   width: 30px;
  //   height: 60px;
  //   position: relative;
  // }
  img {
    // left: 0;
    // position: absolute;
    // top: 50%;
    // transform: translate(0, -50%);
    float: left;
    border-radius: 50%;
    margin-top: 15px;
    cursor: pointer;
  }
  .username {
    float: left;
    margin-left: 5px;
    // width: 100px;
    height: 60px;
    line-height: 60px;
    span {
      color: rgb(224, 221, 221);
      font-size: 12px;
      cursor: pointer;
    }
    span:hover {
      color: white;
    }
  }
}
.popover {
  height: 60px;
  width: 100px;
}
.hotSearch {
  height: 400px;
  overflow: auto;
  margin: 0 !important;
  padding: 0 !important;
}
.hotSearch::-webkit-scrollbar {
  display: none;
}

.hotSearchTitle {
  font-size: 13px;
  margin: 10px 0 5px 20px;
}

.hotSearchItem {
  display: flex;
  align-items: center;
  padding: 6.5px 15px;
  cursor: pointer;
}

.hotSearchItem:hover {
  background-color: #f2f2f2;
}
.popoverBox {
  padding: 0 !important;
}
.el-popper[x-placement^="bottom"] {
  margin-top: 0px !important;
}
.item {
  cursor: pointer;
  padding: 5px;
}
.item:hover {
  background-color: #f2f2f2;
}

.hotSearchIndex {
  width: 18px;
  margin-right: 15px;
  color: #aaa;
}

.topThree {
  color: #e13e3e;
}

.hotSearchWord {
  font-size: 12px;
  color: rgb(51, 51, 51);
}

.hotSearchWordTopThree {
  font-weight: 600;
  color: black;
}

.hotSearchContent {
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
}

.searchSuggest {
  font-size: 12px;
}

.searchSuggestItemTitle {
  background-color: #f5f5f7;
  padding: 4px 8px;
}

.searchSuggestItemTitle i {
  font-size: 15px;
}

.searchSuggestItem {
  cursor: pointer;
}

.suggestItemDetail {
  padding: 4px 27px;
  font-size: 12px;
}

.suggestItemDetail:hover {
  background-color: #f2f2f2;
}
</style>