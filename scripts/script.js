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
        quest_name: "Let's explore a tiny Japan!",
        location_name: "Nitobe Memorial Garden",
        location: [49.26645018574508, -123.25968546090411],
        rate: 3,
        cost: 2,
        description: "The Nitobe Memorial Garden is a 2.5 acre (one hectare) traditional Japanese garden located at the University of British Columbia, just outside the city limits of Vancouver, British Columbia, Canada. Although it is part of the UBC Botanical Garden, Nitobe Memorial Garden is located next to UBC's Asian Centre, two kilometers from the main UBC Botanical Garden.",
        tag_ids: ["D4NeTY30U09lD3TemV4Y"],
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
