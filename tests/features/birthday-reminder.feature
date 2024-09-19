Feature: Birthday Reminder & Greetings

  Scenario: View upcoming birthdays
    Given the user is logged in
    When the user navigates to the birthday reminder page
    Then the user should see a list of upcoming birthdays

  Scenario: Send a birthday greeting
    Given the user is on the birthday reminder page
    When the user selects a person with an upcoming birthday
    And the user sends a birthday greeting
    Then the birthday greeting should be sent successfully
