import { createRouter, createWebHistory } from 'vue-router'
import authPage from '../pages/auth/authPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: authPage
    },
    {
      path: '/time-in-out',
      name: 'user-log',
      component: () => import('../pages/scanner/StudentsLogs.vue'),
    },
    {
      path: '/borrower-log',
      name: 'borrower-log',
      component: () => import('../pages/scanner/BorrowerLogs.vue'),
    },
    {
      path: '/user-portal',
      name: 'user-portal',
      component: () => import('../pages/userPortal/userAuth/userAuthPage.vue'),
    },
    {
      path: '/user-account',
      name: 'user-account',
      component: () => import('../pages/userPortal/account/userAccountForm.vue'),
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('../pages/userPortal/userProfile.vue'),
    },
    {
      path: '/librarian',
      name: 'homepage',
      component: () => import('../pages/HomeView.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../pages/Dashboard.vue'),
        },
        {
          path: '/students-list',
          name: 'students-list',
          component: () => import('../pages/StudentList.vue'),
        },
        {
          path: '/books-list',
          name: 'books-list',
          component: () => import('../pages/books/BookList.vue'),
        },
        {
          path: '/books-location',
          name: 'books-location',
          component: () => import('../pages/books/BookLocation.vue'),
        },
        {
          path: '/student-logs',
          name: 'student-logs',
          component: () => import('../pages/UserLogs.vue'),
        },
        {
          path: '/return-books',
          name: 'return-books',
          component: () => import('../pages/transactions/ReturnedBooks.vue'),
        },
        {
          path: '/borrow-books',
          name: 'borrow-books',
          component: () => import('../pages/transactions/BorrowedBooks.vue'),
        },
      ],
    },
    {
      path: '/test',
      name: 'test', 
      component: () => import('@/pages/Test.vue')
    }
  ]
})

export default router
