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
    ],
  },
  {
    path: '/',
    component: () => import('../components/PublicApp.vue'),
    meta: { public: true },
    children: [
      { path: '', name: 'Home', meta: { tab: 'home' } },
      { path: 'markets', name: 'Markets', meta: { tab: 'markets' } },
      { path: 'products', name: 'Products', meta: { tab: 'products' } },
      { path: 'merchants', name: 'Merchants', meta: { tab: 'merchants' } },
      { path: 'auth', name: 'Auth', meta: { tab: 'auth' } },
      { path: 'request', name: 'Request', meta: { tab: 'request' } },
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

  if (to.matched.some((r) => r.meta.requiresAuth)) {
    if (!hasToken || !role || role === 'VISITOR') {
      next({ path: '/auth' });
      return;
    }

    const restricted = to.matched.find((r) => r.meta.roles);
    if (restricted?.meta.roles && !restricted.meta.roles.includes(role)) {
      next({ name: 'AdminDashboard' });
      return;
    }
  }

  if (to.path.startsWith('/admin') && role && ADMIN_ROLES.includes(role)) {
    next();
    return;
  }

  next();
});

export default router;