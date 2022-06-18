<template>
  <div class="SongListContainer" v-if="songListInfo">
    <div class="info">
      <!-- 歌单封面 -->
      <div class="listAvatar">
        <img :src="songListInfo.coverImgUrl" alt="" />
      </div>
      <div class="right">
        <!-- 标题 -->
        <div class="title">
          <div class="titleTag">歌单</div>
          <div class="titleContent">{{ songListInfo.name }}</div>
        </div>
        <!-- 用户信息 -->
        <div class="user" v-if="songListInfo.creator">
          <div class="userAvatar">
            <img :src="songListInfo.creator.avatarUrl" alt="" />
          </div>
          <div
            class="userName"
            @click="
              $router.push({
                name: 'personal',
                params: { uid: songListInfo.creator.userId },
              })
            "
          >
            {{ songListInfo.creator.nickname }}
          </div>
          <div class="createTime">
            {{ songListInfo.createTime | showDate }}创建
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="buttons">
          <div class="buttonItem playAll" @click="playAll">
            <i class="iconfont icon-bofang playAll"></i>
            <span>播放全部</span>
          </div>
          <div class="buttonItem" v-if="!isCreated" @click="collectList">
            <i class="iconfont icon-xihuan" :class="isSub ? 'red' : ''"></i>
            <span
              >{{ isSub ? "已收藏" : "收藏" }}({{
                songListInfo.subscribedCount | handleNum
              }})</span
            >
          </div>
          <div class="buttonItem">
            <i class="iconfont icon-zhuanfa"></i>
            <span>分享({{ songListInfo.shareCount | handleNum }})</span>
          </div>
        </div>
        <!-- 标签 -->
        <div class="tags" v-if="songListInfo.tags">
          标签：
          <div
            class="tagItem"
            v-for="(item, index) in songListInfo.tags"
            :key="index"
          >
            {{ item }}
          </div>
          <div v-if="songListInfo.tags.length == 0">暂无标签</div>
        </div>
        <!-- 歌曲列表的歌曲数量和播放量 -->
        <div class="otherInfo">
          <div class="musicNum">
            歌曲 : {{ songListInfo.trackCount | handleNum }}
          </div>
          <div class="playCount">
            播放 : {{ songListInfo.playCount | handleNum }}
          </div>
        </div>
        <div class="desc">
          简介 :
          {{ songListInfo.description ? songListInfo.description : "暂无简介" }}
        </div>
      </div>
    </div>
    <div class="song-list">
      <el-tabs value="first" @tab-click="clickTab">
        <el-tab-pane label="歌曲列表" name="first">
          <!-- 表格 -->
          <el-table
            :data="songListInfo.tracks"
            size="mini"
            style="width: 100%"
            @row-dblclick="clickRow"
            highlight-current-row
            stripe
            lazy
            :row-key="
              (row) => {
                return row.id;
              }
            "
            v-infinite-scroll="this.$store.state.isLogin ? loadMore : ''"
            :infinite-scroll-disabled="scrollLoadDisabled"
            :infinite-scroll-distance="9000"
            :infinite-scroll-immediate="false"
          >
            <el-table-column
              label=""
              width="45"
              type="index"
              :index="handleIndex"
            >
            </el-table-column>
            <el-table-column label="" prop="id" width="27">
              <template slot-scope="scope">
                <i
                  class="iconfont icon-xihuan"
                  @click="
                    songListInfo.tracks.length != 0
                      ? likeIt(scope.row.id, scope.$index)
                      : ''
                  "
                ></i>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="音乐标题" min-width="250">
            </el-table-column>
            <el-table-column prop="ar[0].name" label="歌手" min-width="120">
              <template slot-scope="scope"
                ><span @click="singerClick(scope.row.ar[0].id)">{{
                  scope.row.ar[0].name
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="al.name" label="专辑" min-width="200"
              ><template slot-scope="scope"
                ><span @click="albumClick(scope.row.al.id)">{{
                  scope.row.al.name
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dt" label="时长" min-width="100">
            </el-table-column>
            <!-- <el-table-column prop="id"></el-table-column> -->
          </el-table>
          <div class="loadMore" v-if="isMore && !this.$store.state.isLogin">
            登陆后查看更多音乐
          </div>
          <div class="placeholder" v-else></div>
          <!-- <div class="placeholder"></div> -->
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <div
            class="commentList"
            v-if="comments.comments"
            v-loading="isCommentLoading"
          >
            <!-- 精彩评论 -->
            <comment
              :commentType="'musicList'"
              :comments="comments.hotComments"
              :commentId="songListInfo.id + ''"
              @getComment="getMusicListComment"
              @scrollToComment="scrollToComment"
              v-if="comments.hotComments"
              ref="hotComments"
              ><div slot="title">精彩评论</div></comment
            >
            <!-- 最新评论 -->
            <comment
              :comments="comments.comments"
              :commentType="'musicList'"
              :commentId="songListInfo.id + ''"
              :isHotComment="comments.hotComments ? false : true"
              @getComment="getMusicListComment"
              @scrollToComment="scrollToComment"
              @transToHotComment="
                (info) =>
                  $refs.hotComments.floorComment(info.commentId, info.nickName)
              "
              ><div slot="title">热门评论</div></comment
            >
          </div>
          <!-- 分页 -->
          <div
            class="page"
            v-show="comments.comments && comments.comments.length != 0"
          >
            <el-pagination
              background
              layout="prev, pager, next"
              :total="comments.total"
              small
              :page-size="50"
              :current-page="currentCommentPage"
              @current-change="commentPageChange"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="third">
          <user-list-card
            userType="musicListDetailPage"
            :userList="followedsListData.followedsList"
            :isLoad="followedsListData.isMore"
            @bottomLoad="bottomLoad"
          ></user-list-card>
          <div
            class="tips"
            v-if="
              followedsListData.followedsList.length == 0 &&
              followedsListData.isLoaded == true
            "
          >
            暂无收藏者
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <go-top scrollObj=".el-main"></go-top>
  </div>
</template>

<script>
import Comment from "../../components/Comment/Comment.vue";
import UserListCard from "../../components/UserListCard/UserListCard.vue";
import GoTop from "../../components/GoTop/GoTop.vue";

import { formatDate, handleNum, handleMusicTime } from "../../plugins/utils";
export default {
  name: "songlistdetail",
  components: { GoTop, Comment, UserListCard },
  data() {
    return {
      songListInfo: {},
      // 用户是否收藏了当前歌单
      isSub: false,
      // 是否是用户创建的歌单
      isCreated: false,
      // 是否还有更多音乐
      isMore: false,
      // 是否禁止滚动加载
      scrollLoadDisabled: false,
      // 评论
      comments: {},
      // 评论页码
      currentCommentPage: 1,
      // 评论是否在加载
      isCommentLoading: false,
      // 是否禁止滚动加载
      // 收藏者列表的变量
      followedsListData: {
        // 当前页数
        currentPage: 1,
        // 列表
        followedsList: [],
        // 是否还有更多
        isMore: false,
        // 是否已经加载过列表数据 （用于点击收藏者tab后第一次加载数据）
        isLoaded: false,
      },
      // 用户的喜欢音乐列表
      likeMuiscList: [],
    };
  },
  filters: {
    showDate(value) {
      // 1、先将时间戳转成Date对象
      const date = new Date(value);

      // 2、将date进行格式化
      return formatDate(date, "yyyy-MM-dd");
    },
    handleNum,
  },
  methods: {
    // 获取歌单信息
    async getSongListDetail() {
      var timestamp = Date.parse(new Date());
      let res = await this.$http("/playlist/detail", {
        id: this.$route.params.id,
        timestamp,
      });
      this.songListInfo = res.data.playlist;
      // console.log(this.songListInfo);
      // 判断是否还有更多音乐
      if (
        this.songListInfo.tracks.length != this.songListInfo.trackIds.length
      ) {
        this.isMore = true;
      }
      // 处理播放时间
      this.songListInfo.tracks.forEach((item, index) => {
        this.songListInfo.tracks[index].dt = handleMusicTime(item.dt);
      });
      // 判断用户是否喜欢该音乐
      // 直接两个循环性能损耗太厉害了 没什么思路暂时不做先
      // let likeMusicList = this.$store.state.likeMusicList;
    },
    // 获取歌单评论
    async getMusicListComment(type) {
      // 获取时间戳
      var timestamp = Date.parse(new Date());
      this.isCommentLoading = true;

      if (type == "changePage") {
        this.scrollToComment();
      }
      let res = await this.$http("/comment/playlist", {
        id: this.$route.params.id,
        offset: (this.currentCommentPage - 1) * 50,
        limit: 50,
        timestamp,
      });
      console.log(res);
      if (res.data.code !== 200) {
        this.$message.error("获取评论失败,请稍后重试!");
      }
      this.comments = res.data;
      this.isCommentLoading = false;
      console.log("重新歌单获取评论");
    },

    // 获取歌单收藏者
    async getMusicListFolloweds() {
      let res = await this.$http("/playlist/subscribers", {
        id: this.$route.params.id,
        offset: (this.followedsListData.currentPage - 1) * 20,
      });
      this.followedsListData.isMore = res.data.more;
      this.followedsListData.followedsList.push(...res.data.subscribers);
    },

    scrollToComment() {
      let container = document.querySelector(".el-main");
      let info = document.querySelector(".info");
      // console.log("执行了这里 滚动到精彩评论", [listInfo]);
      container.scrollTo({
        behavior: "smooth",
        top: info.clientHeight + 30,
      });
    },
    // 点击播放全部按钮的回调
    playAll() {
      this.$store.commit("updateMusicId", this.songListInfo.tracks[0].id);
      this.$store.commit("updateMusicList", {
        musicList: this.songListInfo.tracks,
        musicListId: this.songListInfo.id,
      });
    },
    // 判断用户是否收藏了该歌单
    getIsSub() {
      this.isSub = this.$store.state.collectMusicList.find(
        (item) => item.id == this.$route.params.id
      );
    },
    // 判断是否是用户创建的歌单
    getIsCreated() {
      this.isCreated = this.$store.state.createdMusicList.find(
        (item) => item.id == this.$route.params.id
      );
    },
    // 点击收藏按钮的回调
    async collectList() {
      if (!this.$store.state.isLogin) {
        // this.$message.error("请先进行登录操作!");
        return;
      }
      this.isSub = !this.isSub;
      // 请求
      let timestamp = Date.parse(new Date());
      await this.$http("/playlist/subscribe", {
        id: this.$route.params.id,
        t: this.isSub ? 1 : 2,
        timestamp,
      });

      // 重新获取收藏的歌单
      let res = await this.$http("/user/playlist", {
        uid: window.localStorage.getItem("userId"),
        timestamp,
      });
      res = res.data.playlist;
      let index = res.findIndex((item) => item.subscribed == true);
      let collectedMusicList = res.slice(index);
      // 将收藏的歌单上传至vuex
      this.$store.commit("updateCollectMusicList", collectedMusicList);
      // 请求收藏歌单列表并保存至vuex
      this.getSongListDetail();
    },
    // 点击el-tab-pane的回调
    clickTab(e) {
      // console.log(e.index);
      if (e.index == 1 && !this.comments.comments) {
        this.getMusicListComment();
      } else if (e.index == 2 && !this.followedsListData.isLoaded) {
        this.getMusicListFolloweds();
        this.followedsListData.isLoaded = true;
      }
    },
    // 双击table的row的回调
    async clickRow(row) {
      console.log(row);
      // 将musicId提交到vuex中 供bottomControl查询歌曲url和其它操作
      this.$store.commit("updateMusicId", row.id);
      // 如果歌单发生变化,则提交歌单到vuex
      if (this.songListInfo.id != this.$store.state.musicListId) {
        // 将歌单传到vuex
        this.$store.commit("updateMusicList", {
          musicList: this.songListInfo.tracks,
          musicListId: this.songListInfo.id,
        });
      }
      // let result = await this.$request("/song/url", { id: row.id, br: 320000 });
      // console.log(result.data.data[0].url);
      // this.$store.commit("updateMusicUrl", result.data.data[0].url);
    },
    // 事件函数
    handleIndex(index) {
      // console.log(index);
      index += 1;
      if (index < 10) {
        return "0" + index;
      } else {
        return index;
      }
    },
    // 获取歌曲详情
    async getMusicDetail(ids) {
      if (this.isMore == false) return;
      this.scrollLoadDisabled = true;

      let res = await this.$http("/song/detail", { ids });
      // 处理时间
      res.data.songs.forEach((item, index) => {
        res.data.songs[index].dt = handleMusicTime(item.dt);
      });
      console.log(res.data);
      this.songListInfo.tracks.push(...res.data.songs);
      // 判断是否还有更多音乐
      if (this.songListInfo.tracks.length < this.songListInfo.trackIds.length) {
        this.isMore = true;
        this.scrollLoadDisabled = false;
      } else {
        this.isMore = false;
      }
    },
    // 点击加载所有音乐的回调
    loadMore() {
      if (!this.$store.state.isLogin) {
        this.$message.error("请先进行登录操作!");
        return;
      }
      if (this.isMore) {
        let arr = this.songListInfo.trackIds.slice(
          this.songListInfo.tracks.length
        );
        if (arr.length > 100) {
          arr = arr.slice(0, 100);
        }
        // console.log(arr.length);
        let ids = "";
        arr.forEach((item) => {
          ids += item.id + ",";
        });
        ids = ids.substr(0, ids.length - 1);
        // console.log(ids);
        this.getMusicDetail(ids);
        this.getLikeMusicList();
      }
    },
    // 歌手的点击事件
    singerClick(id) {
      this.$router.push({ name: "singerDetail", params: { id } });
    },
    // 专辑的点击事件
    albumClick(id) {
      this.$router.push({ name: "album", params: { id } });
    },
    // 改变评论页
    commentPageChange(page) {
      this.currentCommentPage = page;
      this.getMusicListComment("changePage");
    },
    // 收藏者列表触底的回调
    bottomLoad() {
      this.followedsListData.currentPage += 1;
      this.getMusicListFolloweds();
    },
    handleDOM(current, last) {
      if (document.querySelector(".SongListContainer")) {
        let tableRows = document
          .querySelector(".SongListContainer")
          .querySelectorAll(".el-table__row");
        // 遍历当前musicList 找到当前播放的index的行进行渲染
        // console.log(tableRows);
        let index = this.songListInfo.tracks.findIndex(
          (item) => item.id == current
        );
        // console.log(index);
        if (index != -1) {
          // 直接修改dom样式的颜色无效  可能是因为第三方组件的原故
          // 通过引入全局样式解决
          // 将正在播放的音乐前面的索引换成小喇叭
          tableRows[index].children[0].querySelector(
            ".cell"
          ).innerHTML = `<div><i class="iconfont icon-icon-yinliangzhong"></i></div>`;
          tableRows[index].children[0]
            .querySelector(".iconfont")
            .classList.add("currentRow");
          tableRows[index].children[2]
            .querySelector(".cell")
            .classList.add("currentRow");
        }
        // 清除上一首的样式
        if (last != -1) {
          let lastIndex = this.songListInfo.tracks.findIndex(
            (item) => item.id == last
          );
          if (lastIndex != -1) {
            // 将上一个播放的dom的小喇叭换回索引
            tableRows[lastIndex].children[0].querySelector(
              ".cell"
            ).innerHTML = `<div>${
              lastIndex + 1 < 10 ? "0" + (lastIndex + 1) : lastIndex + 1
            }</div>`;

            // 将上一首的类名删掉  小喇叭的html已经被替换了，不需要再还原
            tableRows[lastIndex].children[2]
              .querySelector(".cell")
              .classList.remove("currentRow");
          }
        }
      }
    },
    // 获取喜欢音乐列表
    async getLikeMusicList() {
      // 获取时间戳
      var timestamp = Date.parse(new Date());
      // 因为喜欢音乐列表实时性较高，为了避免接口缓存，在请求后面加上一个时间戳
      let res = await this.$http("/likelist", {
        uid: window.localStorage.getItem("userId"),
        timestamp,
      });
      this.likeMuiscList = res.data.ids;
      let tableRows = document
        .querySelector(".SongListContainer")
        .querySelectorAll(".el-table__row");
      // 找到在这个歌单里我喜欢的歌曲
      let likeList = this.songListInfo.tracks.filter((item) => {
        for (let index = 0; index < this.likeMuiscList.length; index++) {
          if (item.id == this.likeMuiscList[index]) {
            return item.id == this.likeMuiscList[index];
          }
        }
      });
      // console.log(likeList);
      // 找到我喜欢的歌曲在这个歌单里的索引值
      for (let i = 0; i < likeList.length; i++) {
        const element = likeList[i].id;
        let index2 = this.songListInfo.tracks.findIndex((item) => {
          if (item.id == element) {
            return item.id == element;
          }
        });
        if (document.querySelector(".SongListContainer")) {
          if (index2 != -1) {
            tableRows[index2].children[1]
              .querySelector(".iconfont")
              .classList.add("currentRow");
          }
        }
      }
      // 将喜欢列表提交到vuex 供歌单中显示喜欢使用 （因为性能问题暂时没做）
      // this.$store.commit("updataLikeMuiscList", this.likeMuiscList);
    },
    // 用户点击喜欢该音乐的回调
    async likeIt(id, index) {
      let tableRows = document
        .querySelector(".SongListContainer")
        .querySelectorAll(".el-table__row");
      let element = tableRows[index].children[1].querySelector(".iconfont");
      if (element.classList.contains("currentRow")) {
        let res = await this.$http("/like", { id, like: false });
        if (!res.data) {
          this.$message.error("服务器繁忙");
          return;
        }
        if (res.data.code == 200) {
          element.classList.remove("currentRow");
          console.log("取消喜欢操作成功");
          this.$store.commit("updataLikeMuiscList", this.likeMuiscList);
        } else {
          console.log("取消喜欢操作失败");
        }
      } else {
        let res = await this.$http("/like", { id, like: true });
        if (res.data.code == 200) {
          element.classList.add("currentRow");
          console.log("喜欢操作成功");
          this.$store.commit("updataLikeMuiscList", this.likeMuiscList);
        } else {
          console.log("喜欢操作失败");
        }
      }
    },
    // 点击底部的喜欢或者取消喜欢同时改变列表的状态
    changeLikeStatus(current) {
      let tableRows = document
        .querySelector(".SongListContainer")
        .querySelectorAll(".el-table__row");
      console.log("current" + current);
      if (current) {
        tableRows[this.$store.state.currentIndex].children[1]
          .querySelector(".iconfont")
          .classList.add("currentRow");
      }
      if (!current) {
        tableRows[this.$store.state.currentIndex].children[1]
          .querySelector(".iconfont")
          .classList.remove("currentRow");
      }
      // else {
      //   if (
      //     tableRows[this.$store.state.currentIndex].children[1]
      //       .querySelector(".iconfont")
      //       .classList.contains("currentRow")
      //   ) {
      //     tableRows[this.$store.state.currentIndex].children[1]
      //       .querySelector(".iconfont")
      //       .classList.remove("currentRow");
      //   } else {
      //     tableRows[this.$store.state.currentIndex].children[1]
      //       .querySelector(".iconfont")
      //       .classList.add("currentRow");
      //   }
      // }
    },
  },
  watch: {
    "$store.state.musicId"(current, last) {
      this.handleDOM(current, last);
    },
    // 监听createdMusicList的变化
    "$store.state.createdMusicList"(current, last) {
      // 如果在收藏页面刷新，收藏歌单还没获取到，但是收藏按钮已经渲染了，所以在第一次获取到数据时，再渲染一次
      // 如果是刚刷新，last则为空
      if (last.length == 0) {
        this.getIsSub();
      }
    },
    "$store.state.isLogin"(current) {
      if (current) {
        this.getLikeMusicList();
      } else {
        // 清空喜欢列表
        this.likeMuiscList = [];
      }
    },
    "$store.state.isChangeCurrentLike"(current, last) {
      this.changeLikeStatus(current);
    },
  },
  created() {},
  async mounted() {
    await this.getSongListDetail();
    if (this.$store.state.isLogin) {
      // 先判断是否是用户创建的歌单
      this.getIsCreated();
      this.getLikeMusicList();
      // 如果不是 再判断是否是收藏的歌单
      if (!this.isCreated) {
        this.getIsSub();
      }
    }
    this.$nextTick(() => {
      // 判断是否和上一次打开的歌单相同
      if (this.$route.params.id == this.$store.state.musicListId) {
        this.handleDOM(this.$store.state.musicId);
      }
    });
  },
};
</script>
<style lang="less"  scoped>
.SongListContainer {
  padding: 30px;
  // overflow-y: scroll;
}
.listInfo {
  display: flex;
  padding: 25px 15px;
  align-items: center;
}

.listAvatar {
  display: inline-block;
  width: 180px;
  height: 180px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 15px;
  position: relative;
}

.listAvatar::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: url("~assets/images/imgLoading.png") no-repeat;
  background-size: contain;
  z-index: -1;
}

.listAvatar img {
  width: 100%;
}

.right {
  display: inline-block;
  width: calc(100% - 200px);
}

.title {
  display: flex;
  align-items: center;
}

.titleTag {
  font-size: 12px;
  color: #ec4141;
  border: 1px solid #ec4141;
  padding: 1px 2px;
  border-radius: 2px;
  margin-right: 5px;
  // transform: scale(0.8);
}

.titleContent {
  font-size: 20px;
  font-weight: 600;
  color: #373737;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
}

.user {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.userAvatar {
  height: 25px;
  width: 25px;
  margin-right: 8px;
}

.userAvatar img {
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
}

.userName {
  color: #6191c2;
  margin-right: 8px;
  cursor: pointer;
}

.createTime {
  transform: scale(0.9);
}

.buttons {
  margin: 8px 0 8px -5px;
  display: flex;
}

.buttonItem {
  font-size: 12px;
  padding: 8px 15px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  // transform: scale(0.9);
  cursor: pointer;
}

.buttonItem i {
  font-size: 12px;
  margin-right: 3px;
  // transform: scale(0.9);
}

.playAll {
  background-color: #ec4141;
  color: white;
}

.tags {
  // margin: 8px 0 0 -30px;
  display: flex;
  font-size: 12px;
  line-height: 20px;
  // transform: scale(0.9);
}

.tagItem {
  color: #6191c2;
  margin-right: 5px;
}

.otherInfo {
  // margin: 5px 0 0 -30px;
  display: flex;
  font-size: 12px;
  line-height: 20px;
  // transform: scale(0.9);
}

.musicNum {
  margin-right: 13px;
}

.desc {
  // margin: 5px 0 0 -30px;
  font-size: 12px;
  line-height: 20px;
  // transform: scale(0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.red {
  color: #ec4141;
}

/deep/ .el-table tr {
  cursor: pointer;
}
</style>