Feature: Polls

  Scenario: Create a new poll
    Given the user is logged in as an admin
    When the admin creates a new poll
    Then the poll should be displayed on the polls page

  Scenario: Vote on a poll
    Given the user is logged in
    When the user votes on a poll
    Then their vote should be counted and the results should be updated
