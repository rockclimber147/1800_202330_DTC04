# Naborly

## 0. Related Links
* Deployed website: https://comp1800-dtc04-1214c.web.app/
* Figma: https://www.figma.com/file/UVVj9JKf3l5s2dm3ygJ6eH/Brainstorm-Smart-Cities
* Trello: https://trello.com/b/zBAQsD0b/1800202330dtc04

## 1. Project Description
State your app in a nutshell, or one-sentence pitch. Give some elaboration on what the core features are.  
This browser based web application to ... 

## 2. Names of Contributors
List team members and/or short bio's here... 
* Hello, my name is Irene and I am excited about this project because we get to make a web application from scratch.
* Hi! I'm Daylen Smith (rockclimber147), I'm looking forward to collaborating on this project! 
* I'm Tatsuya, and I'm excited for the project because I like challenging new things. I'll do my best. :)
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* MapboxGL
* Firebase Storage
* Geolocation

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Live serve index.html!

## 5. Known Bugs and Limitations
Here are some known bugs:
* Quest distances to user break when user does not consent to sharing their location
* Depending on PC, sometimes it takes a long time to load the map
* Quest ratings and cost displayed on quest details and cards are not dynamically generated from user reviews
* Quests cannot be sorted by user preferences yet 

## 6. Features for Future
What we'd like to build in the future:
* Implement location checking for completing quests
* Multi stage quests, or quests where the user has to visit several places
* Show level under the profile icon on the top right
* Users allowed to add quests after reaching a certain level
* Allowing users to add friends or have a community board
* Allow users to edit their completed quest list
* Record time stamp for the time of completion
	
## 7. Contents of Folder
Content of the project folder:

```
📦1800_202330_DTC04
 ┣ 📂.firebase
 ┃ ┗ 📜hosting..cache
 ┣ 📂.vscode
 ┃ ┗ 📜settings.json
 ┣ 📂images
 ┃ ┣ 📜complete-quest.png // picture for a popup - generated with chatgpt
 ┃ ┣ 📜completed_quest_pin.png // green quest pin - from favicon.com
 ┃ ┣ 📜drop-quest.png // picture for a popup - generated with chatgpt
 ┃ ┣ 📜person-icon.png // placeholder for profile picture - from google icon
 ┃ ┣ 📜quest-dropped.png // picture for a popup - generated with chatgpt
 ┃ ┣ 📜quest_pin.png // red quest pin - from favicon.com
 ┃ ┣ 📜theres-so-much-to-see.png // picture on landing page
 ┃ ┣ 📜treasure-box.png // picture for points - generated with chatgpt
 ┃ ┗ 📜treasure-map.png // picture for a pop up - generated with chatgpt
 ┣ 📂other_features // folder for storing unused html code
 ┃ ┣ 📜helpers.js // manual functions to organize quest
 ┃ ┗ 📜token.html // token for hosting 
 ┣ 📂reusable_html // templates for reusable html
 ┃ ┣ 📜bottom_nav.html 
 ┃ ┣ 📜quest_card.html 
 ┃ ┣ 📜quest_tag.html
 ┃ ┣ 📜top_nav_after_login.html
 ┃ ┣ 📜top_nav_before_login.html
 ┃ ┗ 📜top_nav_with_return_button.html
 ┣ 📂scripts
 ┃ ┣ 📂modules // stores reusable modules
 ┃ ┃ ┗ 📜quest_display.js // handles displaying quest for the three main pages
 ┃ ┣ 📜authentication.js
 ┃ ┣ 📜firebaseAPI_DTC04.js
 ┃ ┣ 📜main_home.js // initializes home page
 ┃ ┣ 📜main_quest_list.js // quest list view of the home page
 ┃ ┣ 📜main_search.js // search page
 ┃ ┣ 📜profile.js 
 ┃ ┣ 📜quest_completion.js // add points when press on complete button
 ┃ ┣ 📜quest_detail.js // quest detail page
 ┃ ┣ 📜review.js
 ┃ ┗ 📜skeleton.js // loads the reusable html
 ┣ 📂styles // styles correspond to html page
 ┃ ┣ 📜index.css
 ┃ ┣ 📜login.css
 ┃ ┣ 📜main.css
 ┃ ┣ 📜main_home.css
 ┃ ┣ 📜main_quest_list.css
 ┃ ┣ 📜main_search.css
 ┃ ┣ 📜profile.css
 ┃ ┣ 📜quest_completion.css
 ┃ ┣ 📜quest_detail.css
 ┃ ┣ 📜review.css
 ┃ ┣ 📜style.css
 ┃ ┗ 📜thanks.css
 ┣ 📜.firebaserc // hosting material
 ┣ 📜.gitignore
 ┣ 📜404.html
 ┣ 📜firebase.json
 ┣ 📜firestore.indexes.json
 ┣ 📜firestore.rules
 ┣ 📜index.html
 ┣ 📜login.html
 ┣ 📜main_home.html
 ┣ 📜main_quest_list.html
 ┣ 📜main_search.html
 ┣ 📜profile.html
 ┣ 📜quest_completion.html
 ┣ 📜quest_detail.html
 ┣ 📜README.md
 ┣ 📜review.html
 ┣ 📜storage.rules
 ┣ 📜template.html
 ┗ 📜thanks.html
```


