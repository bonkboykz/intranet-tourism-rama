Feature: Community Management (Group)


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

Scenario: Logged-in member navigates to the Members tab
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the "Members" tab
  Then the members list should be displayed


Scenario: Logged-in member searches for a specific member
  Given the user is logged in
    And the user is on the "testmember" community group page
    And the user clicks on the "Members" tab
  When the user clicks on the search input field with placeholder "Search member"
    And the user types "test member"
  Then the search results should display the "test member" account

  Scenario: Logged-in member removes self from the community group
  Given the user is logged in
    And the user is on the "Members" tab of the "testmember" community group page
  When the user clicks on the search input field with placeholder "Search member"
    And the user types "test member"
    And the search results display the "test member" account
    And the user clicks on the three dots (options menu) next to the "test member" account
    And the user selects the "Remove" or "Leave group" option
    And the user confirms the action
  Then the user should be removed from the "testmember" community group
    And the user should no longer see the "testmember" community group in their list of groups


    Scenario: Logged-in member applies filters in the group page
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the "Filters" button
  Then the filters options should be displayed
    And the user should see options for filtering members

    Scenario: Logged-in member applies "Photos" filter
  Given the user is logged in
    And the user is on the "testmember" community group page
    And the filters options are displayed
  When the user clicks on the "Photos" filter
  Then only photos should be displayed in the search results

  Scenario: Logged-in member applies "Videos" filter
  Given the user is logged in
    And the user is on the "testmember" community group page
    And the filters options are displayed
  When the user clicks on the "Videos" filter
  Then only videos should be displayed in the search results

  Scenario: Logged-in member applies "Polls" filter
  Given the user is logged in
    And the user is on the "testmember" community group page
    And the filters options are displayed
  When the user clicks on the "Polls" filter
  Then only polls should be displayed in the search results

  Scenario: Logged-in member applies "Announcements" filter
  Given the user is logged in
    And the user is on the "testmember" community group page
    And the filters options are displayed
  When the user clicks on the "Announcements" filter
  Then only announcements should be displayed in the search results

  Scenario: Logged-in member applies "Files" filter
  Given the user is logged in
    And the user is on the "testmember" community group page
    And the filters options are displayed
  When the user clicks on the "Files" filter
  Then only files should be displayed in the search results

  Scenario: Logged-in member applies "Mentions" filter
  Given the user is logged in
    And the user is on the "testmember" community group page
    And the filters options are displayed
  When the user clicks on the "Mentions" filter
  Then only mentions should be displayed in the search results

  Scenario: Logged-in member invites another user to the community
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the "Invite" button
    And the user types "test" in the search input field
    And the user selects the "test" account from the search results
    And the user clicks on the "Send Invite" button
  Then the "test" account should receive an invitation to join the community

  Scenario: Verify that the invited member appears in the Members tab
  Given the user is logged in
    And the user is on the "testmember" community group page
  When the user clicks on the "Members" tab
    And the user types "test" in the search input field
  Then the search results should display the "test" account

Scenario: Super admin views all communities
  Given the super admin is logged in
  When the super admin navigates to the "Communities" page
  Then the super admin should see all communities
    And the list of communities should include both private and public groups

    Scenario: Super admin accesses the "testmember" community
  Given the super admin is logged in
  When the super admin navigates to the "Communities" page
    And the super admin clicks on the "testmember" community
  Then the super admin should be taken to the "testmember" community group page
    And the "testmember" community group page should be displayed

Scenario: Super admin views all posts in the "testmember" community
  Given the super admin is logged in
    And the super admin is on the "testmember" community group page
  When the super admin scrolls through the group feed
  Then the super admin should see all posts, including photos, videos, polls, documents, and tags

 Scenario: Super admin deletes any post in the "testmember" community
  Given the super admin is logged in
    And the super admin is on the "testmember" community group page
  When the super admin sees any post
    And the super admin clicks on the three dots (options menu) next to the post
    And the super admin selects the "Delete" option
    And the super admin confirms the deletion
  Then the post should be removed from the group feed

  Scenario: Super admin changes role and removes "testmember" in the "testmember" community
  Given the super admin is logged in
    And the super admin is on the "testmember" community group page
  When the super admin clicks on the "Members" tab
  Then the super admin should see a search input field with a placeholder "Search member"
  
  When the super admin types "testmember" in the search input field
  Then the search results should display the "testmember" account
  
  When the super admin clicks on the three dots (options menu) next to the "testmember" account
    And the super admin selects the "Assign to admin" option
    And the super admin confirms the action
  Then the "testmember" account should have admin privileges
  
  When the super admin clicks on the three dots (options menu) next to the "testmember" account
    And the super admin selects the "demote to member" option
    And the super admin confirms the action
  Then the "testmember" account should no longer have admin privileges
  
  When the super admin clicks on the three dots (options menu) next to the "testmember" account
    And the super admin selects the "Remove" option
    And the super admin confirms the action
  Then the "testmember" account should be removed from the "testmember" community group
  And the "testmember" account should no longer be visible in the members list

  Scenario: Super admin navigates to group settings and archives the "testmember" community group
  Given the super admin is logged in
    And the super admin is on the "Communities" page
  When the super admin clicks on the "testmember" community group
  Then the super admin should be taken to the "testmember" community group page
  
  When the super admin clicks on the "Settings" button
  Then the super admin should see the group settings options
  
  When the super admin sees the "Archive" option
    And the super admin selects the "Archive" option
    And the super admin confirms the action
  Then the "testmember" community group should be archived
    And the group should no longer be visible in the active community list

    Scenario: Super admin filters for public groups
  Given the super admin is logged in
    And the super admin is on the "Communities" page
  When the super admin clicks on the "Filters" button
  Then the filter options should be displayed
   When the super admin selects the "Public" filter
  Then only public groups should be displayed in the search results

  Scenario: Super admin filters for private groups
  Given the super admin is logged in
    And the super admin is on the "Communities" page
  When the super admin clicks on the "Filters" button
  Then the filter options should be displayed
  
  When the super admin selects the "Private" filter
  Then only private groups should be displayed in the search results

  Scenario: Super admin filters for archived groups
  Given the super admin is logged in
    And the super admin is on the "Communities" page
  When the super admin clicks on the "Filters" button
  Then the filter options should be displayed
  
  When the super admin selects the "Archived" filter
  Then only archived groups should be displayed in the search results

Scenario: Super admin unarchives the "testmember" community group
  Given the super admin is logged in
    And the super admin is on the "Communities" page
    And the super admin has filtered for archived groups
  When the super admin sees the "testmember" community group in the archived list
    And the super admin clicks on the three dots (options menu) next to the "testmember" group
    And the super admin selects the "Unarchive" option
    And the super admin confirms the action
  Then the "testmember" community group should disappear from the archived groups list
    And the "testmember" community group should be available in the active or appropriate filter list

    Scenario: Super admin deletes the "testmember" community group
  Given the super admin is logged in
    And the super admin is on the "Communities" page
  When the super admin clicks on the "testmember" community group
  Then the super admin should be taken to the "testmember" community group page
  
  When the super admin clicks on the "Settings" button
  Then the super admin should see the group settings options
  
  When the super admin selects the "Delete" option
    And the super admin confirms the action
  Then the "testmember" community group should be deleted
    And the group should no longer be visible in the communities list


  обычный мембер заходит в лругие группы
