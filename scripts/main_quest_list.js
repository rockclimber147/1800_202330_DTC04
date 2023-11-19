import {update_quest_cards, initialize_map, update_map, toggle_view} from './modules/quest_display.js';

$(document).ready(async function () {
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
            console.log('user_location in position', user_location)

            var map = await initialize_map(user_location);

            await firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    let quest_tag_db;
                    [quest_html_node, tag_html_node, user_doc, quest_tag_db] = await Promise.all
                        ([$.get('reusable_html/quest_card.html'), // Quest card template from reusable html
                        $.get('reusable_html/quest_tag.html'),   // Quest tag from reusable html
                        db.collection("users").doc(user.uid).get(),
                        db.collection('tags').get()
                        ]) // current user

                    quest_tag_db.forEach(tag_doc => {
                        all_quest_tags[tag_doc.id] = tag_doc.data().tag_name;
                    })

                    let user_accepted_quest_ids = user_doc.data().accepted_quests;
                    user_accepted_quest_ids.push('placeholder so firebase doesnt get mad')
                    console.log('current user accepted quests:', user_accepted_quest_ids);
                    let user_completed_quest_ids = user_doc.data().completed_quests;
                    user_completed_quest_ids.push('placeholder so firebase doesnt get mad')
                    console.log('current user completed quests:', user_completed_quest_ids);


                    let accepted_quests_db;
                    let completed_quests_db;
                    [accepted_quests_db, completed_quests_db] = await Promise.all([
                        db.collection('quests').where(firebase.firestore.FieldPath.documentId(), 'in', user_accepted_quest_ids).get(),
                        db.collection('quests').where(firebase.firestore.FieldPath.documentId(), 'in', user_completed_quest_ids).get()
                    ])
                    console.log('accepted quests db:', accepted_quests_db)
                    console.log('completed quests db:', completed_quests_db)
                    update_map(map, accepted_quests_db);
                    update_quest_cards(
                        accepted_quests_db, 
                        quest_html_node, 
                        tag_html_node, 
                        user_location,
                        all_quest_tags
                        )
                } else {
                    alert('User not signed in!')
                }
            });
        });
    }

});

$('#view_toggle').on('click', toggle_view)

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}