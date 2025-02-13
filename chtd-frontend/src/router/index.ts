import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import FindFriendsView from '@/views/FindFriendsView.vue'
import WantedPresentsTab from '@/components/dashboard/tabs/WantedPresentsTab.vue'
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
      name: 'home',
      component: HomeView,
      meta: { 
        isGuestOnly: true,
        title: 'Strona główna'
      }
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
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { 
        isGuestOnly: true,
        title: 'Rejestracja'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { 
        isGuestOnly: true,
        title: 'Logowanie'
      }
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
          path: '',
          redirect: { name: 'wanted-presents' }
        },
        {
          path: 'wanted-presents',
          name: 'wanted-presents',
          component: WantedPresentsTab
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
