$(document).ready(function () {
    var quest_card_template = $('#quest_card_template');
    var quest_card_node = quest_card_template.prop('content');  // get quest templates ready

    var quest_card_template = $('#quest_tag_template');
    var quest_card_node = quest_card_template.prop('content'); // get tag template ready

    var quest_collection = db.collection('quests');
    var quest_tags = db.collection('tags');

    quest_collection.get()                                       //the collection called "quests"
        .then(all_quests=> {
            all_quests.forEach(doc => {                          //iterate through each doc and for each:
                var quest_name = doc.data().quest_name;          // get the quest name
                var quest_rating = doc.data().rate;              // get value of the "details" key
				var image_name = doc.data().image_name;          // get the name of the image
                var quest_description = doc.data().description;  // gets the description field
                var quest_tag_list = doc.data().tag_ids          // get the list of tag ids

                // Clone the contents of the quest card template element (not the parent template element)
                let new_quest_card = $(quest_card_node).children().clone();

                //update title and text and image
                new_quest_card.querySelector('.card-title').innerHTML = title;
                new_quest_card.querySelector('.card-length').innerHTML = hikeLength +"km";
                new_quest_card.querySelector('.card-text').innerHTML = details;
                new_quest_card.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
})

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