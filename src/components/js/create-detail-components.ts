import MusicList from "../MusciList/MusicList.vue"
import storage from "good-storage"
import { useRoute } from "vue-router"
import { computed } from "vue"

export default function createDetailComponents(name, key) {
  return {
    name,
    props: {
      // 歌手信息详情
      SingerDetailItem: {
        type: Object,
        required: true
      }
    },
    components: {
      MusicList
    },
    setup(props) {
      const singerSongList = computed(() => props.SingerDetailItem)
      const route = useRoute()
      const computedSinger = computed(() => {
        let res = null
        // 如果有没有props 则 从session 取
        const singer = singerSongList.value

        if (!singer.id) {
          const routeID = +route.params.id
          console.log(routeID)
          console.log("没有", singer)
          const cachedSinger = storage.session.get(key)
          // 取到与当前歌手id相符的session信息
          if (cachedSinger && cachedSinger.id === routeID) {
            res = cachedSinger
          }
        } else {
          // 如果有props 则正常赋值 返回
          res = singer
        }

        return res
      })
      return {
        computedSinger
      }
    }
  }
}
