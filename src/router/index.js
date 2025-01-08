import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/customer',
            name: 'customer',
            component: () => import('../views/CustomerManagement.vue')
        },
        {
            path: '/data',
            name: 'data',
            component: () => import('../views/DataAnalysis.vue')
        },
        {
            path: '/collection',
            name: 'collection',
            component: () => import('../views/InformationCollection.vue')
        },
        {
            path: '/innovation',
            name: 'innovation',
            component: () => import('../views/BusinessInnovation.vue')
        },
        {
            path: '/maintenance',
            name: 'maintenance',
            component: () => import('../views/InformationMaintenance.vue')
        }
    ]
})

export default router