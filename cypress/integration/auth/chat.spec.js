/// <reference types="cypress" />

import Chance from "chance";

const chance = new Chance();

describe("chat", () => {
  const email = chance.email();
  const pass = "ValidPassword23";

  beforeEach(() => {
    cy.visit("http://localhost:8100/sign-in");

    ///Login
    cy.get('input[name="email"]').clear();

    cy.get('input[name="email"]')
      .type("jannik.decker@edu.fhdw.de")
      .should("have.value", "jannik.decker@edu.fhdw.de");

    cy.get('input[name="Password"]').clear();

    cy.get('input[name="Password"]').type("123456");

    cy.get('ion-button[type="submit"]').click();
  });

  afterEach(() => {
    cy.get('[id="tab-button-settings"]').click();

    cy.contains("Sign Out").click();
  });

  ///Change to Contacts
  it("should chat", () => {
    cy.get('[id="tab-button-contacts"]').click();

    cy.get("app-contact ion-item").first().click();

    cy.get('ion-input input[name="message"]').type("Hello, World");

    cy.get('ion-button[type="submit"]').click();

    cy.go("back");
  });
  ///hier die Tests für die Chats
  ///Kontakt auswählen, Testnachricht schreiben -> aus dem Chat rausgehen, wieder reingehen, schauen ob die Nachricht da ist
});
