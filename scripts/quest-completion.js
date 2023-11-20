/**
 * Checks if the user is logged in and sends an alert if not. Gets the user doc and completed quest doc. Updates the users points based off the quest points.
 */
async function do_all() {
    let user_doc;
    await firebase.auth().onAuthStateChanged(async user => {
        // Check if user is signed in:
        if (user) {
            console.log(`user is logged in, user.uid: ${user.uid}`)

            let params = new URL(window.location.href);                              // get URL of search bar
            let ID = params.searchParams.get("quest_id");                            // get value for quest "id"
            // The following line waits for both the quest doc and the user doc at the same time!
            [user_doc, quest_doc] = await Promise.all([db.collection("users").doc(user.uid).get(),
                                                       db.collection("quests").doc(ID).get()]);
            console.log(`user_doc: ${user_doc}`)
            console.log(`quest_doc: ${quest_doc}`)

            var quest_name = quest_doc.data().quest_name;          // get the quest name
            var quest_point = quest_doc.data().point;      // get the point of the quest

            console.log(`quest points: ${quest_point}`)

            // update contents
            $(`.quest_name`).text(quest_name);
            $(`.quest_point`).text(`${quest_point} pt`);

            // update user points
            let current_user_points = user_doc.data().points;
            let current_user_level = user_doc.data().level;
            let points_to_next_level = get_next_level_points(current_user_level);
            console.log(`User points before adding quest points: ${current_user_points}`)
            current_user_points += quest_point
            console.log(`User points after adding quest points: ${current_user_points}`)

            $(`.total_quest_point`).text(`${current_user_points} pt`);
            let alert_user = false;
            // check if user has levelled up
            if (current_user_points > points_to_next_level){
                // increment user level
                current_user_level += 1;
                alert_user = true;
            }
            $(`.next_level_point`).text(`${get_next_level_points(current_user_level)} pt`);
            // update user in database
            db.collection('users').doc(user.uid).update({ 'points': current_user_points, 'level': current_user_level })
            if (alert_user){
                // alert user
                alert(`Congratulations! You're now level ${current_user_level}`)
            }

        } else {
            alert('user not logged in')
            // window.location.href = 'index.html'; // Add this later so user must be logged in
        }
    })
}

/**
 * Calculates the points required for the next level based on the current level
 * @param {Number} current_level The users current level
 * @returns The points rerquired to get the next level
 */
function get_next_level_points(current_level){
    return (current_level + 1) * 1000 * 2 ** current_level;
}

$(document).ready(function () {
    do_all();
})