const database = require("./database-connection");
let currentDate;
const setDate = () => {
    currentDate = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()}`;
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

    search(params) {
        let queryTerms = [...Object.keys(params)];
        console.log(queryTerms)
        // Object.keys(params).forEach(param => {
        //     param.includes("issue") || param.includes("paid") ? param.includes("issue") ? queryTerms.push("issued") : queryTerms.push("paid") : queryTerms.push(param);
        // })
        return database.select("*").from("invoices")
            .then(records => records.filter(record => {
                // console.log(record)
                queryTerms.forEach(term => {
                    if (term.includes("issue") && term.includes("Year") && getYear(record.issued) != params[term]) {
                        console.log("false")
                        return false;
                    }
                    else if (term.includes("issue") && term.includes("Month") && getMonth(record.issued) != params[term]) {
                        console.log("false")
                        return false;
                    }
                    else if (term.includes("issue") && term.includes("Date") && getDate(record.issued) != params[term]) {
                        console.log("false")
                        return false;
                    }
                    else if (term.includes("paid") && term.includes("Year") && getYear(record.paid) != params[term]) {
                        console.log("false")
                        return false;
                    }
                    else if (term.includes("paid") && term.includes("Month") && getMonth(record.paid) != params[term]) {
                        console.log("false")
                        return false;
                    }
                    else if (term.includes("paid") && term.includes("Date") && getDate(record.paid) != params[term]) {
                        console.log("false")
                        return false;
                    }
                    else {
                        if (term != "indicators" && record[term] != params[term]) {
                            console.log("false")
                            return false;
                        }
                    }
                });
                console.log("true")
                return true;
            }))
    },

    getAll() {
        return database.select("*").from("invoices").then(records => records.filter(record => true))
    }
}