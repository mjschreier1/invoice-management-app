
exports.up = function(knex, Promise) {
    return knex.schema.createTable("invoices", table => {
        table.increments("id").primary();
        table.string("name");
        table.date("issued");
        table.date("paid");
        table.float("amount_due", 7, 2);
        table.float("convenience_fee_if_cc", 4, 2);
        table.float("grand_total_if_cc", 7, 2);
        table.float("balance", 7, 2);
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("invoices");
};
