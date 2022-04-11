// 打成我们想要的格式
import { SingerType } from "@/types"
import { pinyin } from "pinyin-pro"

// data 源数据
const Filtration = (data: SingerType[]) => {
  // 构造歌手 Map 数据结构
  const singerMap = {
    // 首先构造一条 热门 歌手数据
    hot: {
      title: "热",
      // 截取前5条数据视为热门歌手
      list: map(data.slice(0, 5))
    }
  }

  // 开始循环处理
  data.forEach((item) => {
    const p = pinyin(item.name)
    // 取到名字首字母大写
    const key = p[0][0].slice(0, 1).toLocaleUpperCase()
    // 如果没有key 则创建一个对象结构
    // 这一步是关键
    if (!singerMap[key]) {
      // 使用当前key作为键 (key为首字母大写)
      singerMap[key] = {
        title: key, // 然后这里title也是key
        list: [] // list 暂时为空
      }
    }
    // 然后直接往list 添加 首项数据(也就是当前歌手数据) 使用map把数据过滤成我们想要的
    singerMap[key].list.push(map([item])[0])

    // 到这里我们符合格式的对象就构建好了
    // 但我们需要一个有序的数组,而不是对象所以继续操作
  })

  // 热门歌手
  const hot: any = []
  // 字母歌手
  const letter: any = []

  // 遍历上方构建好的对象,让结构有序
  for (const key in singerMap) {
    const item = singerMap[key]
    // 如果title 是A-Z 就(因为title有可能是hot而不是A-Z其中一个)
    if (item.title.match(/[a-zA-Z]/)) {
      letter.push(item)
      // 如果title是 热
    } else if (item.title === "热") {
      // 则push到hot数组里
      hot.push(item)
    }
  }
  // 按字母顺序排序 这样A-Z 会有序
  letter.sort((a, b) => {
    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
  })

  const result = {
    // hot.concat() 把hot放在第一个
    // concat() 方法用于连接两个或多个数组。
    // concat() 方法不会更改现有数组，而是返回一个新数组，其中包含已连接数组的值。
    singers: hot.concat(letter)
  }

  return result.singers
}

// 做一层数据映射，构造单个 singer 数据结构
function map(singerList) {
  return singerList.map((item) => {
    return {
      id: item.id,
      name: item.name,
      pic: item.img1v1Url.replace("150x150", "800x800")
      // .replace(/\.jpg$/, ".png")
      // .replace("150x150", "800x800")
    }
  })
}

export default Filtration
