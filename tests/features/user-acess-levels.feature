Feature: User Access Levels

  Scenario: Verify superadmin access level
    Given the user is logged in as a superadmin
    When the user navigates to the admin dashboard
    Then the user should be able to manage all content and users

  Scenario: Verify community admin access level
    Given the user is logged in as a community admin
    When the user navigates to the community management page
    Then the user should be able to manage community-related content and users

  Scenario: Verify regular user access level
    Given the user is logged in as a regular user
    When the user navigates to their profile
    Then the user should only be able to manage their own content
