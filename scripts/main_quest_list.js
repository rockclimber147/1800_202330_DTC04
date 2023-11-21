import { update_quest_cards, initialize_map, update_map, toggle_view } from './modules/quest_display.js';

$(document).ready(async function () {
    $('#quest_cards_go_here').hide()
    var quest_html_node
    var tag_html_node
    var user_doc
    var all_quest_tags = {};

    var accepted_quests_db;
    var bookmarked_quests_db;

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
                    let user_completed_quest_ids = user_doc.data().bookmarked_quests;
                    user_completed_quest_ids.push('placeholder so firebase doesnt get mad')
                    console.log('current user completed quests:', user_completed_quest_ids);



                    [accepted_quests_db, bookmarked_quests_db] = await Promise.all([
                        db.collection('quests').where(firebase.firestore.FieldPath.documentId(), 'in', user_accepted_quest_ids).get(),
                        db.collection('quests').where(firebase.firestore.FieldPath.documentId(), 'in', user_completed_quest_ids).get()
                    ])
                    console.log('accepted quests db:', accepted_quests_db)
                    console.log('completed quests db:', bookmarked_quests_db)
                    update_map(map, accepted_quests_db);
                    update_quest_cards(
                        accepted_quests_db,
                        quest_html_node,
                        tag_html_node,
                        user_location,
                        all_quest_tags,
                        user_doc
                    )
                    $("#accepted_button").on('click', () => {
                        console.log('clicked accepted quest button')
                        accepted_button.prop('disabled', true)
                        accepted_button.addClass('pressed')
                        bookmarked_button.prop('disabled', false)
                        bookmarked_button.removeClass('pressed')
                        update_map(map, accepted_quests_db);
                        update_quest_cards(
                            accepted_quests_db,
                            quest_html_node,
                            tag_html_node,
                            user_location,
                            all_quest_tags,
                            user_doc
                        )
                    })
                    $("#bookmarked_button").on('click', () => {
                        console.log('clicked bookmarked quest button')
                        bookmarked_button.prop('disabled', true)
                        bookmarked_button.addClass('pressed')
                        accepted_button.prop('disabled', false)
                        accepted_button.removeClass('pressed')
                        update_map(map, bookmarked_quests_db);
                        update_quest_cards(
                            bookmarked_quests_db,
                            quest_html_node,
                            tag_html_node,
                            user_location,
                            all_quest_tags,
                            user_doc
                        )
                    })
                } else {
                    alert('User not signed in!')
                }
            });
        });
    }
    var accepted_button = $("#accepted_button")
    var bookmarked_button = $("#bookmarked_button")

    

});

$('#view_toggle').on('click', toggle_view)