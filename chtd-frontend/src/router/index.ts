import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import FindFriendsView from '@/views/FindFriendsView.vue'
import WantsTab from '@/components/dashboard/tabs/WantsTab.vue'
import SettingsTab from '@/components/dashboard/tabs/SettingsTab.vue'
import IdeasTab from '@/components/dashboard/tabs/IdeasTab.vue'
import KidsTab from '@/components/dashboard/tabs/KidsTab.vue'

// Definiujemy typy dla meta danych trasy
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    isGuestOnly?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import("../layouts/DefaultLayout.vue"),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/DashboardView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Dashboard'
      },
      children: [
        {
          path: 'wanted-presents',
          name: 'wanted-presents',
          component: WantsTab,
          props: true,
          alias: ''
        },
        {
          path: 'ideas-for-others',
          name: 'ideas-for-others',
          component: IdeasTab
        },
        {
          path: 'my-children',
          name: 'my-children',
          component: KidsTab
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsTab
        }
      ]
    },
    {
      path: '/find-friends',
      name: 'find-friends',
      component: FindFriendsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { 
        title: '404 - Nie znaleziono'
      }
    }
  ]
})

// Middleware autoryzacji
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  // Sprawdź czy trasa wymaga autoryzacji
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // Zapisz oryginalną trasę do przekierowania po zalogowaniu
    next({ 
      name: 'login', 
      query: { redirect: to.fullPath } 
    })
    return
  }

  // Sprawdź czy trasa jest tylko dla gości (niezalogowanych)
  if (to.meta.isGuestOnly && auth.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  // W pozostałych przypadkach kontynuuj normalnie
  next()
})

// Dodajemy middleware dla tytułów stron
router.afterEach((to) => {
  document.title = to.meta.title 
    ? `${to.meta.title} - ChceToDostać` 
    : 'ChceToDostać'
})

export default router
