# Squad 😺
Hi! Squad is a mobile application for Android and iOS that builds a community for students to access Social, Food and Tutoring events happening in and around their college communities. 

                                               Contributors
            Brett Daley | Evan Dinh | Ghadah Ghuzayz | Vegan Lroy | Tapasya Sharma | Dominick White

## Source Code
The Squad project consists of:
 * A React Native client application, which can be ran locally [using the instructions below](#getting-started-with-the-app).  The source code can be found here: https://github.com/squadrepo/squad
 * A back-end system implemented and hosted in the AWS cloud.  It cannot be ran locally, but the source code for our AWS Lambda functions (which contain the vast majority of the business logic) can be found here: https://github.com/squadrepo/lambda

## Deliverable Contents
### Features Implemented
 * Student User Accounts, including: 
   * Account creation and login authentication
   * Multi-stage university email verification
   * Profile customization
   * Settings changes
 * Messaging, including: 
   * Private messages between users
   * Group message threads
   * User creation of chatrooms
   * Sharing of Event posts through messages
 * Navigation, including:
   * Tabs to filter the main feed of posts per post type
   * Buttons to create posts and access messaging
   * A slide-from-the-right tray to access account and profile settings
   * A pleasant purple aesthetic
 * Social Event Posts: 
   * Posts publicizing student-driven Social Events at a user's university, including the name, date and time, address, and description, can be created and displayed to other users
   * Users can RSVP to Social Events as a 'Yes' or a 'Maybe', with the number of interested users displayed on the posts
   * Users are added to a chatroom with other attendees upon RSVPing 'Yes'
   * Users can access a separate list of their RSVPed events to quickly refer back to them
   * Each post has a comments section
 * Food Event Posts:
   * Posts publicizing university- or community-organized events that provide free food, including the name, start and end times, address, and description, can be created and displayed to other users
   * Food Events are displayed on a map view within a specified radius of the user using their devices' location services -- or, if these services are disabled, within a radius of the user's university
   * Users can 'Thumbs Up' or 'Thumbs Down' a Food Event post based on its accuracy and appeal, with the number of these ratings displayed on the post
   * Each post has a comments section
 * Tutoring Profile Posts:
   * Posts publicizing the tutoring services of a student user, including their name, bio, hourly rate, subject specialties, classes taken, and schedule, can be created and displayed to other users
   * Users can request a scheduled tutoring session with a tutor, which the tutor can accept or reject
   * Users who take part in an accepted tutoring session can rate their tutor on a scale of 1 to 5 stars, with the average rating displayed on the tutor's profile

### Features Not Implemented
 * Social Media Sign-in
   * This feature turned out to be mutually exclusive with university email verification, a core part of our application, within the AWS service we used to handle some aspects of user authentication.
 * Gig-work Posts
   * We made the decision to cut this feature due to time restrictions early in the implementation phase.

### Known Issues
 * None!

# Getting Started with the App

## 1. Setup 
Clone the https://github.com/squadrepo/squad repository.  Copy the `aws-exports.js` file from the project submission into the root directory of the repository.  This file contains the necessary configuration to connect to our AWS-hosted back-end.

### Visual Studio Code
(include link to instructions for installing npm before telling them to npm install?) 


## 2. Downloading Expo

### Expo on Android Devices

1. To download Expo on Android devices, the first step would be to install the Expo app from the Google Play Store.

![image](https://github.com/squadrepo/squad/assets/45207318/be2d6d41-808d-412d-a2a2-e493ddc4207b)


2. After Expo has been installed, login to the app with same Expo credentials that you used in the Visual Studio code setup, you would see the following screen:

![image](https://github.com/squadrepo/squad/assets/45207318/1ebfc84c-52e3-44d9-9b90-2bcf8bd27f04)


### Expo on Android Emulator
Follow [Expo's documentation](https://docs.expo.dev/workflow/android-studio-emulator/) for downloading and setting up a virtual Android device with Android Studio. If you have never used Android Studio before, you can ignore the `Multiple adb versions` section.

Before [running the app](#running-the-app), open the Virtual Device Manager in Android Studio as described in the documentation, then press the Play button next to your configured virtual device as shown below:

![image](https://github.com/squadrepo/squad/assets/60754963/4a525b3f-8fbf-40f5-a5a3-da66a227e934)

This will start the Android emulator.  While [running the app](#running-the-app), choose option `a` to automatically open the app on this virtual device.  It may take a few minutes to load.

### Expo on iOS Devices or Emulator

Add iOS stuff here

# Running the App

After you have successfully installed Expo one of the above devices or emulators, start a terminal in VS Code in the root of your folder and then enter the command ` npx expo start ` . 

![image](https://github.com/squadrepo/squad/assets/45207318/9cdfb594-1735-4dfb-97d9-e42cfdcc28e3)

After the project starts in Expo, follow the instructions in the terminal to either the scan the QR code provided or click the the appropriate development server as shown below:

![image](https://github.com/squadrepo/squad/assets/60754963/9a212cbd-ae79-4162-8b2f-12941f5a8ac4)


You can also connect to the development server directly from the Expo app on your phone:

![image](https://github.com/squadrepo/squad/assets/45207318/d1f9aa9d-7663-4cde-a6c4-0eb064d4e137)

The application may take a few minutes to load on your device.
