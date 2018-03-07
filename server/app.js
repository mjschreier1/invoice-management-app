const express = require("express");
const queries = require("./queries");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const port = process.env.PORT || 3000;

const app = express();

app.get("/invoice", (req, res) => {
    queries.readSingleInvoice(id, name)
        .then(invoice => response.json({invoice}))
        .catch(error => console.error(error))
})

app.post("/charge", (req, res) => {
    const chargeCard = (chargeObject, maxPayment) => {
      return new Promise((resolve, reject) => {
        chargeObject.amount > maxPayment * 100 || chargeObject.amount < 0 
        ? reject(`Payment amount must be between $0 and $${parseInt(maxPayment).toFixed(2)}`) 
        : stripe.charges.create(chargeObject, (err, charge) => {
                err ? reject(err) : resolve(charge);
            }
        );
      });
    };

    const token = req.body.stripeToken;
    chargeCard({ 
        amount: req.body.amount * 100, 
        currency: "usd", 
        description: "Example charge", 
        source: token 
    }, req.body.maxPayment)
        .then(transaction => {
            queries.updateBalance(transaction)
        })
        .then(transaction => {
            res.send(`
                <h1>Transaction successful</h1>
                <p>Card charged for $${(transaction.amount / 100).toFixed(2)}.
            `)
        })
        .catch(error => {
            res.send(`
                <h1>Transaction failed</h1>
                <p>${error}</p>
            `);
        });
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})