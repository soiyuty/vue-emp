import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=> import("../views/admin/home.vue"),
    },
    {
      path:'/ima',
      name:'ima',
      component:()=>import("../components/upload/ima.vue")
    }

  ],
})

export default router
