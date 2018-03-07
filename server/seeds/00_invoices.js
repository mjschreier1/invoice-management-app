const invoices = require("../seed-data/invoices");

exports.seed = function(knex, Promise) {
  return knex("invoices").del()
    .then(function () {
      return knex("invoices").insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};
