/**
 * Checks if user is logged in -> gets quest from url -> populate quest info -> update based on user
 */
async function display_quest_info() {
    await firebase.auth().onAuthStateChanged(async (user) => {

        let params = new URL(window.location.href);                              // get URL of search bar
        let ID = params.searchParams.get("quest_id");                            // get value for quest "id"
        // Get  quest doc
        quest_doc = await db.collection("quests").doc(ID).get();

        var quest_name = quest_doc.data().quest_name;          // get the quest name
        var quest_rating = quest_doc.data().rate;              // get value of the "details" key
        var image_url = quest_doc.data().image_url;          // get the name of the image
        var quest_place = quest_doc.data().location_name;      // get the name of the location
        var quest_price = quest_doc.data().cost;               // get the price of the quest
        var quest_description = quest_doc.data().description;  // gets the description field
        var quest_point = quest_doc.data().point;             // gets the points field

        // update contents
        $(`.quest_name`).text(quest_name);
        $(`.quest_rating`).text('★'.repeat(quest_rating));
        $('.quest_image').attr('src', `${image_url}`);
        $(`.quest_place`).text(quest_place);
        $('.quest_price').text('$'.repeat(quest_price));
        $(`.quest_description`).text(quest_description);
        $(`#quest_point`).text(quest_point);

        /**
         * This snapshot updates the display whenever the user document changes
         */
        db.collection("users").doc(user.uid).onSnapshot((user_doc) => {
            let user_accepted_quests = user_doc.data().accepted_quests;
            let user_completed_quests = user_doc.data().completed_quests;
            let display_state;
            if (user_accepted_quests.includes(ID)) {
                display_state = 'quest is accepted';
            } else if (user_completed_quests.includes(ID)) {
                display_state = 'quest is completed';
            } else {
                display_state = 'quest is not yet accepted';
            }
            set_display_state(display_state)
            switch_buttons_and_pop_ups(user, ID);
        });
    });
}

/**
 * Switches the display based on the stage the quest is at (not accepted/accepted/completed)
 * @param {String} display_state THe state of the user
 */
function set_display_state(display_state) {
    switch (display_state) {
        case 'quest is accepted': {
            $('#accept').addClass('d-none')
            $('#drop').removeClass('d-none');
            $('#complete').removeClass('d-none');
            break;
        } case 'quest is completed': {
            $('#drop').addClass('d-none');
            $('#complete').addClass('d-none');
            $('#quest_is_completed').removeClass('d-none');
            $('.quest_review_button').removeClass('d-none');
            break;
        } case 'quest is not yet accepted': {
            $('#accept').removeClass('d-none')
            break;
        }
    }
}

/**
 *  Switches the buttons and pop-ups based on the stage the quest is at (not accepted/accepted/completed)
 */
function switch_buttons_and_pop_ups(user, ID) {
    // when "Accept" is clicked
    $('.quest_accept_button').click(function () {
        $('#quest_accepted_pop_up').removeClass('d-none'); // pop-up shows up
        $('#details_go_here').addClass('opacity-25'); // quest detail fades
        $('#reviewCardGroup').addClass('opacity-25');
        db.collection('users').doc(user.uid).update({
            accepted_quests: firebase.firestore.FieldValue.arrayUnion(ID)
        })
    })

    // when "Close" is clicked after accepting quest
    $('#quest_accepted_pop_up .pop_up_close_button').click(function () {
        $(this).closest('.pop_up').addClass('d-none'); // pop-up disappears
        $('.quest_accept_button').addClass('d-none'); // "Accept" button disappears
        $('#details_go_here').removeClass('opacity-25');
        $('#reviewCardGroup').removeClass('opacity-25');
    })

    // when "Drop" is clicked
    $('.quest_drop_button').click(function () {
        $('#drop_quest_pop_up').removeClass('d-none'); // pop-up shows up
        $('#details_go_here').addClass('opacity-25'); // quest detail fades
        $('#reviewCardGroup').addClass('opacity-25');
    })

    // when "Cancel" is clicked after "Drop" being clicked
    $('#drop_quest_pop_up .pop_up_cancel_button').click(function () {
        $(this).closest('.pop_up').addClass('d-none'); // pop-up disappears
        $('#details_go_here').removeClass('opacity-25');
        $('#reviewCardGroup').removeClass('opacity-25');
    })

    // when "Drop" is confirmed
    $('#drop_quest_pop_up .pop_up_confirm_button').click(function () {
        $(this).closest('.pop_up').addClass('d-none'); // pop-up disappears
        $('#quest_dropped_pop_up').removeClass('d-none'); // another pop-up shows up
        db.collection('users').doc(user.uid).update({
            accepted_quests: firebase.firestore.FieldValue.arrayRemove(ID)
        })
        $('#drop').addClass('d-none');
        $('#complete').addClass('d-none');
    })

    // when "Close" is clicked after dropping quest
    $('#quest_dropped_pop_up .pop_up_close_button').click(function () {
        $(this).closest('.pop_up').addClass('d-none'); // pop-up disappears
        $('.quest_accept_button').removeClass('d-none'); // "Accept" button shows up
        $('#details_go_here').removeClass('opacity-25');
        $('#reviewCardGroup').removeClass('opacity-25');
    })

    // when "Complete" is clicked
    $('.quest_complete_button').click(function () {
        $('#complete_quest_pop_up').removeClass('d-none'); // pop-up shows up
        $('#details_go_here').addClass('opacity-25'); // quest detail fades
        $('#reviewCardGroup').addClass('opacity-25');
    })

    // when "Cancel" is clicked after "Complete" being clicked
    $('#complete_quest_pop_up .pop_up_cancel_button').click(function () {
        $(this).closest('.pop_up').addClass('d-none'); // pop-up disappears
        $('#details_go_here').removeClass('opacity-25');
        $('#reviewCardGroup').removeClass('opacity-25');
    })

    // When complete quest is confirmed
    $(`#complete_quest_pop_up .pop_up_confirm_button`).click(async function(){
        await db.collection('users').doc(user.uid).update({
            accepted_quests: firebase.firestore.FieldValue.arrayRemove(ID), // Remove the quest from accepted quests
            completed_quests: firebase.firestore.FieldValue.arrayUnion(ID)  // Move to completed quests
        })
        window.location.href = `quest-completion.html?quest_id=${ID}`
    });

}

$(document).ready(function () {
    display_quest_info();
})