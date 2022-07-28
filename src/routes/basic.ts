import CompRoute from './comp'

const Layout = () => import('@/layout/index.vue')

export default [
  {
    path: '/',
    name: 'root',
    redirect: '/welcome',
    meta: {
      title: 'Root',
      hide: true
    },
    component: Layout,
    children: [
      {
        path: 'welcome',
        name: '首页',
        meta: {
          title: '首页',
          hide: true
        },
        component: () => import('@/layout/welcome.vue')
      }
    ]
  },
  CompRoute
]
