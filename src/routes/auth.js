import AuthLayout from '@/components/auth/authLayout.vue'

export default [
    {
        path: '/',
        component: AuthLayout,
        children: [
            {
                path: '', name: 'landingPage',
                component: () => import('@/components/auth/homePage.vue')
            }
        ]
    },
    {
        path: '/signin',
        component: AuthLayout,
        children: [
            {
                path: '', name: 'signIn',
                component: () => import('@/components/auth/signIn.vue')
            }
        ]
    },
    {
        path: '/signup',
        component: AuthLayout,
        children: [
            {
                path: '', name: 'signUp',
                component: () => import('@/components/auth/signUp.vue')
            }
        ]
    }
]