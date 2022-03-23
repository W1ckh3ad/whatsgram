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

  it ('has a title', () => {
    cy.contains('Contacts')
  });  
   
    cy.contains('button', 'add').click() //man könnte add auch weglassen, der plus Button ist der erste Button

    cy.get('input[name="saerch"]').type('c.gdynia@live.de')
      .should('have.value', 'c.gdynia@live.de')
    
    cy.contains('button', 'Search').click()
    cy.contains('button', 'Add').click()

    /// Sign Out 
/// Back To Settings
    cy.contains('button', 'Arrow Back').click()

 ///Sign Out
    cy.contains('settings').click()
  it ('has a title', () => {
    cy.contains('Einstellungen')
  });  
    cy.contains('button', 'Sign Out').click()



})
