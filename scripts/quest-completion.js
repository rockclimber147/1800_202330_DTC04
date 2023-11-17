async function get_user_doc(){
    let user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
        return await db.collection("users").doc(user.uid).get();
    } else {
        alert('user not logged in')
        // window.location.href = 'index.html'; // Add this later so user must be logged in
    }
}

async function do_all(){
    let params = new URL(window.location.href);                              // get URL of search bar
    let ID = params.searchParams.get("quest_id");                            // get value for quest "id"
    // Waits for both the quest doc and user doc at the same time and continues when both are received
    [user_doc, quest_doc] = await Promise.all([get_user_doc(), db.collection("quests").doc(ID).get()]);

    console.log(`User name: ${user_doc.name}`)

    var quest_name = quest_doc.data().quest_name;          // get the quest name
    var quest_point = quest_doc.data().point;      // get the point of the quest

    console.log(`quest points: ${quest_point}`)

    // update contents
    $(`.quest_name`).text(quest_name);
    $(`.quest_point`).text(`${quest_point} pt`);
}

$(document).ready(function () {
    do_all();
})