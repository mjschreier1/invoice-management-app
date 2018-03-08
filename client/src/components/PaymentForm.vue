<template>
  <form>
    <div class="input-wrapper">
      <div class="label-input">
        <label for="invoice-number">Invoice Number:</label>
        <input type="number" v-model="invoiceId"/>
      </div>
      <div class="label-input">
        <label for="name">Last Name or Organization Name:<br><small>(as it appears on invoice)</small></label>
        <input type="text" v-model="name"/>
      </div>
    </div>
    <div class="button-wrapper">
      <button @click.prevent="getInvoice()">Get My Invoice</button>
    </div>
    <p v-if="apiDataExists">Invoice {{ apiData.id }} has a ${{ apiData.amount_due.toFixed(2) }} balance.</p>
    <card class='stripe-card'
      :class='{ complete }'
      stripe='pk_test_IsDBxjcOKJ1omoSw62IVbyzq'
      :options='stripeOptions'
      @change='complete = $event.complete'
    />
    <div class="button-wrapper">
      <button type="submit">Charge Card {{ apiSuccess ? `for $${apiData.amount_due.toFixed(2)}` : "" }}</button>
    </div>
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
            lineHeight: "7.5vw",
            "::placeholder": {
              color: "#aab7c4"
            }
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        }
      },
      invoiceId: "",
      name: "",
      apiDataExists: false,
      apiSuccess: false,
      apiData: "",
    }
  },

  components: { Card },

  methods: {
    getInvoice(invoiceId, name) {
      fetch(`http://localhost:3000/invoice/${this.$data.invoiceId}/${this.$data.name}`)
        .then(res => res.json())
        .then(json => {
          this.$data.apiDataExists = true;
          this.$data.apiData = json;
          if(this.$data.apiData.amount_due) {
            this.$data.apiSuccess = true;
          }
        })
        .then(() => console.log(this.$data.apiData))
    },
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
form {
  width: 70vw;
  margin: auto;
  font-size: 3vw;
  text-align: left;
}
input {
  font-size: 2vw;
  height: 3vw;
}
button {
  width: 70vw;
  height: 5vw;
  margin: 3vw 0;
  background-color: #42b983;
  color: white;
  font-size: 2.5vw;
}
button:hover {
  color: #eeeeee;
  background-color: #32a973;
  cursor: pointer;
}
.button-wrapper {
  width: 70vw;
  margin: auto;
}
.input-wrapper {
  width: 70vw;
  margin: auto;
}
.label-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3vw 0;
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
@media (max-width: 500px) {
  .stripe-card {
    width: 90vw;
    height: 7.5vw;
  }

  .input-wrapper {
    width: 90vw;
  }

  form {
    font-size: 4vw;
    width: 90vw;
  }

  input {
    font-size: 2.25vw;
    height: 3vw;
  }

  button {
    width: 90vw;
  }

  .button-wrapper {
    width: 90vw;
    margin: auto;
  }
}
</style>
