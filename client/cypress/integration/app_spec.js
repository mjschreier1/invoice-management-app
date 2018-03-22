describe("Clientelements", () => {
  it("can create, read, update, and delete invoices, and updates records upon successfully processing payments", () => {
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

    cy.visit("/")

    cy.get(":nth-child(1) > input")
      .click()
      .type("1010")

    cy.get(":nth-child(2) > input")
      .click()
      .type("schreier")

    cy.get(":nth-child(2) > button")
      .click()

    cy.get(".stripe-card")
      .click(40, 5)

    cy.get("body")
      .type("424242424242424242424242424", {force: true})

    cy.get(':nth-child(5) > button')
      .click()
  })
})
