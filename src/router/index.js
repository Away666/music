import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import DisCover from '../views/DisCover/DisCover.vue'
import Recommend from '../views/DisCover/children/Recommend.vue'
import SongList from '../views/DisCover/children/SongList.vue'
import Rank from '../views/DisCover/children/Rank.vue'
import Singer from '../views/DisCover/children/Singer.vue'
import SongListDetail from '../views/SongListDetail/SongListDetail.vue'
import SingerDetail from '../views/SingerDetail/SingerDetail.vue'
import Album from '../views/Album/Album.vue'
import VideoDetail from "../views/VideoDeatil/VideoDetail.vue"
import Video from "../views/Video/Video.vue"
import VideoList from "../views/Video/child/VideoList.vue"
import MvList from "../views/Video/child/MvList.vue"
import Favorites from "../views/Favorites/Favorites.vue"
import FavoritesAlbum from "../views/Favorites/child/FavoritesAlbum.vue"
import FavoritesSinger from "../views/Favorites/child/FavoritesSinger.vue"
import FavoritesVideo from "../views/Favorites/child/FavoritesVideo.vue"
import RecommendMusic from "../views/RecommendMusic/RecommendMusic.vue"
import Search from "../views/Search/Search.vue"
import SearchSong from "../views/Search/child/SearchSong.vue"
import SearchSinger from "../views/Search/child/SearchSinger.vue"
import SearchAlbum from "../views/Search/child/SearchAlbum.vue"
import SearchSongList from "../views/Search/child/SearchSongList.vue"
import SearchVideo from "../views/Search/child//SearchVideo.vue"

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'index',
    component: Index,
    redirect: '/discover',
    meta: {
      keepAlive: true
    },
    children: [{
        path: '/discover',
        name: 'discover',
        component: DisCover,
        redirect: '/discover/recommend',
        children: [{
            path: '/discover/recommend',
            name: 'recommend',
            component: Recommend
          },
          {
            path: '/discover/songlist',
            name: 'songlist',
            component: SongList
          },
          {
            path: '/discover/rank',
            name: 'rank',
            component: Rank
          },
          {
            path: '/discover/singer',
            name: 'singer',
            component: Singer
          },
        ]
      },
      {
        path: '/songlistdetail/:id',
        name: 'songListDetail',
        component: SongListDetail,
      },
      {
        path: '/singerdetail/:id',
        name: 'singerDetail',
        component: SingerDetail,
      },
      {
        path: '/album/:id',
        name: 'album',
        component: Album,
      },
      {
        path: '/videodetail/:id/:type',
        name: 'videoDetail',
        component: VideoDetail,
      },
      {
        path: '/video',
        name: "video",
        component: Video,
        redirect: "/video/videolist",
        children: [{
            path: '/video/videolist',
            name: "videoList",
            component: VideoList
          },
          {
            path: '/video/mvlist',
            name: "mvList",
            component: MvList
          },
        ],
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/favorites',
        name: "favorites",
        component: Favorites,
        redirect: "/favorites/album",
        children: [{
            path: '/favorites/album',
            name: "favoritesAlbum",
            component: FavoritesAlbum
          },
          {
            path: '/favorites/singer',
            name: "favoritesSinger",
            component: FavoritesSinger
          },
          {
            path: '/favorites/video',
            name: "favoritesVideo",
            component: FavoritesVideo
          },
        ],
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'recommendmusic',
        name: "recommendMusic",
        component: RecommendMusic
      },
      {
        path: '/search/:id',
        name: 'search',
        component: Search,
        redirect: '/search/searchsong/:id',
        children: [{
            path: '/search/searchsong/:id',
            name: 'searchSong',
            component: SearchSong
          },
          {
            path: '/search/searchsinger/:id',
            name: 'searchSinger',
            component: SearchSinger
          },
          {
            path: '/search/searchalbum/:id',
            name: 'searchAlbum',
            component: SearchAlbum
          },
          {
            path: '/search/searchvideo/:id',
            name: 'searchVideo',
            component: SearchVideo
          },
          {
            path: '/search/searchsonglist/:id',
            name: 'searchSongList',
            component: SearchSongList
          },
        ]
      },
    ]
  },


]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router