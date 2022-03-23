/// <reference types="cypress" />

import Chance from "chance"

const chance = new Chance();


describe("change user settings", () => {
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

    cy.contains('settings').click()
  
///Change Name
  it ('has a title', () => {
    cy.contains('Profil Bearbeiten')
  });  

    cy.get('input[name="displayName"]').type('Jannik.Testname')
      .should('have.value', 'Jannik.Testname')
    
    cy.contains('button', 'Speichern').click()

  ///Change Telephon Number
  it ('has a title', () => {
    cy.contains('Profil Bearbeiten')
  });  

    cy.get('input[name="phoneNumber"]').type('+49 12345678')
      .should('have.value', '+49 12345678')
    
    cy.contains('button', 'Speichern').click()



///Change Profil Picture URL
  it ('has a title', () => {
    cy.contains('Profil Bearbeiten')
  });  

    cy.get('input[name="photoURL"]').type('https://th.bing.com/th/id/R.1c88c61f3481d30aec5d390fd0b51d1f?rik=KmquqDLyP%2fHPTw&pid=ImgRaw&r=0')
      .should('have.value', 'https://th.bing.com/th/id/R.1c88c61f3481d30aec5d390fd0b51d1f?rik=KmquqDLyP%2fHPTw&pid=ImgRaw&r=0')
    
    cy.contains('button', 'Speichern').click()


///Change Profil Description
  it ('has a title', () => {
    cy.contains('Profil Bearbeiten')
  });  

    cy.get('input[name="description"]').type('Das ist eine Testbeschreibung')
      .should('have.value', 'Das ist eine Testbeschreibung')
    
    cy.contains('button', 'Speichern').click()

/// Back To Settings
    cy.contains('button', 'Arrow Back').click()

 ///Sign Out
  it ('has a title', () => {
    cy.contains('Einstellungen')
  });  
    cy.contains('button', 'Sign Out').click()


})
