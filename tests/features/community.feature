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


 Scenario: Logged-in member navigates to community page and views groups
    Given the user is logged in
    When the user navigates to the community page
    Then the community page should be displayed
      And the user should see a list of community groups

 
  Scenario: Logged-in member creates a public group and sees it in the list
    Given the user is logged in
    When the user navigates to the community page
      And the user clicks on the "+community" button
      And the user enters "testmember" as the group name
      And the user enters "testmember description" as the group description
      And the user selects "public" as the group type
      And the user clicks on the "Create" button
    Then the "testmember" community group should be created
      And the user should see the new "testmember" community group in the list of community groups
      

      Scenario: Member logs in, navigates to community page, and visits a specific group
    Given the user is logged in
    When the user navigates to the community page
    Then the community page should be displayed
      And the user should see a list of community groups
    When the user clicks on the community group named "testmember"
    Then the user should be redirected to the "testmember" community group page
      And the "testmember" community group page should be displayed


      Scenario: Logged-in member writes and publishes a post
    Given the user is logged in
      And the user is on the "testmember" community group page
    When the user writes "This is a test post" in the post input field
      And the user clicks on the "Publish" button
    Then the post "This is a test post" should be visible in the group's post list


 Scenario: Logged-in member writes and publishes a post with an emoji
    Given the user is logged in
      And the user is on the "testmember" community group page
    When the user writes "This is a test post with an emoji 😊" in the post input field
      And the user clicks on the "Publish" button
    Then the post "This is a test post with an emoji 😊" should be visible in the group's post list


Scenario: Logged-in member creates a poll with any title
    Given the user is logged in
      And the user is on the "testmember" community group page
    When the user clicks on the "Create Poll" button
      And the user enters "Test Poll Title" as the poll title
      And the user enters "Option 1" and "Option 2" as the poll options
      And the user clicks on the "Create Poll" button
    Then the poll "Test Poll Title" should be visible in the group's poll list
    

 Scenario: Logged-in member adds an additional option to an existing poll
    Given the user is logged in
      And the user is on the "testmember" community group page
      And the poll "Test Poll Title" exists
    When the user clicks on the "Add Option" button for the poll "Test Poll Title"
      And the user enters "Option 3" as the new poll option
      And the user clicks on the "Save Option" button
    Then the poll "Test Poll Title" should have the options "Option 1", "Option 2", and "Option 3"
