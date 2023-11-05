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
        quest_name: "Reveal mysteries of human beings!",
        location_name: "Museum of Anthropology",
        location: [49.26961348051608, -123.25948381904506],
        rate: 5,
        cost: 2,
        description: "The Museum of Anthropology at the University of British Columbia (UBC) campus in Vancouver, British Columbia, Canada displays world arts and cultures, in particular works by First Nations of the Pacific Northwest. As well as being a major tourist destination, MOA is a research and teaching museum, where UBC courses in art, anthropology, archaeology, conservation, and museum studies are given. MOA houses close to 50,000 ethnographic objects, as well as 535,000 archaeological objects in its building alone.",
        tag_ids: ["j6MrxNTQVsVDqZZqKY3A"],
        image_name: "Museum of Anthropology",
    })

    questRef.add({
        quest_name: "Have a coffee at the top of Vancouver!",
        location_name: "Lupin's Cafe - Grouse Mountain",
        location: [49.37925579153738, -123.08358387425162],
        rate: 5,
        cost: 1,
        description: "Located on the main floor of the Peak Chalet, Lupins Café offers stunning decorative alpine features like high cedar beams and copper lights that emit a soft glow in the evening.",
        tag_ids: ["D4NeTY30U09lD3TemV4Y", "YFk0Z2I5rwxqH9ShsR8Z", "ntk5nt0wadhVx4A17Weu"],
        image_name: "Lupin's Cafe",
    })

    questRef.add({
        quest_name: "Let's see the world's narrowest commercial building!",
        location_name: "Sam Kee Building",
        location: [49.28054048497626, -123.10476746176596],
        rate: 2,
        cost: 1,
        description: "The Sam Kee Building at 8 West Pender Street is an internationally renowned narrow building, including a lower-level extension beneath the sidewalk, located at the traditional entry to Vancouver's historic Chinatown.",
        tag_ids: ["j6MrxNTQVsVDqZZqKY3A"],
        image_name: "Sam Kee Building",
    })

    questRef.add({
        quest_name: "Twisted tower - Can you believe it?",
        location_name: "Vancouver House",
        location: [49.27499326902219, -123.1310302325351],
        rate: 2,
        cost: 1,
        description: "Vancouver House is a neo-futurist residential skyscraper in Vancouver, British Columbia, Canada. Construction of the skyscraper began in 2016 and was expected to be finished by the end of 2019, but completion was postponed to summer of 2020. On April 15, 2021, a water pipe on the 29th floor burst and damaged 17 units as well as several elevators.",
        tag_ids: [""],
        image_name: "Vancouver House",
    })
}
