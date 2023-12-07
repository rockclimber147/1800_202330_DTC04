import { update_quest_cards, initialize_map, update_map, toggle_view } from './modules/quest_display.js';

$(document).ready(async function () {
      $('#quest_cards_go_here').hide()
      var quest_html_node
      var tag_html_node
      var user_doc
      var all_quest_tags = {};
      await init();

      /**
       * Loads all needed data
       */
      async function init() {

            navigator.geolocation.getCurrentPosition(async (position) => {                          // Get player position
                  var user_location = [position.coords.latitude, position.coords.longitude];

                  var map = await initialize_map(user_location);

                  await firebase.auth().onAuthStateChanged(async (user) => {
                        if (user) {
                              let quest_tag_db;
                              let quest_db;
                              [quest_html_node, tag_html_node, user_doc, quest_tag_db, quest_db] = await Promise.all
                                    ([$.get('reusable_html/quest_card.html'), // Quest card template from reusable html
                                    $.get('reusable_html/quest_tag.html'),   // Quest tag from reusable html
                                    db.collection("users").doc(user.uid).get(),
                                    db.collection('tags').get(),
                                    db.collection('quests').get()
                                    ]) // current user

                              quest_tag_db.forEach(tag_doc => {
                                    all_quest_tags[tag_doc.id] = tag_doc.data().tag_name;
                              })

                              update_map(map, quest_db, user_doc);
                              update_quest_cards(
                                    quest_db,
                                    quest_html_node,
                                    tag_html_node,
                                    user_location,
                                    all_quest_tags,
                                    user_doc
                              )
                        } else {
                              console.log('User not signed in!')
                              window.location.href = "index.html";
                        }
                  });
            });
      }

});

$('#view_toggle').on('click', toggle_view)

// Read the user's name from firestore and dynamically populate the welcome message
function insertNameFromFirestore() {
      let currentUser = ""
      // Check if the user is logged in:
      firebase.auth().onAuthStateChanged(user => {
            if (user) {
                  console.log(user.uid); // Let's know who the logged-in user is by logging their UID
                  currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
                  currentUser.get().then(userDoc => {
                        // Get the user name
                        var userName = userDoc.data().name.split(" ")[0];
                        console.log(userName);
                        document.getElementById("name-goes-here").innerText = userName;
                  })
            } else {
                  console.log('User not signed in!')
                  window.location.href = "login.html";
            }
      })
}

insertNameFromFirestore()
