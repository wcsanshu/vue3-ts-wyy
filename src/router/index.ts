import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Recommend from "@/views/Recommend/Recommend.vue"
import Singer from "@/views/Singer/Singer.vue"

import Search from "@/views/Search/Search.vue"
import Ce from "@/views/ceshi/ceshi.vue"
import Toplist from "@/views/Toplist/Toplist.vue"
import SingerDetail from "@/views/SingerDetail/SingerDetail.vue"
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/recommend"
  },
  {
    path: "/recommend",
    name: "recommend",
    component: Recommend
  },
  {
    path: "/singer",
    name: "singer",
    component: Singer,
    children: [
      {
        path: ":id",
        component: SingerDetail
      }
    ]
  },
  {
    path: "/toplist",
    name: "Toplist",
    component: Toplist
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: "/ceshi",
    name: "ceshi",
    component: Ce
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
