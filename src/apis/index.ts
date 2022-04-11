import request from "@/utils/request"

// 获取轮播图
export const getBannerAPI = () => request.get("/banner", {})

// 获取热门歌单
export const getHotSongAPI = (limit: number) => {
  return request.get(`/top/playlist?limit=${limit}`)
}

// 获取热门歌手
export const getSingerAPI = (limit = 30) =>
  request.get(`/top/artists?offset=0&limit=${limit}`)

// 获取歌手歌曲
export const getSingerSongAPI = (id: number) => request.get(`/artists?id=${id}`)

// 获取音乐url
export const getSongUrlAPI = (id: number) => request.get(`song/url?id=${id}`)

// 获取排行榜
export const getToplist = () => request.get("/toplist")

// 获取排行榜摘要
export const getToplistAbstract = () => request.get("/toplist/detail")

// 获取歌单详情
export const getPlayListAPI = (id) => request.get(`playlist/detail?id=${id}`)

// 获取热搜列表
export const getSearchHotAPI = () => request.get("/search/hot")

// 搜索
export const getSearchAPI = (query, limit = 20, offset) => {
  return request.get(`/search?keywords=${query}limit=${limit}`)
}
