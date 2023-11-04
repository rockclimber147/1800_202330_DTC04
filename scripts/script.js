$(document).ready(function () {
    // Load bottom navbar to page
    $.get("./reusable html/bottom_nav.html", function (data) {
        $('#reusable_footer').html(data);
    });
    // load top navbar to page
    $.get("./reusable html/top_nav.html", function (data) {
        $('#reusable_header').html(data);
    });
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

//------------------------------------------------
// Prints tag IDs and their corresponding tag names to console
//-------------------------------------------------

function log_tags() {
    db.collection('tags').get()
    .then(all_tags => {
        all_tags.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().tag_name);
    })
    });
}

function writeQuests() {
    //define a variable for the collection you want to create in Firestore to populate data
    var questRef = db.collection("quests");

    questRef.add({
        quest_name: "",
        location_name: "",
        location: [,],
        rate: ,
        cost: ,
        description: ,
        tag_ids: [""],
    })

    questRef.add({
        quest_name: "",
        location_name: "",
        location: [,],
        rate: ,
        cost: ,
        description: ,
        tag_ids: [""],
    })

    questRef.add({
        quest_name: "",
        location_name: "",
        location: [,],
        rate: ,
        cost: ,
        description: ,
        tag_ids: [""],
    })

    questRef.add({
        quest_name: "",
        location_name: "",
        location: [,],
        rate: ,
        cost: ,
        description: ,
        tag_ids: [""],
    })
}
