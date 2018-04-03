require("dotenv").config();

const express = require("express");
const queries = require("./queries");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const cors = require("cors");
const bodyParser = require("body-parser")

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json())

app.get("/invoice/:id/:name", (req, res) => {
    queries.readSingleInvoice(req.params.id, req.params.name)
        .then(invoice => res.json(invoice))
        .catch(() => {
            res.status(404);
            res.json({ 
                error: {
                    message: "Oops, we couldn't match your invoice number and name!"
                }
            });
        });
});

app.post("/charge", (req, res) => {
    const token = req.body.stripeToken;
    const chargeCard = (chargeObject) => {
      return new Promise((resolve, reject) => {
        stripe.charges.create(chargeObject, (err, charge) => {
            err ? reject(err) : resolve(charge);
        });
      });
    };

    chargeCard({ 
        amount: Math.floor(req.body.amount * 100), 
        currency: "usd", 
        description: "Invoice payment", 
        source: token 
    })
        .then(transaction => {
            queries.processPayment(req.body)
                .then(star => {
                    res.status(200);
                    res.json({
                        message: "Transaction successful!",
                        amount: req.body.amount,
                        row: star
                    })
                })
        })
        .catch(error => {
            res.status(400);
            res.json({
                message: "Transaction failed.",
            })
        });
});

app.get("/next-invoice", (req, res) => {
    queries.findNextInvoiceId()
        .then(record => res.json(record))
        .catch(() => {
            res.status(500);
            res.json({
                error: {
                    message: "Could not load next invoice ID"
                }
            });
        });
})

app.post("/new-invoice", (req, res) => {
    queries.addNewInvoice(req.body)
        .then(id => {
            res.status(201);
            res.json({
                message: `Invoice ${id} created.`
            })
        })
        .catch(() => {
            res.status(400);
            res.json({
                error: {
                    message: `Could not create invoice.`
                }
            })
        })
})

app.get("/get-invoice/:id", (req, res) => {
    queries.getInvoice(req.params.id)
        .then(record => {
            res.status(200);
            res.json(record);
        })
        .catch(() => {
            res.status(404);
            res.json({
                error: {
                    message: `Could not find invoice ${req.params.id}.`
                }
            })
        })
})

app.put("/update-invoice/:id", (req, res) => {
    queries.updateRecord(req.body)
        .then(id => {
            res.status(200);
            res.json({
                message: `Invoice ${id} updated.`
            })
        })
        .catch(() => {
            res.status(400);
            res.json({
                error: {
                    message: `Could not update invoice.`
                }
            })
        })
})

app.delete("/delete-invoice/:id", (req, res) => {
    queries.deleteRecord(req.params.id)
        .then(() => {
            res.status(200);
            res.json({
                message: `Invoice ${req.params.id} deleted.`
            })
        })
        .catch(() => {
            res.status(400);
            res.json({
                error: {
                    message: `Could not delete invoice.`
                }
            })
        })
})

app.get("/search", (req, res) => {
    queries.search(req.query)
        .then(records => {
            res.status(200);
            res.json(records)
        })
        .catch(() => {
            res.status(404);
            res.json({
                error: {
                    message: `No invoice records found.`
                }
            })
        })
})

app.get("/search/id/:id", (req, res) => {
    queries.searchById(req.params.id)
        .then(records => {
            res.status(200);
            res.json(records)
        })
        .catch(() => {
            res.status(404);
            res.json({
                error: {
                    message: `No invoice records found.`
                }
            })
        })
})

app.get("/search/name/:name", (req, res) => {
    queries.searchByName(req.params.name)
        .then(records => {
            res.status(200);
            res.json(records)
        })
        .catch(() => {
            res.status(404);
            res.json({
                error: {
                    message: `No invoice records found.`
                }
            })
        })
})

app.get("/search/year/:year", (req, res) => {
    queries.searchByYear(req.params.year)
        .then(records => {
            res.status(200);
            res.json(records)
        })
        .catch(() => {
            res.status(404);
            res.json({
                error: {
                    message: `No invoice records found.`
                }
            })
        })
})

app.get("/search/month/:year/:month", (req, res) => {
    queries.searchByMonth(req.params.year, req.params.month)
        .then(records => {
            res.status(200);
            res.json(records)
        })
        .catch(() => {
            res.status(404);
            res.json({
                error: {
                    message: `No invoice records found.`
                }
            })
        })
})

app.get("/search/unpaid", (req, res) => {
    queries.getUnpaid()
        .then(records => {
            res.status(200);
            res.json(records)
        })
        .catch(() => {
            res.status(404);
            res.json({
                error: {
                    message: `No invoice records found.`
                }
            })
        })
})

app.get("/search/annually/:year", (req, res) => {
    queries.getAnnualRecord(req.params.year)
        .then(record => {
            if(record[0]) {
                res.status(200);
                res.json(record);
            } else {
                reject();
            }
        })
        .catch(() => {
            res.status(404);
            res.json({
                error: {
                    message: `No records found for ${req.params.year}`
                }
            })
        })
})

app.get("/search/monthly/:year/:month", (req, res) => {
    queries.getMonthlyRecord(req.params.year, req.params.month)
        .then(record => {
            res.status(200);
            res.json(record)
        })
        .catch(() => {
            res.status(404);
            res.json({
                error: {
                    message: `No records found for ${req.params.month}/${req.params.year}`
                }
            })
        })
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})