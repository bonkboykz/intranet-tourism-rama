Feature: Departments Page

  Scenario: View Departments List
    Given the user is logged in
    When the user navigates to the departments page
    Then the user should see a list of all departments

  Scenario: View Department Details
    Given the user is on the departments page
    When the user clicks on a specific department
    Then the user should see the details of that department


========================================================================================


Scenario: Super admin views departments page
  Given the super admin is logged in
  When the super admin navigates to the "Departments" page
  Then the super admin should see a list of departments

  Scenario: Super admin creates a new department named "Test"
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin clicks on the "+ Department" button
  Then the super admin should see a form to create a new department
  
  When the super admin enters "Test" in the department name field
    And the super admin submits the form
  Then a new department named "Test" should be created
    And the new department "Test" should be visible in the list of departments

   Scenario: Super admin posts "test" in a department
  Given the super admin is logged in
    And the super admin is on the "Department" page
    And visit "test" department
  When the super admin clicks on the "Create Post" button
    And the super admin clicks on the placeholder in the text area
    And the super admin enters "test" in the text area
    And the super admin clicks the "Post" button
  Then the post with content "test" should be visible in the "test"  department feed


Scenario: Super admin posts "test" with an emoji in a department
  Given the super admin is logged in
    And the super admin is on the "Department" page
     And visit "test" department
  When the super admin clicks on the "Create Post" button
    And the super admin clicks on the placeholder in the text area
    And the super admin enters "test 😊" in the text area
    And the super admin clicks the "Post" button
  Then the post with content "test 😊" should be visible in the  "test" department feed


Scenario: Super admin posts "test" with an emoji and an image in a department
  Given the super admin is logged in
    And the super admin is on the "Department" page
     And visit "test" department
  When the super admin clicks on the "Create Post" button
    And the super admin clicks on the placeholder in the text area
    And the super admin enters "test 😊" in the text area
    And the super admin clicks the "Attach Image" button
    And the super admin selects "image1.png" from the file picker
    And the super admin clicks the "Post" button
  Then the post with content "test 😊" and image "image1.png" should be visible in the "test"  department feed

   Scenario: Super admin posts five images in a department
  Given the super admin is logged in
    And the super admin is on the "Department" page
     And visit "test" department
  When the super admin clicks on the "Create Post" button
    And the super admin clicks the "Attach Image" button
    And the super admin selects "image1.png" from the file picker
    And the super admin clicks the "Attach Image" button again
    And the super admin selects "image1.png" from the file picker
    And the super admin clicks the "Attach Image" button again
    And the super admin selects "image1.png" from the file picker
    And the super admin clicks the "Attach Image" button again
    And the super admin selects "image1.png" from the file picker
    And the super admin clicks the "Attach Image" button again
    And the super admin selects "image1.png" from the file picker
    And the super admin clicks the "Post" button
  Then the post with five images "image1.png" should be visible in the "test"  department feed

  Scenario: Super admin posts a video in the "test" department
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin navigates to the "test" department
    And the super admin clicks on the "Create Post" button
    And the super admin clicks the "Attach Video" button
    And the super admin selects "image700kb.mov" from the file picker
    And the super admin clicks the "Post" button
  Then the post with video "image700kb.mov" should be visible in the "test" department feed

Scenario: Super admin posts a file in the "test" department
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin navigates to the "test" department
    And the super admin clicks on the "Create Post" button
    And the super admin clicks the "Attach File" button
    And the super admin selects "testdoc.xlsx" from the file picker
    And the super admin clicks the "Post" button
  Then the post with file "testdoc.xlsx" should be visible in the "test" department feed
  
