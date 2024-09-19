Feature: Alerts & Notifications

  Scenario: View notifications
    Given the user is logged in
    When the user navigates to the notifications page
    Then the user should see a list of their recent notifications

  Scenario: Receive a new alert
    Given the user is logged in
    When a new alert is triggered
    Then the user should receive the alert in their notification center
