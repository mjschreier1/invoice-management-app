<template>
  <div id="updateInvoiceComponent">
    <form>
      <div class="label-input-pair">
        <label
          for="invoiceIdToModify"
          class="block"
        >Number of Invoice to Modify</label>
        <input
          type="number"
          class="five-digit block"
          v-model="number"
        >
      </div>
      <div class="label-input-pair">
        <button
          @click.prevent="loadInvoice()"
          class="formValid"
          id="loadInvoice"
        >Load Invoice</button>
      </div>
      <p
        v-if="error"
        class="block error"
      >{{ errorMessage || `Could not find invoice ${number}.` }}</p>
    </form>
    <div
      id="invoiceForm"
      v-if="loadInvoiceForm"
    >
      <form>
        <div class="label-input-pair">
          <div class="align-left">
            <label
              for="invoiceNumber"
              class="block"
            >Invoice Number</label>
            <p
              id="invoiceNote"
              class="block"
            >(note: invoice numbers cannot be changed)</p>
          </div>
          <div class="align-right">
            <input
              type="number"
              v-model="number"
              class="five-digit block"
              name="invoiceNumber"
              disabled
            />
            <p
              v-if="error"
              class="block error"
            >{{ errorMessage }}</p>
          </div>
        </div>
        <div class="label-input-pair">
          <label
            for="name"
            class="block"
          >Last Name or Organization Name</label>
          <input
            type="text"
            class="block"
            v-model="name"
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
              @change="formatIssueMonth()"
              :class="{ invalidEntry: invalidateIssueMonth }"
            />
            <p>/</p>
            <input
              type="number"
              min="1"
              max="31"
              name="issueDate"
              class="two-digit"
              v-model="issueDate"
              @change="formatIssueDate()"
              :class="{ invalidEntry: invalidateIssueDate }"
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
              @change="formatPaidMonth()"
            />
            <p>/</p>
            <input
              type="number"
              min="1"
              max="31"
              name="paidDate"
              class="two-digit"
              v-model="paidDate"
              @change="formatPaidDate()"
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
        <div class="label-input-pair">
          <button
            @click.prevent="submitForm()"
            :disabled="!number || error || invalidateIssueMonth || invalidateIssueDate || invalidatePaidMonth || invalidatePaidDate || !amountDue || disableButton"
            :class="{ formValid: number && !error && !invalidateIssueMonth && !invalidateIssueDate && !invalidatePaidMonth && !invalidatePaidDate && amountDue && !disableButton }"
          >Create Invoice</button>
        </div>
      </form>
      <p
        v-if="successMessage"
        class="responseMessage"
      >{{ successMessage.message }}</p>
      <p
        v-if="failureMessage"
        class="responseMessage"
      >{{ failureMessage.error.message }}</p>
      <div class="label-input-pair">
        <button
          v-if="successMessage || failureMessage"
          class="formValid"
          @click="refreshForm()"
        >{{ successMessage ? "Create Another Invoice" : "Try Again" }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdateInvoice",
  data () {
    return {
      loadInvoiceForm: false,
      error: "",
      errorMessage: "",

      number: "",
      name: "",
      issueMonth: "",
      invalidateIssueMonth: "",
      issueDate: "",
      invalidateIssueDate: "",
      issueYear: "",
      paid: "",
      paidMonth: "",
      invalidatePaidMonth: "",
      paidDate: "",
      invalidatePaidDate: "",
      paidYear: "",
      amountDue: "",
      convenienceFee: "",
      totalWithFee: "",
      disableButton: "",
      successMessage: "",
      failureMessage: "",
      balance: "",
    }
  },

  methods: {
    loadInvoice() {
      this.error = false;

      return fetch(`http://localhost:3000/get-invoice/${this.number}`)
        .then(res => {
          if(res.status < 400) {
            return res.json()
          } else {
            return res.json()
              .then(err => {throw err})
          }
        })
        .then(json => {
          let issued = json.issued.split("-");
          let paid = json.paid.split("-");

          this.name = json.name;
          this.issueYear = issued[0];
          this.issueMonth = issued[1];
          this.issueDate = issued[2].slice(0, 2);
          this.paidYear = paid[0];
          this.paidMonth = paid[1];
          this.paidDate = paid[2].slice(0, 2);
          if(this.paidYear && this.paidMonth && this.paidDate) {this.paid = true};
          this.amountDue = json.amount_due;
          this.balance = json.balance;
          this.convenienceFee = json.convenience_fee_if_cc;
          this.totalWithFee = json.grand_total_if_cc;
        })
        .then(() => {
          this.loadInvoiceForm = true;
        })
        .catch(err => {
          this.error = true;
          this.errorMessage = err.error.message;
          console.log(err)
        })
    },
    formatIssueMonth() {
      if(this.issueMonth < 10 && (!this.issueMonth.toString().includes("0") || this.issueMonth.toString().length > 2)) {
        this.issueMonth = `0${parseInt(this.issueMonth)}`;
      };
      if(this.issueMonth < 1 || this.issueMonth > 12) {
        this.invalidateIssueMonth = true;
      } else {
        this.invalidateIssueMonth = false;
      };
      if((this.issueMonth == 2 && this.issueYear % 4 == 0 && this.issueDate > 29)
        || (this.issueMonth == 2 && this.issueYear % 4 != 0 && this.issueDate > 28)
        || ((this.issueMonth == 3 || this.issueMonth == 4 || this.issueMonth == 6 || this.issueMonth == 9 || this.issueMonth == 11) && this.issueDate > 30)) {
        this.invalidateIssueDate = true;
      } else {
        this.invalidateIssueDate = false;
      };
    },
    formatPaidMonth() {
      if(this.issueMonth < 10 && (!this.issueMonth.toString().includes("0") || this.issueMonth.toString().length > 2)) {
        this.issueMonth = `0${parseInt(this.issueMonth)}`;
      };
      if(this.paidMonth < 1 || this.paidMonth > 12) {
        this.invalidatePaidMonth = true;
      } else {
        this.invalidatePaidMonth = false;
      };
      if((this.issueMonth == 2 && this.issueYear % 4 == 0 && this.issueDate > 29)
        || (this.issueMonth == 2 && this.issueYear % 4 != 0 && this.issueDate > 28)
        || ((this.issueMonth == 3 || this.issueMonth == 4 || this.issueMonth == 6 || this.issueMonth == 9 || this.issueMonth == 11) && this.issueDate > 30)) {
        this.invalidateIssueDate = true;
      } else {
        this.invalidateIssueDate = false;
      };
    },
    formatIssueDate() {
      if(this.issueDate < 10) {
        this.issueDate = `0${this.issueDate}`;
      };
      if(this.issueDate < 1
        || this.issueDate > 31
        || (this.issueMonth === 2 && this.issueYear % 4 === 0 && this.issueDate > 29)
        || (this.issueMonth === 2 && this.issueYear % 4 !== 0 && this.issueDate > 28)
        || ((this.issueMonth === 3 || this.issueMonth === 4 || this.issueMonth === 6 || this.issueMonth === 9 || this.issueMonth === 11) && this.issueDate > 30)) {
        this.invalidateIssueDate = true;
      } else {
        this.invalidateIssueDate = false;
      };
    },
    formatPaidDate() {
      if(this.paidDate < 10) {
        this.paidDate = `0${this.paidDate}`;
      };
      if(this.paidDate < 1
        || this.paidDate > 31
        || (this.paidMonth === 2 && this.paidYear % 4 === 0 && this.paidDate > 29)
        || (this.paidMonth === 2 && this.paidYear % 4 !== 0 && this.paidDate > 28)
        || ((this.paidMonth === 3 || this.paidMonth === 4 || this.paidMonth === 6 || this.paidMonth === 9 || this.paidMonth === 11) && this.paidDate > 30)) {
        this.invalidatePaidDate = true;
      } else {
        this.invalidatePaidDate = false;
      };
    },
    togglePaid() {
      this.paid = !this.paid;
    },
    formatAmountDue() {
      this.amountDue = parseFloat(this.amountDue).toFixed(2);
      this.totalWithFee = (this.amountDue / 0.971 + 0.3).toFixed(2);
      this.convenienceFee = (this.totalWithFee - this.amountDue).toFixed(2);
    },
    submitForm() {
      this.disableButton = true;
      return fetch("http://localhost:3000/new-invoice", {
        method: "POST",
        body: JSON.stringify({
          invoiceId: this.number,
          name: this.name,
          issued: `${this.issueYear}-${this.issueMonth}-${this.issueDate}`,
          paid: this.paid ? `${this.paidYear}-${this.paidMonth}-${this.paidDate}` : "",
          amount_due: this.amountDue,
          convenience_fee_if_cc: this.convenienceFee,
          grand_total_if_cc: this.totalWithFee,
          balance: this.paid ? 0 : this.amountDue
        }),
        headers: new Headers({
          "content-type": "application/json"
        })
      })
        .then(res => {
          if(res.status < 400) {
            return res.json()
          } else {
            return res.json()
              .then(error => {throw error})
          }
        })
        .then(json => {
          this.successMessage = json;
        })
        .catch(err => {
          this.failureMessage = err;
        })
    },
    refreshForm() {
      this.number = "";
      this.error = false,
      this.errorMessage = "";
      this.name = "";
      this.issueMonth = new Date().getMonth() + 1;
      this.invalidateIssueMonth = false;
      this.issueDate = new Date().getDate();
      this.invalidateIssueDate = false;
      this.issueYear = new Date().getFullYear();
      this.paid = false;
      this.paidMonth = new Date().getMonth() + 1;
      this.invalidatePaidMonth = false;
      this.paidDate = new Date().getDate();
      this.invalidatePaidDate = false;
      this.paidYear = new Date().getFullYear();
      this.amountDue = "";
      this.convenienceFee = "";
      this.totalWithFee = "";
      this.disableButton = false;
      this.successMessage = "";
      this.failureMessage = "";

      this.formatIssueMonth();
      this.formatPaidMonth();
      this.formatIssueDate();
      this.formatPaidDate();
      this.getNextInvoiceNumber();
    }
  }
}
</script>

