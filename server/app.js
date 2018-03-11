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
    console.log(req.body);
    
    const token = req.body.stripeToken;
    const chargeCard = (chargeObject) => {
      return new Promise((resolve, reject) => {
        stripe.charges.create(chargeObject, (err, charge) => {
            err ? reject(err) : resolve(charge);
        });
      });
    };

    chargeCard({ 
        amount: req.body.amount * 100, 
        currency: "usd", 
        description: "Invoice payment", 
        source: token 
    })
        .then(transaction => {
            console.log(transaction);
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
    console.log(req.body)
    queries.addNewInvoice(req.body)
        .then(id => {
            res.status(201);
            res.json({
                message: `Invoice ${id} created.`
            })
        })
        .catch(err => {
            res.status(400);
            res.json({
                error: {
                    message: `Could not create invoice ${id}.`
                }
            })
        })
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})