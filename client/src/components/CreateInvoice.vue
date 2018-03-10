<template>
  <div id="createInvoiceComponent">
    <form>
      <div class="label-input-pair">
        <div>
          <label
            for="invoiceNumber"
            class="block"
          >Invoice Number</label>
          <p
            id="invoiceNote"
            class="block"
          >(note: invoice numbers cannot be changed)</p>
        </div>
        <input
          type="number"
          v-model="number"
          class="five-digit block"
          name="invoiceNumber"
          disabled
        />
      </div>
      <div class="label-input-pair">
        <label
          for="name"
          class="block"
        >Last Name or Organization Name</label>
        <input
          type="text"
          class="block"
        />
      </div>
      <div class="label-input-pair">
        <label
          for="issueDate"
          class="block"
        >Issue Date</label>
        <div id="issueDateEntry">
          <input
            type="number"
            min="1"
            max="12"
            name="issueMonth"
            class="two-digit"
            v-model="issueMonth"
            @change="formatMonth()"
          />
          <p>/</p>
          <input
            type="number"
            min="1"
            max="31"
            name="issueDate"
            class="two-digit"
            v-model="issueDate"
            @change="formatDate()"
          />
          <p>/</p>
          <input
            type="number"
            name="issueYear"
            class="four-digit"
            v-model="issueYear"
          />
        </div>
      </div>
      <div class="label-input-pair">
        <label for="paid">Has this invoice already been paid?</label>
        <input
          type="checkbox"
          v-model="paid"
          @click="togglePaid()"
        />
      </div>
      <div
        v-if="paid"
        class="label-input-pair"
      >
        <label for="paidDate">Paid Date</label>
          <div id="paidDateEntry">
          <input
            type="number"
            min="1"
            max="12"
            name="paidMonth"
            class="two-digit"
            v-model="paidMonth"
            @change="formatMonth()"
          />
          <p>/</p>
          <input
            type="number"
            min="1"
            max="31"
            name="paidDate"
            class="two-digit"
            v-model="paidDate"
            @change="formatDate()"
          />
          <p>/</p>
          <input
            type="number"
            name="paidYear"
            class="four-digit"
            v-model="paidYear"
          />
        </div>
      </div>
      <div class="label-input-pair">
        <label
          for="amountDue"
          class="block"
        >Amount Due</label>
        <div class="currency-input">
          <p>$</p>
          <input
            type="number"
            name="amountDue"
            class="eight-digit"
            min="0.01"
            v-model="amountDue"
            @blur="formatAmountDue()"
          />
        </div>
      </div>
      <div class="label-input-pair">
        <label
          for="convenienceFee"
          class="block"
        >Stripe Convenience Fee if Credit Card</label>
        <div class="currency-input">
          <p>$</p>
          <input
            type="number"
            name="convenienceFee"
            class="four-digit"
            v-model="convenienceFee"
            disabled
          />
        </div>
      </div>
      <div class="label-input-pair">
        <label
          for="totalWithFee"
          class="block"
        >Grand Total if Credit Card</label>
        <div class="currency-input">
          <p>$</p>
          <input
            type="number"
            name="totalWithFee"
            class="eight-digit"
            v-model="totalWithFee"
            disabled
          />
        </div>
      </div>
      <button @click.prevent="submitForm()">Create Invoice</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CreateInvoice",
  data () {
    return {
      number: 88888,
      issueMonth: new Date().getMonth() + 1,
      issueDate: new Date().getDate(),
      issueYear: new Date().getFullYear(),
      paid: false,
      paidMonth: new Date().getMonth() + 1,
      paidDate: new Date().getDate(),
      paidYear: new Date().getFullYear(),
      amountDue: "",
      convenienceFee: "",
      totalWithFee: "",
    }
  },

  mounted() {
    this.formatMonth();
    this.formatDate();
  },

  methods: {
    formatMonth() {
      if(this.month < 10) {
        this.month = `0${this.month}`;
      }
    },
    formatDate() {
      if(this.date < 10) {
        this.date = `0${this.date}`;
      }
    },
    togglePaid() {
      this.paid = !this.paid;
    },
    formatAmountDue() {
      this.amountDue = parseFloat(this.amountDue).toFixed(2);
      this.totalWithFee = (this.amountDue / 0.971 + 0.3).toFixed(2);
      this.convenienceFee = (this.totalWithFee - this.amountDue).toFixed(2);
    }

  },

  filters: {
  }
}
</script>

<style scoped>
#createInvoiceComponent {
  width: 90vw;
  /* margin: 20px auto 0; */
  margin: auto;
  border: 2px black solid;
  background-color: #dddddd;
}
form p {
  display: inline;
}
#invoiceNote {
  display: block;
  font-size: 2.5vw;
  margin: 0;
}
label {
  font-size: 3vw;
  padding-top: 10px;
}
input {
  height: 3.5vw;
  font-size: 2.5vw;
}
input[type="checkbox"] {
  transform: scale(1.5)
}
.two-digit {
  width: 3em;
}
.four-digit {
  width: 4em;
}
.five-digit {
  width: 5em;
}
.eight-digit {
  width: 6em;
}
.block {
  display: block;
}
@media(max-width: 500px) {
  label {
    font-size: 4vw;
  }
  #invoiceNote {
    font-size: 3.25vw;
  }
  input {
    height: 4.5vw;
    font-size: 3.25vw;
  }
  input[type="checkbox"] {
    transform: scale(1)
  }
  .block {
    margin: auto;
  }
}
@media(min-width: 501px) {
  .label-input-pair {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-top: 20px;
  }
  label {
    padding: 0;
  }
}
@media(min-width: 750px) {
  label {
    font-size: 25px;
  }
  #invoiceNote {
    font-size: 20px;
  }
  input {
    height: 30px;
    font-size: 20px;
  }
  input[type="checkbox"] {
    transform: scale(1.75)
  }
  .label-input-pair {
    padding: 0 50px;
  }
}
</style>


