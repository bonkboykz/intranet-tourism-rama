Feature: Community Management (Group)

  Scenario: View Community Groups
    Given the user is logged in
    When the user navigates to the communities page
    Then the user should see a list of all community groups

  Scenario: Admin adds a new community group
    Given the user is logged in as an admin
    When the admin adds a new community group
    Then the group should appear in the list of communities

  Scenario: Member posts in a community group
    Given the user is a community member
    When the member posts in the community group
    Then the post should be visible to the group
