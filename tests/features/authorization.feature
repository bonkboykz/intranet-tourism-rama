Feature: Authorization

  Scenario: User sucessfuly authenticates
    Given not authorized user
    When the user navigates to /login
    Then he sees login page with button azure and two inputs (email, password)
    When the user enters correct credentials (email, password) and clicks button login
    Then user should be redirected to /dashboard page automatically

  Scenario: User failes authentication
    Given not authorized user
    When the user navigates to /login
    Then he sees login page with button azure and two inputs (email, password)
    When the user enters incorrect credentials (email or password) and clicks button login
    Then user should stay on the /login page

  Scenario: Verify access as Superadmin
    Given the user is logged in as a superadmin
    When the user navigates to restricted pages
    Then the user should have access to all pages

  Scenario: Verify access as Community Admin
    Given the user is logged in as a community admin
    When the user navigates to community management pages
    Then the user should be able to manage community-related content

  Scenario: Verify access as Department Admin
    Given the user is logged in as a department admin
    When the user navigates to department pages
    Then the user should be able to manage department-related content

  Scenario: Verify access as Regular User
    Given the user is logged in as a regular user
    When the user navigates to the restricted admin page
    Then the user should be denied access
