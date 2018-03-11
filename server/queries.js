const database = require("./database-connection");
let currentDate;
const setDate = () => {
    currentDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()}`
}


module.exports = {

    readSingleInvoice(id, name) {
        return database.select("*").from("invoices").where("id", id).first()
          .then(record => new Promise((resolve, reject) => (record.name === name.toLowerCase() ? resolve(record) : reject(record))));
    },

    processPayment(transaction) {
        setDate();
        return database("invoices").where("id", transaction.invoiceId)
            .update({
                paid: currentDate,
                balance: 0
            }, "*")
    },

    findNextInvoiceId() {
        return database("invoices").max("id")
    }
}