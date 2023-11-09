function display_quest_result() {
    let params = new URL(window.location.href); // get URL of search bar
    let ID = params.searchParams.get("quest_id"); // get value for quest "id"

    db.collection("quests").doc(ID).get()  // get the data with the id from the collection called "quests"
        .then(doc => {
            var quest_name = doc.data().quest_name;          // get the quest name
            var quest_point = doc.data().point;      // get the point of the quest

            // update contents
            $(`.quest_name`).text(quest_name);
            $(`.quest_point`).text(`${quest_point} pt`);
        })
}

$(document).ready(function () {
    display_quest_result();
})