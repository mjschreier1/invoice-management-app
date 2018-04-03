<template>
  <div id="viewComponent">
    <form>
      <div class="label-input-pair padding-top">
        <label for="searchType">Search By:</label>
        <div class="block">
          <select
            name="searchType"
            v-model="searchType"
            @change="changeQuery()"
          >
            <option value="id">Invoices by Number</option>
            <option value="name">Invoices by Last Name or Organization Name</option>
            <option value="year">Invoices by Year</option>
            <option value="month">Invoices by Year and Month</option>
            <option value="unpaid">Invoices Unpaid</option>
            <option value="annually">Summary by Year</option>
            <option value="monthly">Summary by Year and Month</option>
          </select>
        </div>
      </div>
      <div
        class="label-input-pair"
        v-if="showNumber"
      >
        <label
          for="invoiceId"
          class="block"
        >Invoice Number</label>
        <input
          type="number"
          name="invoiceId"
          class="block five-digit"
          v-model="id"
        />
      </div>
      <div
        class="label-input-pair"
        v-if="showName"
      >
        <label
          for="name"
          class="block"
        >Last Name or Organization Name</label>
        <input
          type="text"
          name="name"
          class="block"
          v-model="name"
        />
      </div>
      <div
        class="label-input-pair"
        v-if="showYear"
      >
        <label
          for="Year"
          class="block"
          v-if="invoiceQuery"
        >Year Issued</label>
        <label
          for="summaryYear"
          class="block"
          v-if="!invoiceQuery"
        >Year</label>
        <input
          type="number"
          name="Year"
          class="block four-digit"
          v-model="Year"
        />
      </div>
      <div
        class="label-input-pair"
        v-if="showMonth"
      >
        <label
          for="Month"
          class="block"
          v-if="invoiceQuery"
        >Month Issued</label>
        <label
          for="summaryMonth"
          class="block"
          v-if="!invoiceQuery"
        >Month</label>
        <input
          type="number"
          name="Month"
          class="block two-digit"
          v-model="Month"
          @change="formatMonth()"
          @blur="formatMonth()"
          :class="{ invalidEntry: invalidateMonth }"
        />
      </div>
      <div class="label-input-pair">
        <button
          :disabled="!formIsValid"
          :class="{ formValid: formIsValid }"
          @click.prevent="findInvoices()"
        >Find Invoices</button>
      </div>
    </form>
    <ul
      id="results"
      v-if="results[0]"
    >
      <li v-for="record of results" :key="record.i">
        <div class="record">
          <div class="label-record-pair">
            <p>Invoice Number:</p>
            <p>{{record.id}}</p>
          </div>
          <div class="label-record-pair">
            <p>Last Name or Organization Name:</p>
            <p>{{record.name}}</p>
          </div>
          <div class="label-record-pair">
            <p>Issued:</p>
            <p>{{record.issued.split("-")[1]}}/{{record.issued.split("-")[2].slice(0, 2)}}/{{record.issued.split("-")[0]}}</p>
          </div>
          <div class="label-record-pair">
            <p>Amount Due:</p>
            <p>${{record.amount_due.toFixed(2)}}</p>
          </div>
          <div class="label-record-pair">
            <p>Stripe Convenience Fee if Credit Card:</p>
            <p>${{record.convenience_fee_if_cc.toFixed(2)}}</p>
          </div>
          <div class="label-record-pair">
            <p>Grand Total if Credit Card:</p>
            <p>${{record.grand_total_if_cc.toFixed(2)}}</p>
          </div>
          <div class="label-record-pair">
            <p>Payment Status:</p>
            <p v-if="record.paid">{{record.paid.split("-")[1]}}/{{record.paid.split("-")[2].slice(0, 2)}}/{{record.paid.split("-")[0]}}</p>
            <p v-if="!record.paid">unpaid</p>
          </div>
          <div class="label-record-pair margin-bottom">
            <p>Balance:</p>
            <p>${{record.balance.toFixed(2)}}</p>
          </div>
        </div>
      </li>
    </ul>
    <p v-if="errorMessage">Whoops, something went wrong!</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="!results[0] && queried && !errorMessage">Could not find any matching records.</p>
  </div>
</template>

