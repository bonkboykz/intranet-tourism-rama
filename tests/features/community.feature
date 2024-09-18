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

aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


  Scenario: Member logs in, navigates to community page, and views groups
    Given the user is on the login page
    When the user enters their email as "testmember@mail.com"
      And the user enters their password as "123"
      And the user clicks on the "Login" button
    Then the user should be redirected to the homepage       
      When the user navigates to the community page
    Then the community page should be displayed
      And the user should see a list of community groups 

 
  Scenario: Member logs in, navigates to community page, and creates a public group
    Given the user is on the login page
    When the user enters their email as "testmember@mail.com"
      And the user enters their password as "123"
      And the user clicks on the "Login" button
    Then the user should be redirected to the homepage
    When the user navigates to the community page
    Then the community page should be displayed
      And the user should see a list of community groups
    When the user clicks on the "+community" button
      And the user enters "testmember" as the group name
      And the user enters "testmember" as the group description
      And the user selects "public" as the group type
      And the user clicks on the "Create" button
    Then the "testmember" community group should be created
      And the user should see the new "testmember" community group in the list of community groups
      

      Scenario: Member logs in, navigates to community page, and visits a specific group
    Given the user is on the login page
    When the user enters their email as "testmember@mail.com"
      And the user enters their password as "123"
      And the user clicks on the "Login" button
    Then the user should be redirected to the homepage
    When the user navigates to the community page
    Then the community page should be displayed
      And the user should see a list of community groups
    When the user clicks on the community group named "testmember"
    Then the user should be redirected to the "testmember" community group page
      And the "testmember" community group page should be displayed
