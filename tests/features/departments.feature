Feature: Departments Page

  Scenario: View Departments List
    Given the user is logged in
    When the user navigates to the departments page
    Then the user should see a list of all departments

  Scenario: View Department Details
    Given the user is on the departments page
    When the user clicks on a specific department
    Then the user should see the details of that department