<script>
export default {
  name: "ViewMyBooks",
  data () {
    return {
      id: "",
      name: "",
      Year: "",
      Month: "",
      invalidateMonth: false,
      searchType: "id",
      showNumber: true,
      showName: false,
      showYear: false,
      showMonth: false,
      formValid: false,
      results: [],
      errorMessage: "",
      invoiceQuery: true,
      queried: false
    }
  },

  computed: {
    formIsValid() {
      if(this.searchType === "unpaid") { return true }
      if(this.searchType !== "month") { return this.id > 0 || this.name !== "" || this.Year > 0 }
      else { return this.Year > 0 && this.Month > 0 }
    },
  },

  methods: {
    findInvoices() {
      this.errorMessage = "";
      this.results = [];
      return fetch(`http://localhost:3000/search/${this.searchType}/${this.formatQuery()}`)
        .then(res => {
          if(res.status < 400) {
            return res.json()
          } else {
            return res.json()
              .then(err => {throw err})
          }
        })
        .then(json => {
          this.results = json;
          this.queried = true;
        })
        .catch(err => {
          err.error ? this.errorMessage = err.error.message : this.errorMessage = "No additional information available for this error."
        })
    },
    formatQuery() {
      if(this.searchType === "id") { return this.id }
      else if(this.searchType === "name") { return this.name}
      else if(this.searchType === "year") { return this.Year }
      else if(this.searchType === "month") { return `${this.Year}/${this.Month}` }
      else { return "" }
    },
    changeQuery() {
      this.showNumber = false;
      this.showName = false;
      this.showYear = false;
      this.showMonth = false;

      this.name = "";
      this.id = "";
      this.Year = "";
      this.Month = "";

      if(this.searchType === "annually" || this.searchType === "monthly") {
        this.invoiceQuery = false;
        if(this.searchType === "annually") { this.showYear = true };
        if(this.searchType === "monthly") { this.showYear = true; this.showMonth = true };
      } else {
        this.invoiceQuery = true;
        if(this.searchType === "id") { this.showNumber = true };
        if(this.searchType === "name") { this.showName = true };
        if(this.searchType === "year") { this.showYear = true };
        if(this.searchType === "month") { this.showYear = true; this.showMonth = true };
      }

    },
    formatMonth() {
      if(this.Month === "") {
        this.invalidateMonth = false;
      } else {
        if(this.Month < 10 && (!this.Month.toString().includes("0") && this.Month || this.Month.toString().length > 2)) {
          this.Month = `0${parseInt(this.Month)}`;
        };
        if(this.Month < 1 || this.Month > 12) {
          this.invalidateMonth = true;
        } else {
          this.invalidateMonth = false;
        };
      }
    },

  }
}
</script>

<style scoped>
#viewComponent {
  width: 90vw;
  margin: auto;
  border: 2px black solid;
  background-color: #dddddd;
  margin-bottom: 20px;
}
label, .responseMessage {
  font-size: 3vw;
}
.responseMessage {
  /* width: 100%; */
  display: block;
  margin: 0;
}
label, .padding-top {
  padding-top: 10px;
}
input, select {
  height: 3.5vw;
  font-size: 2.5vw;
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
.flex {
  display: flex;
  align-items: center;
}
select {
  padding: 1px;
  border: 1px;
}
.instructions {
  font-size: 3vw;
  margin: auto;
}
ul {
  list-style: none;
  padding: 0;
}
.record {
  background-color: #00b26b;
  border: solid 1px black;
  color: white;
  margin: auto;
  margin-bottom: 10px;
}
p {
  margin: 0;
}
.label-record-pair {
  margin-top: 10px;
}
.margin-bottom {
  margin-bottom: 10px;
}
@media(max-width: 505px) {
  label, .responseMessage {
    font-size: 4vw;
  }
  #invoiceNote {
    font-size: 3.25vw;
  }
  input, select {
    height: 4.5vw;
    font-size: 3.25vw;
  }
  button {
    height: 6vw;
    font-size: 4vw;
    margin-top: 20px;
  }
  .block {
    margin: auto;
    justify-content: center;
  }
  select {
    background-color: white;
  }
  .record {
    width: 90%;
  }
}
@media(min-width: 506px) {
  .label-record-pair {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
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
  .instructions {
    font-size: 2.25vw;
  }
  ul {
    padding: 0 10px;
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
  input, select {
    height: 30px;
    font-size: 20px;
  }
  .label-input-pair, .responseMessage, .instructions {
    padding: 0 6.9vw;
  }
  .instructions {
    font-size: 16px;
  }
  #results {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .label-record-pair {
    width: 28em;
  }
}
@media(min-width: 1500px) {
  .label-input-pair, .responseMessage, .instructions {
    padding: 0 20vw;
  }
  .instructions {
    font-size: 16px;
  }
}
</style>


