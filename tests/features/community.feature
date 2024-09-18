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

    Scenario: Logged-in member sets a post as an announcement
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the post input field with placeholder "Share Your Thoughts..."
    And the user writes "This is an announcement"
    And the user toggles the "Set as Announcement?" switch to ON
    And the user clicks on the "Publish" button (arrow icon)
  Then the post "This is an announcement" should be visible in the group's post list
    And the post should be marked as an announcement

Scenario: Logged-in member uploads a video
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the video upload icon (camera icon)
    And the user selects the video file "video700kb.mov"
    And the user clicks on the "Publish" button (arrow icon)
  Then the video "video700kb.mov" should be visible in the group's post list

  Scenario: Logged-in member uploads a video and adds text
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the post input field with placeholder "Share Your Thoughts..."
    And the user writes "This is a test post with a video"
    And the user clicks on the video upload icon (camera icon)
    And the user selects the video file "video700kb.mov"
    And the user clicks on the "Publish" button (arrow icon)
  Then the post "This is a test post with a video" should be visible in the group's post list
    And the video "video700kb.mov" should be visible in the post

Scenario: Logged-in member uploads a single image
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the image upload icon (image icon)
    And the user selects the image file "image1.png"
    And the user clicks on the "Publish" button (arrow icon)
  Then the image "image1.png" should be visible in the group's post list

    Scenario: Logged-in member uploads multiple images
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the image upload icon (image icon)
    And the user selects the image files "image1.png", "image1.png", "image1.png", "image1.png", "image1.png"
    And the user clicks on the "Publish" button (arrow icon)
  Then five instances of the image "image1.png" should be visible in the group's post list

  Scenario: Logged-in member uploads multiple images and adds text
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the post input field with placeholder "Share Your Thoughts..."
    And the user writes "This is a test post with multiple images"
    And the user clicks on the image upload icon (image icon)
    And the user selects the image files "image1.png", "image1.png", "image1.png", "image1.png", "image1.png"
    And the user clicks on the "Publish" button (arrow icon)
  Then the post "This is a test post with multiple images" should be visible in the group's post list
    And five instances of the image "image1.png"(5) should be visible in the post

    Scenario: Logged-in member downloads a document
  Given the user is logged in
  When the user navigates to the "testmember" community group page
    And the user navigates to the post containing the document "testdoc.xlsx"
    And the user clicks on the download link or button for "testdoc.xlsx"
  Then the document "testdoc.xlsx" should start downloading to the user's computer
    And a confirmation message or download indicator should be visible

Scenario: Logged-in member creates a post with an album tag
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the post input field with placeholder "Share Your Thoughts..."
    And the user writes "This is a test post with an album tag"
    And the user clicks on the "Album Tag" button
    And the user selects an album tag from the list
    And the user clicks on the "Publish" button 
  Then the post "This is a test post with an album tag" should be visible in the group's post list
    And the selected album tag should be visible in the post

    Scenario: Logged-in member creates a post with an album tag
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the post input field with placeholder "Share Your Thoughts..."
    And the user writes "This is a test post with an album tag"
    And the user clicks on the "event tag" button
    And the user selects an album tag from the list
    And the user clicks on the "Publish" button 
  Then the post "This is a test post with an event tag" should be visible in the group's post list
    And the selected event tag should be visible in the post


Scenario: Logged-in member views uploaded files in the gallery
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the "Gallery" tab
  Then the gallery should display the file "image1.png"
    And the gallery should display the file "video700kb.mov"

    Scenario: Logged-in member views uploaded document in the files tab
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the "Files" tab
  Then the files list should display the document "testdoc.xlsx"
