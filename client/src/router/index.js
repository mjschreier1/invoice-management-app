import Vue from 'vue'
import Router from 'vue-router'
import PaymentForm from '@/components/PaymentForm'
import AdminDashboard from '@/components/AdminDashboard'
import CreateInvoice from '@/components/CreateInvoice'
import UpdateInvoice from '@/components/UpdateInvoice'
import ViewMyBooks from '@/components/ViewMyBooks'

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
      component: AdminDashboard,
      children: [{
        path: 'create',
        component: CreateInvoice
      },{
        path: 'update',
        component: UpdateInvoice
      },{
        path: 'books',
        component: ViewMyBooks
      }]
    }
  ]
})
