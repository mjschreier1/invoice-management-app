import Vue from 'vue'
import Router from 'vue-router'
import PaymentForm from '@/components/PaymentForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PaymentForm',
      component: PaymentForm
    }
  ]
})
