
exports.up = function(knex, Promise) {
    return knex.schema.createTable("summary", table => {
        table.increments("id").primary();
        table.integer("month");
        table.integer("year");
        table.float("gross_revenue", 8, 2);
        table.float("total_fees", 6, 2);
        table.float("net_revenue", 8, 2);
        table.float("unpaid_balance", 7, 2);
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("summary")
};
