/// <reference types="cypress" />

import Chance from "chance";

const chance = new Chance();

describe("groups", () => {
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

  it("should create a group", () => {
    cy.get('[id="tab-button-chats"]').click();

    // plus anklicken
    cy.get("ion-buttons ion-button").click();

    cy.get("input[name^=ion-input]").first().clear();

    cy.get("input[name^=ion-input]")
      .first()
      .type("Gruppe.Testname")
      .should("have.value", "Gruppe.Testname");

    cy.get("[formcontrolname='photoURL'] input")
      .scrollIntoView()
      .clear()
      .type("test")
      .should("have.value", "test");

    cy.get("[formcontrolname='description'] textarea")
      .type("Das ist eine Testbeschreibung")
      .should("have.value", "Das ist eine Testbeschreibung");

    cy.get("app-create-group ion-buttons ion-button").click();

    cy.get('app-create-group [role="checkbox"]').first().click();

    cy.get("app-create-group ion-buttons ion-button").click();

    cy.get("app-create-group ion-button").contains("Create Group").click();

    cy.wait(3000);
  });

  ///Step 1
  it("has a title", () => {
    cy.contains("Create Group");
  });

  // /// Add Group Members
  // it("has a title", () => {
  //   cy.contains("Your Chats");
  // });

  // cy.contains("Test Gruppe").click();

  // ///Group Settings                                 hier muss noch was gemacht werden
  // cy.contains("Test Gruppe").click();

  // cy.contains("Hinzufügen").click();

  // cy.get('[type="checkbox"]').first().check(); /// hier wegen User aufpassen!
  // cy.contains("button", " Fertig ").click();

  // /// Change Admin
  // cy.contains(" W1ckh3ad ").click();
  // cy.contains("Zum Admin ernennen").click();

  // /// Delete Admin
  // cy.contains(" W1ckh3ad ").click();
  // cy.contains("Adminstatus entfernen").click();

  // ///Back to Group Chat
  // cy.contains("button", "Arrow Back").click();

  // ///Write a Message
  // //cy.get('input[name="message"]').type('Das ist eine Testnachricht')
  // //  .should('have.value', 'Das ist eine Testnachricht')
  // cy.contains("input", "message")
  //   .type("Das ist eine Testnachricht")
  //   .should("have.value", "Das ist eine Testnachricht");

  // ///Send the Message
  // cy.contains("button", "Send").click();

  // ///Remove Member
  // cy.contains(" W1ckh3ad ").click();
  // cy.contains("Aus Gruppe entfernen").click();

  // ///Delete the Group
  // cy.contains("Test Gruppe").click();
  // cy.contains(" Gruppe löschen ").click();
  // cy.contains("Löschen bestätigen").click();
});
