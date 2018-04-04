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
    <p v-if="apiDataExists">Invoice {{ apiData.id }} has a ${{ apiData.balance.toFixed(2) }} balance. {{ apiData.balance === 0 ? "Did you mean to look up a different invoice?" : `A credit card payment will include a $${apiData.convenience_fee_if_cc} convenience fee, bringing the grand total to ${apiData.grand_total_if_cc}` }}.</p>
    <p v-if="errorExists">{{ error }}</p>
    <card class="stripe-card"
      ref="card"
      :class="{ complete }"
      stripe="pk_test_IsDBxjcOKJ1omoSw62IVbyzq"
      :options="stripeOptions"
      @change="complete = $event.complete"
      v-if="showCard && !paymentSuccessful"
    />
    <div class="button-wrapper">
      <button
        type="submit"
        :disabled="disablePayment"
        :class="{ hide: disablePayment }"
        @click.prevent="pay()"
      >Charge Card {{ apiSuccess ? `for $${apiData.grand_total_if_cc.toFixed(2)}` : "" }}</button>
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
      showCard: false,
      paymentSuccessful: false,
    }
  },

  components: { Card },

  mounted() {
    window.addEventListener("resize", (event) => {
      if(document.querySelector(".StripeElement").classList.contains("StripeElement--empty")) {
        this.updateCard()
        this.showCard = true;
      }
    });
  },

  methods: {
    getInvoice(invoiceId, name) {
      fetch(`http://localhost:3000/invoice/${this.invoiceId}/${this.name}`)
        .then(res => {
          if(res.status < 400) {
            return res.json()
           } else {
            return res.json()
              .then(error => {throw error})
           }
        })
        .then(json => {
          this.errorExists = false;
          this.apiDataExists = true;
          this.apiData = json;
          if(this.apiData.balance) {
            this.updateCard();
            this.apiSuccess = true;
            this.disableInvoiceLookup = true;
            this.disablePayment = false;
            this.showCard = true;
          }
        })
        .catch(error => {
          this.error = error.error.message || error;
          this.errorExists = true;
        })
    },
    pay () {
      this.disablePayment = true;
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      createToken()
        .then(data => data.token.id)
        .then(token => {
          return fetch(`http://localhost:3000/charge`, {
            method: "POST",
            body: JSON.stringify({
              amount: this.apiData.grand_total_if_cc.toFixed(2),
              balance: this.apiData.amount_due,
              stripeToken: token,
              invoiceId: this.invoiceId,
              name: this.name,
              month: new Date(this.apiData.issued).getUTCMonth() + 1,
              year: new Date(this.apiData.issued).getUTCFullYear()
            }),
            headers: new Headers({
              "Content-Type": "application/json"
            })
          })
        })
        .then(res => res.json())
        .then(json => {
          this.chargeResponse = json;
          this.paymentSuccessful = true;
        })
        .catch(error => {
          this.chargeResponse = error;
        })
    },
    updateCard() {
      this.showCard = false;
      if (window.innerWidth >= 750) {
        this.stripeOptions.style.base.fontSize = "25px";
        this.stripeOptions.style.base.lineHeight = "25px";
        // this.$refs.card.update(this.stripeOptions);
      } else {
        this.stripeOptions.style.base.fontSize = "3vw";
        this.stripeOptions.style.base.lineHeight = "7.5vw";
        // this.$refs.card.update(this.stripeOptions);
      }
      // setTimeout(() => {this.showCard = true}, 1);
      // console.log(this.$refs);
      // this.$refs.card.update()
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
  background-color: #cccccc;
  color: white;
  cursor: default;
}
.button-wrapper {
  width: 70vw;
  margin: auto;
}
.hide {
  display: none;
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
  background-color: red;
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

@media(min-width: 750px) {
  form, label, input, button {
    font-size: 23px;
  }

  input {
    height: 25px;
  }

  form button {
    font-size: 23px;
    height: 35px;
    margin: 10px 0;
  }

  .stripe-card {
    padding: 10px;
    height: 45px;
    box-sizing: border-box;
  }

  .StripeElement {
    height: 31px;
    line-height: 10px;
  }
}
</style>
