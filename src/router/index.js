import { createRouter, createWebHistory } from 'vue-router';
import authPage from '@/pages/index.vue';
import { auth } from '@/stores/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: authPage,
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
      meta: { requiresAuth: true },
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('../pages/userPortal/userProfile.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/librarian',
      name: 'homepage',
      component: () => import('@/pages/librarian/index.vue'),
      meta: { requiresAuth: true, requiresLibrarian: true },
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
        {
          path: '/student-logs',
          name: 'student-logs',
          component: () => import('@/pages/librarian/UserLogs.vue'),
        },
        {
          path: '/book-logs',
          name: 'book-logs',
          component: () => import('@/pages/librarian/transactions/BookLogs.vue'),
        },
      ],
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/pages/Test.vue'),
    },
  ],
});

// Helper function to get the user role from Firestore
async function getUserRole(userId) {
  const db = getFirestore();
  const userDoc = await getDoc(doc(db, 'accountRoles', userId));
  return userDoc.exists() ? userDoc.data().role : null;
}

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresLibrarian = to.matched.some(record => record.meta.requiresLibrarian);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/');
  } else if (requiresLibrarian) {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const role = await getUserRole(userId);
      if (role === 'librarian') {
        next();
      } else {
        next('/');
      }
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router;
