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
            <option value="id">Invoice Number</option>
            <option value="name">Last Name or Organization Name</option>
            <option value="year">Year</option>
            <option value="month">Year and Month</option>
            <option value="unpaid">Unpaid Invoices</option>
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
          for="issueYear"
          class="block"
        >Year Issued</label>
        <input
          type="number"
          name="issueYear"
          class="block four-digit"
          v-model="issueYear"
        />
      </div>
      <div
        class="label-input-pair"
        v-if="showMonth"
      >
        <label
          for="issueMonth"
          class="block"
        >Month Issued</label>
        <input
          type="number"
          name="issueMonth"
          class="block two-digit"
          v-model="issueMonth"
          @change="formatIssueMonth()"
          @blur="formatIssueMonth()"
          :class="{ invalidEntry: invalidateIssueMonth }"
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
  </div>
</template>

<script>
export default {
  name: "ViewMyBooks",
  data () {
    return {
      id: "",
      name: "",
      issueYear: "",
      issueMonth: "",
      invalidateIssueMonth: false,
      searchType: "id",
      showNumber: true,
      showName: false,
      showYear: false,
      showMonth: false,
      formValid: false,
    }
  },

  computed: {
    formIsValid() {
      if(this.searchType === "unpaid") { return true }
      if(this.searchType !== "month") { return this.id > 0 || this.name !== "" || this.issueYear > 0 }
      else { return this.issueYear > 0 && this.issueMonth > 0 }
    },
  },

  methods: {
    findInvoices() {
      return fetch(`http://localhost:3000/search/${this.searchType}/${this.formatQuery()}`)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.log(err))
    },
    formatQuery() {
      if(this.searchType === "id") { return this.id }
      else if(this.searchType === "name") { return this.name}
      else if(this.searchType === "year") { return this.issueYear }
      else if(this.searchType === "month") { return `${this.issueYear}/${this.issueMonth}` }
      else { return "" }
    },
    changeQuery() {
      this.showNumber = false;
      this.showName = false;
      this.showYear = false;
      this.showMonth = false;

      this.name = "";
      this.id = "";
      this.issueYear = "";
      this.issueMonth = "";

      if(this.searchType === "id") { this.showNumber = true };
      if(this.searchType === "name") { this.showName = true };
      if(this.searchType === "year") { this.showYear = true };
      if(this.searchType === "month") { this.showYear = true; this.showMonth = true };
    },
    formatIssueMonth() {
      if(this.issueMonth === "") {
        this.invalidateIssueMonth = false;
      } else {
        if(this.issueMonth < 10 && (!this.issueMonth.toString().includes("0") && this.issueMonth || this.issueMonth.toString().length > 2)) {
          this.issueMonth = `0${parseInt(this.issueMonth)}`;
        };
        if(this.issueMonth < 1 || this.issueMonth > 12) {
          this.invalidateIssueMonth = true;
        } else {
          this.invalidateIssueMonth = false;
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


