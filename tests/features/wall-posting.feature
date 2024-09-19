Feature: Wall Posting

  Scenario: Post on Dashboard Wall
    Given the user is logged in
    When the user posts a message on the dashboard wall
    Then the message should appear on the dashboard wall

  Scenario: Post on Profile Wall
    Given the user is logged in
    When the user posts a message on their profile wall
    Then the message should appear on the profile wall

  Scenario: Post on Department Wall
    Given the user is a department member
    When the member posts a message on the department wall
    Then the message should appear on the department wall

  Scenario: Post on Community Wall
    Given the user is a community member
    When the member posts a message on the community wall
    Then the message should appear on the community wall
