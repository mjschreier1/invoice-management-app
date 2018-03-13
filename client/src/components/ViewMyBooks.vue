<template>
  <div id="viewComponent">
    <div class="instructions">
      <p>To search for invoices, fill out ONLY the fields you want the results to match.</p>
      <p>Type "2018" in the "Issue Year" field and "03" in the "Issue Month" field to return all invoices issued in March 2018.</p>
    </div>
    <form>
      <label for="searchType">Search By:</label>
      <select
        name="searchType"
        v-model="searchType"
      ></select>
    </form>
    <form>
      <div class="label-input-pair">
        <label
          for="invoiceId"
          class="block"
        >Invoice Number</label>
        <input
          type="number"
          name="invoiceId"
          class="block five-digit"
          v-model="query.id"
        />
      </div>
      <div class="label-input-pair">
        <label
          for="name"
          class="block"
        >Last Name or Organization Name</label>
        <input
          type="text"
          name="name"
          class="block"
          v-model="query.name"
        />
      </div>
      <div class="label-input-pair">
        <label
          for="issueYear"
          class="block"
        >Year Issued</label>
        <input
          type="number"
          name="issueYear"
          class="block four-digit"
          v-model="query.issueYear"
        />
      </div>
      <div class="label-input-pair">
        <label
          for="issueMonth"
          class="block"
        >Month Issued</label>
        <input
          type="number"
          name="issueMonth"
          class="block two-digit"
          v-model="query.issueMonth"
          @change="formatIssueMonth()"
          @blur="formatIssueMonth()"
          :class="{ invalidEntry: invalidateIssueMonth }"
        />
      </div>
      <div class="label-input-pair">
        <label
          for="issueDate"
          class="block"
        >Date Issued</label>
        <input
          type="number"
          name="issueDate"
          class="block two-digit"
          v-model="query.issueDate"
          @change="formatIssueDate()"
          @blur="formatIssueDate()"
          :class="{ invalidEntry: invalidateIssueDate }"
        />
      </div>
      <div class="label-input-pair">
        <label
          for="paid"
          class="block"
        >Payment Status</label>
        <select
          v-model="query.indicators.paidStatus"
          name="paid"
          class="block"
        >
          <option value="all">Show All Matching Invoices</option>
          <option value="unpaidOnly">Show Unpaid Invoices Only</option>
          <option value="paidOnly">Show Paid Invoices Only</option>
        </select>
      </div>
      <div
        id="paidDate"
        v-if="query.indicators.paidStatus === 'paidOnly'"
      >
        <div class="label-input-pair">
          <label
            for="paidYear"
            class="block"
          >Year Paid</label>
          <input
            type="number"
            name="paidYear"
            class="block four-digit"
            v-model="query.paidYear"
          />
        </div>
        <div class="label-input-pair">
          <label
            for="paidMonth"
            class="block"
          >Month Paid</label>
          <input
            type="number"
            name="paidMonth"
            class="block two-digit"
            v-model="query.paidMonth"
            @change="formatPaidMonth()"
            @blur="formatPaidMonth()"
            :class="{ invalidEntry: invalidatePaidMonth }"
          />
        </div>
        <div class="label-input-pair">
          <label
            for="paidDate"
            class="block"
          >Date Paid</label>
          <input
            type="number"
            name="paidDate"
            class="block two-digit"
            v-model="query.paidDate"
            @change="formatPaidDate()"
            @blur="formatPaidDate()"
            :class="{ invalidEntry: invalidatePaidDate }"
          />
        </div>
      </div>
      <div class="label-input-pair">
        <label
          for="amountDue"
          class="block"
        >Amount Due</label>
        <div class="block flex">
          <select
            name="amountComparison"
            v-model="query.indicators.amountComparison"
          >
            <option value="equal">=</option>
            <option value="greaterThan">&gt;</option>
            <option value="lessThan">&lt;</option>
          </select>
          <input
            type="number"
            name="amountDue"
            class="eight-digit"
            min="0.01"
            v-model="query.amount_due"
          />
        </div>
      </div>
      <div class="label-input-pair">
        <label
          for="balance"
          class="block"
        >Balance</label>
        <div class="block flex">
          <select
            name="balanceComparison"
            v-model="query.indicators.balanceComparison"
          >
            <option value="equal">=</option>
            <option value="greaterThan">&gt;</option>
            <option value="lessThan">&lt;</option>
          </select>
          <input
            type="number"
            name="balance"
            class="eight-digit"
            min="0.01"
            v-model="query.balance"
          />
        </div>
      </div>
      <div class="label-input-pair">
        <button
          :disabled="!query.id && !query.name && !query.issueYear && !query.issueMonth && !query.issueDate && !query.paidYear && !query.paidMonth && !query.paidDate && !query.amount_due && !query.balance"
          :class="{ formValid: query.id || query.name || query.issueYear || query.issueMonth || query.issueDate || query.paidYear || query.paidMonth || query.paidDate || query.amount_due || query.balance }"
          @click.prevent="findInvoices()"
        >Find Invoices</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "ViewMyBooks",
  data () {
    return {
      query: {
        id: "",
        name: "",
        issueYear: "",
        issueMonth: "",
        issueDate: "",
        paidYear: "",
        paidMonth: "",
        paidDate: "",
        amount_due: "",
        balance: "",
        indicators: {
          paidStatus: "all",
          amountComparison: "equal",
          balanceComparison: "equal",
        }
      },
    invalidateIssueMonth: false,
      invalidateIssueDate: false,
      invalidatePaidMonth: false,
      invalidatePaidDate: false,
    }
  },

  methods: {
    findInvoices() {
      let params = Object.keys(this.query).reduce((acc, curr) => {
        if(curr !== "indicators") {
          if(this.query[curr]) {
            if(acc) {
              acc += "&"
            }
            acc += `${curr}=${this.query[curr]}`
          }
        }
        return acc;
      }, "").concat(Object.keys(this.query.indicators).reduce((acc, curr) => {
        if(this.query.amount_due && curr === "amountComparison") {
          acc += `&indicators[amountComparison]=${this.query.indicators[curr]}`
        }
        if(this.query.balance && curr === "balanceComparison") {
          acc += `indicators[balanceComparison]=${this.query.indicators[curr]}`
        }
        return acc;
      }, `&indicators[paidStatus]=${this.query.indicators.paidStatus}`));
      return fetch(`http://localhost:3000/search?${params}`)
        .then(res => res.json())
        .then(json => console.log(json))
    },
    formatIssueMonth() {
      if(this.query.issueMonth === "") {
        this.invalidateIssueMonth = false;
      } else {
        if(this.query.issueMonth == NaN
          || (this.query.issueMonth == 2 && this.query.issueYear % 4 == 0 && this.query.issueDate > 29)
          || (this.query.issueMonth == 2 && this.query.issueYear % 4 != 0 && this.query.issueDate > 28)
          || ((this.query.issueMonth == 3 || this.query.issueMonth == 4 || this.query.issueMonth == 6 || this.query.issueMonth == 9 || this.query.issueMonth == 11) && this.query.issueDate > 30)) {
          this.invalidateIssueMonth = true;
        } else {
          this.invalidateIssueMonth = false;
        };
        if(this.query.issueMonth < 10 && (!this.query.issueMonth.toString().includes("0") && this.query.issueMonth || this.query.issueMonth.toString().length > 2)) {
          this.query.issueMonth = `0${parseInt(this.query.issueMonth)}`;
        };
        if(this.query.issueMonth < 1 || this.query.issueMonth > 12) {
          this.invalidateIssueMonth = true;
        } else {
          this.invalidateIssueMonth = false;
        };
      }
    },
    formatPaidMonth() {
      if(this.query.paidMonth === "") {
        this.invalidatePaidMonth = false;
      } else {
        if(this.query.paidMonth == NaN
          || (this.query.paidMonth == 2 && this.query.paidYear % 4 == 0 && this.query.paidDate > 29)
          || (this.query.paidMonth == 2 && this.query.paidYear % 4 != 0 && this.query.paidDate > 28)
          || ((this.query.paidMonth == 3 || this.query.paidMonth == 4 || this.query.paidMonth == 6 || this.query.paidMonth == 9 || this.query.paidMonth == 11) && this.query.paidDate > 30)) {
          this.invalidatePaidDate = true;
        } else {
          this.invalidatePaidDate = false;
        };
        if(this.query.paidMonth < 10 && (!this.query.paidMonth.toString().includes("0") && this.query.paidMonth || this.query.paidMonth.toString().length > 2)) {
          this.query.paidMonth = `0${parseInt(this.query.paidMonth)}`;
        };
        if(this.query.paidMonth < 1 || this.query.paidMonth > 12) {
          this.invalidatePaidMonth = true;
        } else {
          this.invalidatePaidMonth = false;
        };
      }
    },
    formatIssueDate() {
      if(this.query.issueDate === "") {
        this.invalidateIssueDate = false;
      } else {
        if(this.query.issueDate < 10 && (!this.query.issueDate.toString().includes("0")) && this.query.issueDate || this.query.issueDate.toString().length > 2) {
          this.query.issueDate = `0${this.query.issueDate}`;
        };
        if(this.query.issueDate < 1
          || this.query.issueDate > 31
          || (this.query.issueMonth === 2 && this.query.issueYear % 4 === 0 && this.query.issueDate > 29)
          || (this.query.issueMonth === 2 && this.query.issueYear % 4 !== 0 && this.query.issueDate > 28)
          || ((this.query.issueMonth === 3 || this.query.issueMonth === 4 || this.query.issueMonth === 6 || this.query.issueMonth === 9 || this.query.issueMonth === 11) && this.query.issueDate > 30)) {
          this.invalidateIssueDate = true;
        } else {
          this.invalidateIssueDate = false;
        };
      }
    },
    formatPaidDate() {
      if(this.query.paidDate === "") {
        this.query.invalidatePaidDate = false;
      } else {
        if(this.query.paidDate < 10 && (!this.query.paidDate.toString().includes("0")) && this.query.paidDate || this.query.paidDate.toString().length > 2) {
          this.query.paidDate = `0${this.paidDate}`;
        };
        if(this.query.paidDate < 1
          || this.query.paidDate > 31
          || (this.query.paidMonth === 2 && this.query.paidYear % 4 === 0 && this.query.paidDate > 29)
          || (this.query.paidMonth === 2 && this.query.paidYear % 4 !== 0 && this.query.paidDate > 28)
          || ((this.query.paidMonth === 3 || this.query.paidMonth === 4 || this.query.paidMonth === 6 || this.query.paidMonth === 9 || this.query.paidMonth === 11) && this.query.paidDate > 30)) {
          this.invalidatePaidDate = true;
        } else {
          this.invalidatePaidDate = false;
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
@media(max-width: 500px) {
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
  .instructions {
    font-size: 2.25vw;
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


