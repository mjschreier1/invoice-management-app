const invoices = require("../seed-data/invoices");

exports.seed = function(knex, Promise) {
  return knex("invoices").del()
    .then(function () {
      return knex("invoices").insert(invoices);
    })
    .then(() => knex.raw("ALTER SEQUENCE invoices_id_seq RESTART WITH 1010"));
};
