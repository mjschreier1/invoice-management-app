<template>
  <form>
    <div class="input-wrapper">
      <div class="label-input">
        <label for="invoice-number">Invoice Number:</label>
        <input
          type="number"
          v-model="invoiceId"
          :disabled="disableInvoiceLookup"
          />
      </div>
      <div class="label-input">
        <label for="name">Last Name or Organization Name:<br><small>(as it appears on invoice)</small></label>
        <input
          type="text"
          v-model="name"
          :disabled="disableInvoiceLookup"
        />
      </div>
    </div>
    <div class="button-wrapper">
      <button
        @click.prevent="getInvoice()"
        :disabled="disableInvoiceLookup"
        :class="{ disabledButton: disableInvoiceLookup }"
      >Get My Invoice</button>
    </div>
    <p v-if="apiDataExists">Invoice {{ apiData.id }} has a ${{ apiData.balance.toFixed(2) }} balance. {{ apiData.balance === 0 ? "Did you mean to look up a different invoice?" : "" }}</p>
    <p v-if="errorExists">{{ error }}</p>
    <card class="stripe-card"
      :class="{ complete }"
      stripe="pk_test_IsDBxjcOKJ1omoSw62IVbyzq"
      :options="stripeOptions"
      @change="complete = $event.complete"
    />
    <div class="button-wrapper">
      <button
        type="submit"
        :disabled="disablePayment"
        :class="{ disabledButton: disablePayment }"
        @click.prevent="pay()"
      >Charge Card {{ apiSuccess ? `for $${apiData.balance.toFixed(2)}` : "" }}</button>
    </div>
    <p v-if="chargeResponse">{{ chargeResponse.message }}</p>
    <p v-if="chargeResponse.message === 'Transaction successful!'">Card charged for ${{ chargeResponse.amount }}.</p>
    <p v-if="chargeResponse.message === 'Transaction failed.'">Please confirm that your credit card details were entered correctly. Refresh the page to try again. If the problem persists, confirm that your credit card is not expired and has the credit to process the payment. Click the e-mail icon above to reach Adam regarding any problems.</p>
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
      disablePayment: true,
      disableInvoiceLookup: false,
      errorExists: false,
      error: "",
      chargeResponse: "",
    }
  },

  components: { Card },

  methods: {
    getInvoice(invoiceId, name) {
      fetch(`http://localhost:3000/invoice/${this.$data.invoiceId}/${this.$data.name}`)
        .then(res => {
          if(res.status < 400) {
            return res.json()
           } else {
            return res.json()
              .then(error => {throw error})
           }
        })
        .then(json => {
          this.$data.errorExists = false;
          this.$data.apiDataExists = true;
          this.$data.apiData = json;
          if(this.$data.apiData.balance) {
            this.$data.apiSuccess = true;
            this.$data.disableInvoiceLookup = true;
            this.$data.disablePayment = false;
          }
        })
        .then(() => console.log(this.$data.apiData))
        .catch(error => {
          console.log(error)
          this.$data.error = error.error.message;
          this.$data.errorExists = true;
        })
    },
    pay () {
      this.$data.disablePayment = true;
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      createToken()
        .then(data => {console.log(data.token.id); return data.token.id})
        .then(token => {
          return fetch(`http://localhost:3000/charge`, {
            method: "POST",
            body: JSON.stringify({
              amount: this.$data.apiData.balance.toFixed(2),
              stripeToken: token,
              invoiceId: this.$data.invoiceId,
              name: this.$data.name
            }),
            headers: new Headers({
              "Content-Type": "application/json"
            })
          })
        })
        .then(res => res.json())
        .then(json => {
          this.$data.chargeResponse = json;
        })
        .catch(error => {
          this.$data.chargeResponse = error;
        })
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
.disabledButton, .disabledButton:hover {
  background-color: #dddddd;
  color: white;
  cursor: default;
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
@media (max-width: 535px) {
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
