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
        return database("invoices").max("id").first();
    },

    addNewInvoice(data) {
        let record = {
            name: data.name,
            issued: data.issued,
            amount_due: data.amount_due,
            convenience_fee_if_cc: data.convenience_fee_if_cc,
            grand_total_if_cc: data.grand_total_if_cc,
            balance: data.balance            
        };
        if(data.paid) {
            record.paid = data.paid
        }
        return database("invoices").insert(record, "id")
    }
}