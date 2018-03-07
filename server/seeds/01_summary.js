const summary = require("../seed-data/summary");

exports.seed = function(knex, Promise) {
  return knex("summary").del()
    .then(function() {
      return knex("summary").insert(summary);
    });
};
