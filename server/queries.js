const database = require("./database-connection");

module.exports = {

    readSingleInvoice(id, name) {
        return database.select("*").from("invoices").where("id", id).first()
          .then(record => new Promise((resolve, reject) => (record.name === name.toLowerCase() ? resolve(record) : reject(record))));
    },

    updateBalance(transaction) {
        return database("invoices").where("id", transaction.invoiceId)
            .update({
                paid: `${new Date().getUTCFullYear}-${new Date().getUTCMonth}-${new Date().getUTCDate}`,
                balance: 0
            }, "*")
    },
}