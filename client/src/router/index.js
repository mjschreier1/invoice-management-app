import Vue from 'vue'
import Router from 'vue-router'
import PaymentForm from '@/components/PaymentForm'
import AdminDashboard from '@/components/AdminDashboard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PaymentForm',
      component: PaymentForm
    },{
      path: '/dashboard',
      name: 'AdminDashboard',
      component: AdminDashboard
    }
  ]
})
