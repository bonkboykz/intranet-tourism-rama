Feature: Who Is Online List

  Scenario: View the list of online users
    Given the user is logged in
    When the user navigates to the "Who is Online" section
    Then the user should see a list of online users

  Scenario: Check if a specific user is online
    Given the user is logged in
    When the user checks the online list
    Then the user should see if a specific user is online
