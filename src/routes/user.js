import Layout from '@/components/user/userLayout.vue'

export default[{
    path: '/user',
    component: Layout,
    children: [
        {
            path: 'home', name: 'home',
            component: () => import('@/components/user/userHome.vue')
        },
        {
            path: 'books', name: 'books',
            component: () => import('@/components/user/userBooks.vue')
        },
        {
            path: 'sections', name: 'sections',
            component: () => import('@/components/user/userSection.vue')
        },
        {
            path: 'history', name: 'history',
            component: () => import('@/components/user/bookLog.vue')
        },
        {
            path: "book/:id", name: 'read_book',
            component: () => import('@/components/user/readBook.vue')
        },
        {
            path: "test", name: 'testingComp',
            component: () => import('@/components/user/testComp.vue')
        },
    ]
}]