/// <reference types="cypress" />

import Chance from "chance"

const chance = new Chance();


describe("signin", () => {
  const email = chance.email();
  const pass = "ValidPassword23";

  beforeEach(() => {
    cy.visit('http://localhost:8100/sign-in')
  });

  if ('has a title', () => {
    cy.contains('Login')
  });



})
