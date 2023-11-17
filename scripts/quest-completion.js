async function do_all() {
    let user_doc;
    await firebase.auth().onAuthStateChanged(async user => {
        // Check if user is signed in:
        if (user) {
            console.log(`user is logged in, user.uid: ${user.uid}`)

            let params = new URL(window.location.href);                              // get URL of search bar
            let ID = params.searchParams.get("quest_id");                            // get value for quest "id"

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
        } else {
            alert('user not logged in')
            // window.location.href = 'index.html'; // Add this later so user must be logged in
        }
    })
    
    return user_doc;
}

$(document).ready(function () {
    do_all();
})