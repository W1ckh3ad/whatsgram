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

    /// normal login
    cy.get('input[name="Password"]').type('jannik.decker@edu.fhdw.de')
      .should('have.value', 'jannik.decker@edu.fhdw.de')
    
    cy.get('input[name="Password"]').type('123456')
      .should('have.value', '123456') ///Passwort verschlüsselt?
  
    cy.contains('button', 'Login').click()
  });


  ///Change Name
  if ('has a title', () => {
    cy.contains('Profil Bearbeiten')
  });  

    cy.get('input[name="displayName"]').type('Jannik.Testname')
      .should('have.value', 'Jannik.Testname')
    
    cy.contains('button', 'Speichern').click()

  ///Change Telephon Number
  if ('has a title', () => {
    cy.contains('Profil Bearbeiten')
  });  

    cy.get('input[name="phoneNumber"]').type('+49 12345678')
      .should('have.value', '+49 12345678')
    
    cy.contains('button', 'Speichern').click()



///Change Profil Picture URL
  if ('has a title', () => {
    cy.contains('Profil Bearbeiten')
  });  

    cy.get('input[name="photoURL"]').type('https://th.bing.com/th/id/R.1c88c61f3481d30aec5d390fd0b51d1f?rik=KmquqDLyP%2fHPTw&pid=ImgRaw&r=0')
      .should('have.value', 'https://th.bing.com/th/id/R.1c88c61f3481d30aec5d390fd0b51d1f?rik=KmquqDLyP%2fHPTw&pid=ImgRaw&r=0')
    
    cy.contains('button', 'Speichern').click()


///Change Profil Description
  if ('has a title', () => {
    cy.contains('Profil Bearbeiten')
  });  

    cy.get('input[name="description"]').type('Das ist eine Testbeschreibung')
      .should('have.value', 'Das ist eine Testbeschreibung')
    
    cy.contains('button', 'Speichern').click()

/// Back To Settings
    cy.contains('button', 'Arrow Back').click()

 ///Sign Out
  if ('has a title', () => {
    cy.contains('Einstellungen')
  });  
    cy.contains('button', 'Sign Out').click()




/// new Testcase 
  beforeEach(() => {
    cy.visit('http://localhost:8100/sign-in')
  });

  if ('has a title', () => {
    cy.contains('Login')
  });

    /// normal login
    cy.get('input[name="Password"]').type('jannik.decker@edu.fhdw.de')
      .should('have.value', 'jannik.decker@edu.fhdw.de')
    
    cy.get('input[name="Password"]').type('123456')
      .should('have.value', '123456') ///Passwort verschlüsselt?
  
    cy.contains('button', 'Login').click()
  });

  if ('has a title', () => {
    cy.contains('Profil Bearbeiten')
  });  

    cy.contains('tab-button-contacts').click()

  if ('has a title', () => {
    cy.contains('Contacts')
  });  
   
    cy.contains('button', 'add').click() //man könnte add auch weglassen, der plus Button ist der erste Button

    cy.get('input[name="saerch"]').type('c.gdynia@live.de')
      .should('have.value', 'c.gdynia@live.de')
    
    cy.contains('button', 'Search').click()


/// Kontaktliste, wie ein Element herausfinden? wie überprüfen? wie den richtigen Button herausfinden? cy.contains('button', 'add').click()
/// X Button herausfinden und click() Kontakt in Liste überprüfen


  cy.contains('tab-button-chats').click()

  if ('has a title', () => {
    cy.contains('Your Chats')
  });  


/// Kontakt anzuschreiben hatte bisher noch nicht funktioniert, Seite konnte nicht laden, Gruppenfunktion:
    cy.contains('button', 'add').click() //man könnte add auch weglassen, der plus Button ist der erste Button

///Step 1
  if ('has a title', () => {
    cy.contains('Create Group')
  });  
      ///Gruppenname
    cy.get('input[name="ion-input-2"]').type('Test Gruppe')
      .should('have.value', 'Test Gruppe')
      /// Gruppenbild URL
    cy.get('input[name="ion-input-3"]').type('https://th.bing.com/th/id/R.1c88c61f3481d30aec5d390fd0b51d1f?rik=KmquqDLyP%2fHPTw&pid=ImgRaw&r=0')
      .should('have.value', 'https://th.bing.com/th/id/R.1c88c61f3481d30aec5d390fd0b51d1f?rik=KmquqDLyP%2fHPTw&pid=ImgRaw&r=0')
    /// Description
    cy.get('input[name="ion-textarea-1"]').type('Das hier ist unsere Testgruppe')
      .should('have.value', 'Das hier ist unsere Testgruppe')
    
    cy.contains('button', ' Next ').click()

///Step 2
///Nutzer auswählen und Checkliste anklicken
   if ('has a title', () => {
    cy.contains('Create Group')
  }); 
    cy.get('[type="checkbox"]').first().check() 
    cy.contains('button', ' Next ').click()

/// Step 3
    cy.contains('button', 'Create Group').click()

/// Gruppenmitglieder hinzufügen, Offline Nachrichten?, Admin ändern, aus Gruppe austreten oder Gruppe löschen,  Kontakte selber benachrichtigen, Login with other services, dark modus?
/// errors erzeugen und Fehler abfangen?
    


  
  

 



///login with ...




})