Scenario: Super admin posts with an "album" tag in the "test" department
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin navigates to the "test" department
    And the super admin clicks on the "Create Post" button
    And the super admin enters "This is a post with an album tag" in the text area
    And the super admin adds the tag "album" to the post
    And the super admin clicks the "Post" button
  Then the post with content "This is a post with an album tag" and tag "album" should be visible in the "test" department feed


  
  Scenario: Super admin posts with an "event" tag in the "test" department
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin navigates to the "test" department
    And the super admin clicks on the "Create Post" button
    And the super admin enters "This is a post with an event tag" in the text area
    And the super admin adds the tag "event" to the post
    And the super admin clicks the "Post" button
  Then the post with content "This is a post with an event tag" and tag "event" should be visible in the "test" department feed

  
  Scenario: Super admin posts an announcement in the "test" department
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin navigates to the "test" department
    And the super admin clicks on the "Create Post" button
    And the super admin enters "This is an announcement post" in the text area
    And the super admin marks the post as an announcement
    And the super admin clicks the "Post" button
  Then the post with content "This is an announcement post" should be visible in the "test" department feed
    And the post should be marked as an announcement


  Scenario: Super admin posts with downloadable content in the "test" department
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin navigates to the "test" department
    And the super admin clicks on the "Create Post" button
    And the super admin enters "This post contains downloadable content" in the text area
    And the super admin clicks the "Attach Image" button
    And the super admin selects "image1.png" from the file picker
    And the super admin clicks the "Attach Video" button
    And the super admin selects "video1.mov" from the file picker
    And the super admin clicks the "Attach File" button
    And the super admin selects "testdoc.xlsx" from the file picker
    And the super admin clicks the "Post" button
  Then the post with content "This post contains downloadable content" should be visible in the "test" department feed
    And the post should contain a downloadable image "image1.png"
    And the post should contain a downloadable video "video1.mov"
    And the post should contain a downloadable document "testdoc.xlsx"

    Scenario: Super admin views and tests all filters in the "test" department
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin navigates to the "test" department
    And the super admin sees a filter menu with options "All Posts", "Images", "Videos", "Documents", and "Announcements"
  Then the super admin clicks on the "All Posts" filter
    And the super admin sees all types of posts in the "test" department feed
  When the super admin clicks on the "Images" filter
    Then the super admin sees only posts with images in the "test" department feed
  When the super admin clicks on the "Videos" filter
    Then the super admin sees only posts with videos in the "test" department feed
  When the super admin clicks on the "Documents" filter
    Then the super admin sees only posts with documents in the "test" department feed
  When the super admin clicks on the "Announcements" filter
    Then the super admin sees only posts marked as announcements in the "test" department feed


Scenario: Super admin deletes all posts in the "test" department
  Given the super admin is logged in
    And the super admin is on the "Departments" page
  When the super admin navigates to the "test" department
    And the super admin sees multiple posts in the "test" department feed
  Then the super admin deletes each post one by one
  And the "test" department feed should be empty
    

Scenario: Super admin adds, promotes, demotes, and removes a member in the "test" department
    Given the super admin is logged in
      And the super admin is on the "Departments" page
    When the super admin navigates to the "test" department
      And the super admin clicks on the "Members" tab
      And the super admin adds "testmember" to the department
    Then "testmember" should be visible in the members list
    When the super admin promotes "testmember" to admin
    Then "testmember" should have admin privileges
    When the super admin demotes "testmember" back to member
    Then "testmember" should have member privileges
    When the super admin removes "testmember" from the department
    Then "testmember" should no longer be in the members list


Scenario: Super admin moves the "test" department to the top of the list
    Given the super admin is logged in
      And the super admin is on the "Departments" page
    When the super admin navigates to the "Departments" section
      And the super admin clicks on the three dots (menu) button next to the "test" department
      And the super admin selects "Ordering" from the menu
      And the super admin drags the "test" department to the top of the list
      And the super admin clicks the "Save" button
    Then the "test" department should be the first in the list on the "Departments" page

     Scenario: Super admin deletes the "test" department
    Given the super admin is logged in
      And the super admin is on the "Departments" page
    When the super admin navigates to the "Departments" section
      And the super admin selects the "test" department
      And the super admin clicks the "Delete Department" button
      And the super admin confirms the deletion
    Then the "test" department should no longer be visible in the "Departments" list






    

    
