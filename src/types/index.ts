// 轮播图
export interface BannerType {
  encodeId: string
  exclusive: boolean
  imageUrl: string
  scm: string
  targetId: number
  targetType: 1
  titleColor: string
  typeTitle: string
}

// 热门歌单
export interface PlaylistType {
  id: number
  coverImgUrl: string
  description: string
  name: string
  updateTime: number
  userId: number
}

export interface SingerType {
  id: number
  name: string
  pic: string
}

// 歌手列表
export interface SingerListType {
  list: SingerType[]
  title: string
}

// 歌手歌曲列表
export interface HotSongsType {
  id: number
  name: string
}

// 当前项歌手歌曲列表
export interface SongListType {
  id: number
  name: string
  pic: string
  hotSongs: HotSongsType[]
}
