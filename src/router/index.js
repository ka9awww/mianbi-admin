import { createRouter, createWebHistory } from 'vue-router'
import menu from '../views/menu.vue'
import list from '../views/list.vue'
import homePage from '../views/home-page.vue'
import Canvas from '../views/Canvas.vue'
import canvas1 from '../views/canvas1.vue'
import Note from '../views/Note.vue'
import NoteCreate from '../views/NoteCreate.vue'
import NoteEdit from '../views/NoteEdit.vue'
import NoteDetails from '../views/NoteDetails.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/menu',
      component: menu,
      children: [
        { path: 'list', component: list },
        { path: 'Canvas', component: Canvas },
        { path: 'canvas1', component: canvas1 },
        { path: 'Note', component: Note },
        { path: 'NoteCreate', component: NoteCreate },
        { path: '/Note/:id/NoteEdit', name: 'NoteEdit', component: NoteEdit },
        { path: '/Note/:id', name: 'noteDetails', component: NoteDetails },
      ]
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: homePage,
      meta: { authRequired: false },
    },
  ]
})

router.beforeEach((to, form, next) => {
  if (to.meta.authRequired === false) {
    return next()
  }
  const token = localStorage.getItem('token')
  if (token) {
    return next()
  }
  next('/login')
})

export default router
