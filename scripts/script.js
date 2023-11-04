$(document).ready(function () {
    // Load bottom navbar to page
    $.get("./reusable html/bottom_nav.html", function (data) {
        $('#reusable_footer').html(data);
    });
    // load top navbar to page
    $.get("./reusable html/top_nav.html", function (data) {
        $('#reusable_header').html(data);
    });

    // Quest tags to be randomly inserted into quest cards
    questTags = ['Restaurant', 'Hiking', 'Gallery', 'Museum', 'Park', 'Bar', 'Music', 'History', 'Concert']

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getRandomIntBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    function generateRandomQuestCard() {
        return `<div class="card w-100 mb-2 container-fluid p-sm-3">
            <div class="row">
                <div class="card_body col-8 p-2">
                    <h5 class="card-title">Quest_Name</h5>
                    <div class="row card-properties px-2">
                        <div class="col-5 px-1 py-1">${'★'.repeat((getRandomInt(5) + 1))}</div>
                        <div class="col-3 px-2 py-1">${'$'.repeat((getRandomInt(3) + 1))}</div>
                        <div class="col-4 px-2 py-1">${(Math.random() * 10).toFixed(1)} mi</div>
                    </div>
                    <div class="justify-content-start card_properties">
                        ${generateTags(getRandomInt(3) + 1)}
                    </div>
                </div>
                <div class="img-container col-4 d-flex align-items-center">
                    <img class="w-100" src="https://picsum.photos/id/${getRandomIntBetween(200, 255)}/100/100" alt="">
                </div>
            </div>
        </div>`
    }

    function generateTags(tagCount) {
        tagIDs = []
        tags = 0;
        while (tags < tagCount) {
            randInt = getRandomInt(questTags.length)
            if (!tagIDs.includes(randInt)) {
                tagIDs.push(randInt);
                tags++;
            }
        }
        tagString = ""
        for (i = 0; i < tagIDs.length; i++) {
            tagString += `<button class="d-inline-block rounded px-2 m-1 border-0 card_tag">${questTags[tagIDs[i]]}</button>`;
        }
        return tagString;
    }

    for (let i = 0; i < getRandomIntBetween(4, 10); i++) { $('#quest_card_container').append(generateRandomQuestCard()); }
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