/// <reference types="cypress" />

import Chance from "chance"

const chance = new Chance();


describe("signin", () => {
  const email = chance.email();
  const pass = "ValidPassword23";

  beforeEach(() => {
    cy.visit('http://localhost:8100/sign-in')

    ///Login
    cy.get('input[name="email"]').clear()

    cy.get('input[name="email"]').type('jannik.decker@edu.fhdw.de')
      .should('have.value', 'jannik.decker@edu.fhdw.de')
          
    cy.get('input[name="Password"]').clear()
        
    cy.get('input[name="Password"]').type('123456')
        
    cy.get('ion-button[type="submit"]').click()    

  });

  afterEach(() => {
    cy.get('[id="tab-button-settings"]').click()

    cy.contains('Sign Out').click()

  });

    ///Add Contacts
  it ('should add contact', () => {  
    cy.get('[id="tab-button-contacts"]').click()

    cy.first().click() // ansprechen unklar

    cy.get('input[name="saerch"]').type('c.gdynia@live.de')
      .should('have.value', 'c.gdynia@live.de')
    
    cy.get('ion-button[type="submit"]').click()    
    cy.contains('button', 'Add').click()  //ansprechen unklar
  
  });  
})
