Feature: Calendar of Events

  Scenario: View Calendar of Events
    Given the user is logged in
    When the user navigates to the calendar page
    Then the user should see the list of upcoming events

  Scenario: Add New Event to Calendar
    Given the user is an admin and is on the calendar page
    When the user adds a new event
    Then the event should be displayed in the calendar
