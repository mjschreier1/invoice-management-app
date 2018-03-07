const summary = require("../seed-data/summary");

exports.seed = function(knex, Promise) {
  return knex("summary").del()
    .then(function() {
      return knex("summary").insert(summary);
    })
    .then(() => knex.raw("ALTER SEQUENCE summary_id_seq RESTART WITH 4"));
};
