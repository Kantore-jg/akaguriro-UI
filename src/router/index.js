import { createRouter, createWebHistory } from 'vue-router';
import { getStoredUser } from '../api/services/auth.js';
import { getToken } from '../api/client.js';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN_MARCHE', 'COMMERCANT'];

const routes = [
  {
    path: '/led',
    name: 'LED',
    component: () => import('../components/LedPage.vue'),
    meta: { public: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/LoginPage.vue'),
    meta: { public: true, standalone: true, authMode: 'login' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../components/LoginPage.vue'),
    meta: { public: true, standalone: true, authMode: 'register' },
  },
  {
    path: '/auth',
    redirect: '/login',
  },
  {
    path: '/admin',
    component: () => import('../app/components/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('../app/components/pages/admin/DashboardPage.vue'),
        meta: { title: 'Tableau de bord' },
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../app/components/pages/admin/UsersPage.vue'),
        meta: { title: 'Utilisateurs', roles: ['SUPER_ADMIN', 'ADMIN_MARCHE'] },
      },
      {
        path: 'markets',
        name: 'AdminMarkets',
        component: () => import('../app/components/pages/admin/MarketsPage.vue'),
        meta: { title: 'Marchés', roles: ['SUPER_ADMIN'] },
      },
      {
        path: 'places',
        name: 'AdminPlaces',
        component: () => import('../app/components/pages/admin/PlacesPage.vue'),
        meta: { title: 'Emplacements', roles: ['SUPER_ADMIN', 'ADMIN_MARCHE'] },
      },
      {
        path: 'merchants',
        name: 'AdminMerchants',
        component: () => import('../app/components/pages/admin/MerchantsPage.vue'),
        meta: { title: 'Commerçants', roles: ['SUPER_ADMIN', 'ADMIN_MARCHE'] },
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('../app/components/pages/admin/ProductsPage.vue'),
        meta: { title: 'Produits' },
      },
      {
        path: 'requests',
        name: 'AdminRequests',
        component: () => import('../app/components/pages/admin/RequestsPage.vue'),
        meta: { title: 'Demandes', roles: ['SUPER_ADMIN', 'ADMIN_MARCHE'] },
      },
      {
        path: 'receipts',
        name: 'AdminReceipts',
        component: () => import('../app/components/pages/admin/ReceiptsPage.vue'),
        meta: { title: 'Reçus' },
      },
      {
        path: 'prints',
        name: 'AdminPrints',
        component: () => import('../app/components/print/PrintReportsPage.vue'),
        meta: { title: 'Impressions', roles: ['SUPER_ADMIN', 'ADMIN_MARCHE', 'COMMERCANT'] },
      },
    ],
  },
  {
    path: '/admin/print',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'merchants',
        name: 'PrintMerchants',
        component: () => import('../app/components/print/PrintMerchantsPage.vue'),
        meta: { title: 'Impression commerçants', roles: ['SUPER_ADMIN', 'ADMIN_MARCHE'] },
      },
      {
        path: 'places',
        name: 'PrintPlaces',
        component: () => import('../app/components/print/PrintPlacesPage.vue'),
        meta: { title: 'Impression emplacements', roles: ['SUPER_ADMIN', 'ADMIN_MARCHE'] },
      },
      {
        path: 'products',
        name: 'PrintProducts',
        component: () => import('../app/components/print/PrintProductsPage.vue'),
        meta: { title: 'Impression produits' },
      },
    ],
  },
  {
    path: '/',
    component: () => import('../components/PublicApp.vue'),
    meta: { public: true },
    children: [
      { path: '', name: 'Home', meta: { tab: 'home' } },
      { path: 'markets', name: 'Markets', meta: { tab: 'markets' } },
      { path: 'markets/:marketId', name: 'MarketDetail', meta: { tab: 'markets' } },
      { path: 'products', name: 'Products', meta: { tab: 'products' } },
      { path: 'products/:productId', name: 'ProductDetail', meta: { tab: 'products' } },
      { path: 'merchants', name: 'Merchants', meta: { tab: 'merchants' } },
      { path: 'request', name: 'Request', meta: { tab: 'request' } },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../components/ProfilePage.vue'),
        meta: { requiresToken: true, tab: 'profile' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = getStoredUser();
  const role = user?.role;
  const hasToken = Boolean(getToken());

  if ((to.name === 'Login' || to.name === 'Register') && hasToken && user?.id) {
    next({ path: '/' });
    return;
  }

  if (to.matched.some((r) => r.meta.requiresToken)) {
    if (!hasToken || !user?.id) {
      next({ path: '/login', query: { redirect: to.fullPath } });
      return;
    }
  }

  if (to.matched.some((r) => r.meta.requiresAuth)) {
    if (!hasToken || !role || !ADMIN_ROLES.includes(role)) {
      next({ path: '/login' });
      return;
    }

    const restricted = to.matched.find((r) => r.meta.roles);
    if (restricted?.meta.roles && !restricted.meta.roles.includes(role)) {
      next({ name: 'AdminDashboard' });
      return;
    }
  }

  if (to.path.startsWith('/admin') && role && !ADMIN_ROLES.includes(role)) {
    next(user?.id ? { name: 'Profile' } : { path: '/login' });
    return;
  }

  next();
});

export default router;