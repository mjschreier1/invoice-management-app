let data = [
  {
    id: 1,
    month: 1,
    year: 2018,
    gross_revenue: 103.29,
    total_fees: 3.29,
    net_revenue: this.gross_revenue - this.total_fees,
    unpaid_balance: 100
  },
  {
    id: 2,
    month: 2,
    year: 2018,
    gross_revenue: 144.49,
    total_fees: 4.49,
    net_revenue: this.gross_revenue - this.total_fees,
    unpaid_balance: 0
  },
  {
    id: 3,
    month: 3,
    year: 2018,
    gross_revenue: 0,
    total_fees: 0,
    net_revenue: this.gross_revenue - this.total_fees,
    unpaid_balance: 730
  }
];

data.forEach(record => {
    record.net_revenue = record.gross_revenue - record.total_fees
})

module.exports = data