<style scoped>
#updateInvoiceComponent {
  width: 90vw;
  margin: auto;
  border: 2px black solid;
  background-color: #dddddd;
  margin-bottom: 20px;
}
p {
  display: inline;
}
#invoiceNote {
  display: block;
  font-size: 2.5vw;
  margin: 0;
}
label, .responseMessage {
  font-size: 3vw;
}
.responseMessage {
  /* width: 100%; */
  display: block;
  margin: 0;
}
label {
  padding-top: 10px;
}
input {
  height: 3.5vw;
  font-size: 2.5vw;
}
input[type="checkbox"] {
  transform: scale(1.5)
}
button {
  height: 4.5vw;
  font-size: 3vw;
  margin-bottom: 20px;
  background-color: #bbbbbb;
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
.error {
  color: red;
}
.invalidEntry {
  color: red;
  border: solid 2px red;
}
.formValid {
  background-color: #00b26b;
  color: white;
}
.formValid:hover {
  color: #eeeeee;
  background-color: #32a973;
  cursor: pointer;
}
/* #loadInvoice {
  border-bottom: 2px solid black;
} */
@media(max-width: 500px) {
  label, .responseMessage {
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
  button {
    height: 6vw;
    font-size: 4vw;
    margin-top: 20px;
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
  .responseMessage {
    padding: 0 20px
  }
  button {
    width: 100%;
  }
  label {
    padding: 0;
  }
  .align-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .align-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
@media(min-width: 750px) {
  label, .responseMessage {
    font-size: 25px;
  }
  button {
    height: 35px;
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
  .label-input-pair, .responseMessage {
    padding: 0 6.9vw;
  }
}
@media(min-width: 1500px) {
  .label-input-pair, .responseMessage {
    padding: 0 20vw;
  }
}
</style>


