const database = require("./database-connection");
let currentDate;
const setDate = () => {
    currentDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getUTCDate()}`;
};
const getYear = (date) => {
    return date.getUTCFullYear();
}
const getMonth = (date) => {
    return date.getMonth();
}
const getDate = (date) => {
    return date.getDate();
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
    },

    getInvoice(id) {
        return database.select("*").from("invoices").where("id", id).first()
            .then(record => new Promise((resolve, reject) => record ? resolve(record) : reject(record)))
    },

    updateRecord(data) {
        let record = {
            name: data.name,
            issued: data.issued,
            amount_due: data.amount_due,
            convenience_fee_if_cc: data.convenience_fee_if_cc,
            grand_total_if_cc: data.grand_total_if_cc,
            balance: data.balance
        };
        if (data.paid) {
            record.paid = data.paid
        };
        return database.select("*").from("invoices").where("id", data.invoiceId)
            .update(record, "id");
    },

    deleteRecord(id) {
        return database.select("*").from("invoices").where("id", id)
            .del();
    },

    searchById(id) {
        return database.select("*").from("invoices").where("id", id)
    },

    searchByName(name) {
        return database.select("*").from("invoices").where("name", name)
    },

    searchByYear(year) {
        console.log(year)
        return database.select("*").from("invoices").where("issued", ">=", new Date(`${year}-01-01`)).andWhere("issued", "<", new Date(`${parseInt(year) + 1}-01-01`))
    },

    searchByMonth(year, month) {
        if(parseInt(month) < 12) {
            return database.select("*").from("invoices").where("issued", ">=", new Date(`${year}-${month}-01`)).andWhere("issued", "<", new Date(`${year}-${parseInt(month) + 1}-01`))
        } else {
            return database.select("*").from("invoices").where("issued", ">=", new Date(`${year}-${month}-01`)).andWhere("issued", "<", new Date(`${parseInt(year) + 1}-01-01`))
        }
    },

    getUnpaid() {
        console.log("unpaid")
        return database.select("*").from("invoices").where("balance", ">", 0)
    }
}