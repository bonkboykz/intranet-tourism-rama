Feature: Auto-generated QR Code

  Scenario: Generate a QR code for a user profile
    Given the user is logged in
    When the user navigates to their profile page
    And the user generates a QR code for their profile
    Then the QR code should be generated and displayed successfully

  Scenario: Scan a QR code to view the profile
    Given a user has a QR code
    When another user scans the QR code
    Then they should be redirected to the correct profile page

