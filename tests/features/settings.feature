Feature: Settings (without theme selection)

  Scenario: Update user profile information
    Given the user is logged in
    When the user navigates to the settings page
    And the user updates their profile information
    Then the changes should be saved successfully

  Scenario: Change password
    Given the user is logged in
    When the user navigates to the settings page
    And the user changes their password
    Then the password should be updated successfully

  Scenario: Enable or disable notifications
    Given the user is logged in
    When the user navigates to the settings page
    And the user toggles notifications
    Then the notification settings should be updated
