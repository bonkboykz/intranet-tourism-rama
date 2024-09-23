Feature: Departments Page

  Scenario: View Departments List
    Given the user is logged in
    When the user navigates to the departments page
    Then the user should see a list of all departments

  Scenario: View Department Details
    Given the user is on the departments page
    When the user clicks on a specific department
    Then the user should see the details of that department


========================================================================================


Scenario: Super admin views departments page
  Given the super admin is logged in
  When the super admin navigates to the "Departments" page
  Then the super admin should see a list of departments

  Scenario: Super admin creates a new department named "Test"
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin clicks on the "+ Department" button
  Then the super admin should see a form to create a new department
  
  When the super admin enters "Test" in the department name field
    And the super admin submits the form
  Then a new department named "Test" should be created
    And the new department "Test" should be visible in the list of departments



    
