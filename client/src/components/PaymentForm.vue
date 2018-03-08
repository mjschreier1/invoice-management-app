<template>
  <form>
    <card class='stripe-card'
      :class='{ complete }'
      stripe='pk_test_IsDBxjcOKJ1omoSw62IVbyzq'
      :options='stripeOptions'
      @change='complete = $event.complete'
    />
  </form>
</template>

<script>
import { Card, createToken } from 'vue-stripe-elements'

export default {
  name: 'PaymentForm',
  data () {
    return {
      complete: false,
      stripeOptions: {
        style: {
          base: {
            color: "#32325d",
            fontSize: "3vw",
            lineHeight: "7.14vw",
            "::placeholder": {
              color: "#aab7c4"
            }
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        }
      }
    }
  },

  components: { Card },

  methods: {
    pay () {
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      createToken().then(data => console.log(data.token))
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.stripe-card {
  width: 70vw;
  height: 5vw;
  border: 2px solid grey;
  margin: auto;
}
.stripe-card.complete {
  border-color: green;
}
.StripeElement {
  height: 5vw;
}
</style>
