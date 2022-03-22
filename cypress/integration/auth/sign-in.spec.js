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

    
    cy.get('input[name="Password"]').type('jannik.decker@edu.fhdw.de')
      .should('have.value', 'jannik.decker@edu.fhdw.de')
    
    cy.get('input[name="Password"]').type('123456')
      .should('have.value', '123456')
  
    cy.contains('button', 'Login').click()
  });


})
