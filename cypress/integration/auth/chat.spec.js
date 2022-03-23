/// <reference types="cypress" />

import Chance from "chance"

const chance = new Chance();


describe("signin", () => {
  const email = chance.email();
  const pass = "ValidPassword23";

  beforeEach(() => {
    cy.visit('http://localhost:8100/sign-in')
  });

  it ('has a title', () => {
    cy.contains('Login')
  });

    /// normal login
    cy.get('input[name="email"]').type('jannik.decker@edu.fhdw.de')
      .should('have.value', 'jannik.decker@edu.fhdw.de')
    
    cy.get('input[name="Password"]').type('123456')
  
    cy.contains('button', 'Login').click()
  });

    ///Change to Contacts
    cy.contains('tab-button-contacts').click()


///hier die Tests für die Chats
///Kontakt auswählen, Testnachricht schreiben -> aus dem Chat rausgehen, wieder reingehen, schauen ob die Nachricht da ist





})
