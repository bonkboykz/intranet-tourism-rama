Feature: Profile Management and Gallery

  Scenario: Update Profile Picture
    Given the user is on the login page
    When the user logs in with valid credentials
    And the user navigates to the profile page
    And the user uploads a new profile picture
    Then the profile picture is successfully updated

  Scenario: Add Picture to Gallery
    Given the user is on the profile gallery page
    When the user uploads a new gallery picture
    Then the picture should be visible in the gallery
