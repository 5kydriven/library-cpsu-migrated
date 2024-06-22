import { createRouter, createWebHistory } from 'vue-router'
import authPage from '@/pages/index.vue'
import { auth } from '@/stores/firebase';

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
      path: '/user-account',
      name: 'user-account',
      component: () => import('../pages/userPortal/account/userAccountForm.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('../pages/userPortal/userProfile.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/librarian',
      name: 'homepage',
      component: () => import('@/pages/librarian/index.vue'),
      // meta: {requiresAuth: true},
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/pages/librarian/Dashboard.vue'),

        },
        {
          path: '/students-list',
          name: 'students-list',
          component: () => import('@/pages/librarian/StudentList.vue'),
        },
        {
          path: '/books-list',
          name: 'books-list',
          component: () => import('@/pages/librarian/books/BookList.vue'),
        },
        // {
        //   path: '/books-location',
        //   name: 'books-location',
        //   component: () => import('@/pages/librarian/books/BookLocation.vue'),
        // },
        {
          path: '/student-logs',
          name: 'student-logs',
          component: () => import('@/pages/librarian/UserLogs.vue'),
        },
        {
          path: '/return-books',
          name: 'return-books',
          component: () => import('@/pages/librarian/transactions/ReturnedBooks.vue'),
        },
        {
          path: '/borrow-books',
          name: 'borrow-books',
          component: () => import('@/pages/librarian/transactions/BorrowedBooks.vue'),
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

//Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});


export default router
