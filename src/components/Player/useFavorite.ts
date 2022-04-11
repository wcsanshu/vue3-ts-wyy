import { useUserStoreWithOut } from "@/store/store"
import { storeToRefs } from "pinia"
import { save, remove } from "@/hooks/useArrayStore"
import { FAVORITE_KEY } from "@/assets/js/constant"

export default function useFavorite() {
  const { favoriteList } = storeToRefs(useUserStoreWithOut())
  const { Setfavorite } = useUserStoreWithOut()
  // 用户点击收藏按钮触发事件
  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      // 如果点击歌曲已经存在当前的收藏列表则移除
      list = remove(FAVORITE_KEY, compare)
    } else {
      // 如果点击歌曲没有存在当前收藏列表则添加
      list = save(song, FAVORITE_KEY, compare)
    }
    Setfavorite(list)
    function compare(item) {
      return item.id === song.id
    }
  }

  // 收藏 和 未收藏 按钮切换
  function getFavoriteIcon(song) {
    return isFavorite(song) ? "icon-favorite" : "icon-not-favorite"
  }

  // 通过id判断收藏列表里是否有当前歌单的歌曲
  function isFavorite(song) {
    // 通过已收藏歌曲id 去 当前歌单id里查找,非-1视为存在 代表已收藏
    return (
      favoriteList.value.findIndex((item: any) => {
        return song.id === item.id
      }) > -1
    )
  }
  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
