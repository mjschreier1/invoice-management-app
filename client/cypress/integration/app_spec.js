describe("Clientelements", () => {
  it("can create and read invoices", () => {
    cy.exec("cd ../server && knex seed:run")

    cy.visit("/dashboard")

    cy.get(".router-link:first")
      .click()

    cy.get("#createInvoiceComponent")
      .should("be.visible")

    cy.get("form > :nth-child(2) > input.block")
      .click()
      .type("schreier")

    cy.get(":nth-child(5) > .currency-input > .eight-digit")
      .click()
      .type("100")
      .blur()

    cy.get("button")
      .click()

    cy.get(".responseMessage")
      .should("contain", "Invoice 1010 created")

    cy.get(":nth-child(3) > a > .router-link > p")
      .click()

    cy.get(".five-digit")
      .type("1010")

    cy.get("button")
      .should("not.have.attr", "disabled")

    cy.get("button")
      .click()

    cy.get(".record")
      .should("contain", "1010")
      .and("contain", "schreier")
      .and("contain", "$100.00")
      .and("contain", "$3.29")
      .and("contain", "$103.29")
      .and("contain", "unpaid")
  });

  it("can update invoices", () => {
    cy.visit("/dashboard/update")

    cy.get(".five-digit")
      .type("1010")

    cy.get("button")
      .should("not.have.attr", "disabled")

    cy.get("button")
      .click()

    cy.get(":nth-child(5) > .currency-input > .eight-digit")
      .clear()
      .type("75")

    cy.get(".formValid")
      .click()

    cy.visit("/dashboard/books")

    cy.get(".five-digit")
      .type("1010")

    cy.get("button")
      .click()

    cy.get(".record")
      .should("contain", "1010")
      .and("contain", "$75.00")
      .and("contain", "$2.54")
      .and("contain", "$77.54")
  });

  it("can look up invoices from client view", () => {
    cy.visit("/")

    cy.get(":nth-child(1) > input")
      .type("1010")

    cy.get(":nth-child(2) > input")
      .type("schreier")

    cy.get(":nth-child(2) > button")
      .should("not.have.attr", "disabled")

    cy.get(":nth-child(2) > button")
      .click()

    cy.get("p")
      .should("contain", "Invoice 1010")
      .and("contain", "$75.00 balance")

    cy.get(".stripe-card")
      .should("be.visible")
  })
})
