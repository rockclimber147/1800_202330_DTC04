$(document).ready(function () {
    // set current location
    let current_location = [49.28377398804422, -123.11537661105989] // to be changed in future

    function calculateDistance(current, destination){
        // this function receives two arrays that represent coordinates and returns the distance in miles

        // calculate difference in longitude and latitude
        let longitude_difference = current[0] - destination[0]
        let latitude_difference = current[1] - destination[1]

        // calculate distance using Pythagorean theorem and convert it to mile
        let distance = ((longitude_difference ** 2 + latitude_difference ** 2) ** 0.5 * 60).toFixed(1)
        return distance;
    }

    function convertTagIdToName(tag_id) {
        return db.collection("tags").doc(tag_id).get().tag_name;
    }

    function displayQuestCardsDynamically(collection) {
        let questCardTemplate = document.getElementById("questCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable.

        db.collection(collection).get()
            .then(allQuests => {
                allQuests.forEach(doc => {
                    var quest_name = doc.data().quest_name;
                    var quest_stars = doc.data().rate;
                    var quest_cost = doc.data().cost;
                    var quest_location = doc.data().location;
                    var quest_distance = calculateDistance(current_location, quest_location);
                    var quest_tags = doc.data().tag_ids;
                    var image_name = doc.data().image_name;

                    let new_card = questCardTemplate.content.cloneNode(true);

                    new_card.querySelector('.quest_name').innerHTML = quest_name;
                    new_card.querySelector('.quest_stars').innerHTML = `${'★'.repeat(quest_stars)}`;
                    new_card.querySelector('.quest_cost').innerHTML = `${'$'.repeat(quest_cost)}`;
                    new_card.querySelector('.quest_distance').innerHTML = quest_distance + "mi";
                    new_card.querySelector('.quest_image').innerHTML = `<img class="w-100" src="./images/${image_name}.jpg" alt="">`;

                    document.getElementById(collection + "_go_here").appendChild(new_card);
                })
            })
    }

    displayQuestCardsDynamically("quests")


    // Quest tags to be randomly inserted into quest cards
    // questTags = ['Restaurant', 'Hiking', 'Gallery', 'Museum', 'Park', 'Bar', 'Music', 'History', 'Concert']

    // function getRandomInt(max) {
    //     return Math.floor(Math.random() * max);
    // }

    // function getRandomIntBetween(min, max) {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    // }

    // function generateRandomQuestCard() {
    //     return `<div class="card w-100 mb-2 container-fluid p-sm-3">
    //         <div class="row">
    //             <div class="card_body col-8 p-2">
    //                 <h5 class="card-title">Quest_Name</h5>
    //                 <div class="row card-properties px-2">
    //                     <div class="col-5 px-1 py-1">${'★'.repeat((getRandomInt(5) + 1))}</div>
    //                     <div class="col-3 px-2 py-1">${'$'.repeat((getRandomInt(3) + 1))}</div>
    //                     <div class="col-4 px-2 py-1">${(Math.random() * 10).toFixed(1)} mi</div>
    //                 </div>
    //                 <div class="justify-content-start card_properties">
    //                     ${generateTags(getRandomInt(3) + 1)}
    //                 </div>
    //             </div>
    //             <div class="img-container col-4 d-flex align-items-center">
    //                 <img class="w-100" src="https://picsum.photos/id/${getRandomIntBetween(200, 255)}/100/100" alt="">
    //             </div>
    //         </div>
    //     </div>`
    // }

    // function generateTags(tagCount) {
    //     tagIDs = []
    //     tags = 0;
    //     while (tags < tagCount) {
    //         randInt = getRandomInt(questTags.length)
    //         if (!tagIDs.includes(randInt)) {
    //             tagIDs.push(randInt);
    //             tags++;
    //         }
    //     }
    //     tagString = ""
    //     for (i = 0; i < tagIDs.length; i++) {
    //         tagString += `<button class="d-inline-block rounded px-2 m-1 border-0 card_tag">${questTags[tagIDs[i]]}</button>`;
    //     }
    //     return tagString;
    // }

    // for (let i = 0; i < getRandomIntBetween(4, 10); i++) { $('#quest_card_container').append(generateRandomQuestCard()); }
})