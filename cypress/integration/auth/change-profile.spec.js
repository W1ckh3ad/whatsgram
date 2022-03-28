/// <reference types="cypress" />

import Chance from "chance";

const chance = new Chance();

describe("change user settings", () => {
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

  ///Change Name
  it("should change name", () => {
    cy.get('[id="tab-button-settings"]').click();

    cy.contains("Profil bearbeiten").click();

    cy.get('input[name="displayName"]').clear();

    cy.get('input[name="displayName"]')
      .type("Jannik.Testname")
      .should("have.value", "Jannik.Testname");

    cy.contains("Speichern").click();

    cy.go("back");
  });

  ///Change Telephone Number
  it("should change phone number", () => {
    cy.get('[id="tab-button-settings"]').click();

    cy.contains("Profil bearbeiten").click();

    cy.get('input[name="phoneNumber"]').clear();

    cy.get('input[name="phoneNumber"]')
      .type("+49 12345678")
      .should("have.value", "+49 12345678");

    cy.contains("Speichern").click();

    cy.go("back");
  });

  ///Change Profil Picture URL
  it("should change photo", () => {
    cy.get('[id="tab-button-settings"]').click();

    cy.contains("Profil bearbeiten").click();

    cy.get('input[name="photoURL"]').clear();

    cy.get('input[name="photoURL"]').type("abcd").should("have.value", "abcd");

    cy.contains("Speichern").click();

    cy.go("back");
  });

  ///Change Profil Description
  it("should change description", () => {
    cy.get('[id="tab-button-settings"]').click();

    cy.contains("Profil bearbeiten").click();

    cy.get('textarea[name="description"]').clear();

    cy.get('textarea[name="description"]')
      .type("Das ist eine Testbeschreibung")
      .should("have.value", "Das ist eine Testbeschreibung");

    cy.contains("Speichern").click();

    cy.go("back");
  });
});
