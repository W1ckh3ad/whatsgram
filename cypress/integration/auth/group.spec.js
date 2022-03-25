/// <reference types="cypress" />

import Chance from "chance"

const chance = new Chance();


describe("change user settings", () => {
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

  it('should create a group', () => {
    cy.get('[id="tab-button-chats"]').click()

    // plus anklicken

    cy.get('input[name^=ion-input]').first().clear()

    cy.get('input[name^=ion-input]').first().type('Gruppe.Testname')
      .should('have.value', 'Gruppe.Testname')

    cy.get('input[name^=ion-input]').next().clear()

    cy.get('input[name^=ion-input]').next().type('test')
      .should('have.value', 'test')

    cy.get('textarea[name^=ion-textarea]').clear()

    cy.get('textarea[name=^=ion-textarea]').type('Das ist eine Testbeschreibung')
      .should('have.value', 'Das ist eine Testbeschreibung')



  });  


/// Kontakt anzuschreiben hatte bisher noch nicht funktioniert, Seite konnte nicht laden, Gruppenfunktion:
    cy.contains('button', 'add').click() //man könnte add auch weglassen, der plus Button ist der erste Button

///Step 1
  it ('has a title', () => {
    cy.contains('Create Group')
  });  
      ///Gruppenname
    cy.contains('input', 'Group Name').type('Test Gruppe')
      .should('have.value', 'Test Gruppe')

      /// Gruppenbild URL
    cy.contains('input', 'Group Picture URL').type('https://th.bing.com/th/id/R.1c88c61f3481d30aec5d390fd0b51d1f?rik=KmquqDLyP%2fHPTw&pid=ImgRaw&r=0')
      .should('have.value', 'https://th.bing.com/th/id/R.1c88c61f3481d30aec5d390fd0b51d1f?rik=KmquqDLyP%2fHPTw&pid=ImgRaw&r=0')

    /// Description
    cy.contains('input', 'Description').type('Das hier ist unsere Testgruppe')
      .should('have.value', 'Das hier ist unsere Testgruppe')
    
    cy.contains('button', ' Next ').click()

///Step 2
///Nutzer auswählen und Checkliste anklicken
   it ('has a title', () => {
    cy.contains('Create Group')
  }); 
    cy.get('[type="checkbox"]').first().check() 
    cy.contains('button', ' Next ').click()

/// Step 3
    cy.contains('button', 'Create Group').click()

  
/// Add Group Members
  it ('has a title', () => {
    cy.contains('Your Chats')
  });  

    cy.contains('Test Gruppe').click()
 
///Group Settings                                 hier muss noch was gemacht werden
    cy.contains('Test Gruppe').click()

    cy.contains('Hinzufügen').click() 

    cy.get('[type="checkbox"]').first().check()  /// hier wegen User aufpassen!
    cy.contains('button', ' Fertig ').click()
 
/// Change Admin
    cy.contains(' W1ckh3ad ').click() 
    cy.contains('Zum Admin ernennen').click() 

/// Delete Admin
    cy.contains(' W1ckh3ad ').click()
    cy.contains('Adminstatus entfernen').click() 

///Back to Group Chat
    cy.contains('button', 'Arrow Back').click()

///Write a Message
    //cy.get('input[name="message"]').type('Das ist eine Testnachricht')
    //  .should('have.value', 'Das ist eine Testnachricht')
    cy.contains('input','message').type('Das ist eine Testnachricht')
      .should('have.value', 'Das ist eine Testnachricht')

///Send the Message
    cy.contains('button', 'Send').click()

///Remove Member
    cy.contains(' W1ckh3ad ').click() 
    cy.contains('Aus Gruppe entfernen').click() 

///Delete the Group
    cy.contains('Test Gruppe').click()
    cy.contains(' Gruppe löschen ').click()
    cy.contains('Löschen bestätigen').click()

 ///Sign Out
    cy.contains('settings').click()
  it ('has a title', () => {
    cy.contains('Einstellungen')
  });  
    cy.contains('button', 'Sign Out').click()

})

