import Vue from 'vue'
import VueRouter from 'vue-router'
// const PageIndex = () => import('../component/page/Index.vue');
const Index = () => import('../components/HelloWorld.vue');
const Page2 = () => import('../components/IndexCalculator.vue');
const Error404 = () => import('../components/Error404.vue');

// import Index from '../components/HelloWorld.vue'
// import Page2 from '../components/IndexCalculator.vue'
// import Error404 from '../components/Error404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/:id',
    name: 'Index',
    component: Index
  },
  {
    path: '/page2',
    name: 'Page2',
    component: Page2
  },
  // {
  //   path: '/user/:type(doctor|normal)',
  //   name: 'Profile',
  //   component: Page2
  // },
  {
    path: '/user/:id',
    name: 'Profile',
    component: Page2,
    // props: true,
  },
  {
    path: '*',
    name: '404',
    component: Error404
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition;
  //   }

  //   if (to.hash) {
  //     return {
  //       selector: to.hash,
  //       offset: { x: 0, y: 100 },
  //     };
  //   }

  //   return { x: 0, y: 0 };
  // },
})

export default router
