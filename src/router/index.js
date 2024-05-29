import { createRouter, createWebHistory } from 'vue-router'
import authPage from '../pages/authPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: authPage
    },
    {
      path: '/librarian',
      name: 'homepage',
      component: () => import('../pages/HomeView.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../pages/Dashboard.vue')
        }
      ],
    }
  ]
})

export default router
