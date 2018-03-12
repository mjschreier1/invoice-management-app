let data = [
  {
    id: 1001,
    name: "smith",
    issued: "2018-02-01",
    paid: "2018-02-09",
    amount_due: 40,
    balance: 0
  },
  {
    id: 1002,
    name: "galvanize opera theatre",
    issued: "2018-01-15",
    amount_due: 1000,
    balance: 1000
  },
  {
    id: 1003,
    name: "johnson",
    issued: "2018-03-01",
    amount_due: 120,
    balance: 120
  },
  {
    id: 1004,
    name: "doe",
    issued: "2018-02-22",
    paid: "2018-02-22",
    amount_due: 100,
    balance: 0
  },
  {
    id: 1005,
    name: "galvanize lounge",
    issued: "2018-01-31",
    paid: "2018-01-31",
    amount_due: 200,
    balance: 100
  },
  {
    id: 1006,
    name: "williams",
    issued: "2018-03-01",
    amount_due: 120,
    balance: 120
  },
  {
    id: 1007,
    name: "miller",
    issued: "2018-03-01",
    amount_due: 120,
    balance: 120
  },
  {
    id: 1008,
    name: "wilson",
    issued: "2018-03-01",
    amount_due: 120,
    balance: 120
  },
  {
    id: 1009,
    name: "galvanize music school",
    issued: "2018-03-05",
    amount_due: 250,
    balance: 250
  }
];

data.forEach(record => {
    record.grand_total_if_cc = (record.amount_due / 0.971 + 0.3).toFixed(2);
    record.convenience_fee_if_cc = record.grand_total_if_cc - record.amount_due;
})

module.exports = data