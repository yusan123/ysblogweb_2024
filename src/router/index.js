import Vue from 'vue'
import Router from 'vue-router'
import Blog from '@/components/Blog'
import Tag from '@/components/Tag'
import Contact from '../components/Contact'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Blog',
      component: Blog
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog
    },
    {
      path: '/tag',
      name: 'Tag',
      component: Tag
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
  ]
})
