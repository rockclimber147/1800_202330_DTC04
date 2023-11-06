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

    async function convertTagIdToName(tag_id) {
        // this function receives tag_id and convert it to the name of the tag
        return db.collection("tags").doc(tag_id).get()
            .then(doc => {
                return doc.data().tag_name;
            });
    }


    async function displayQuestCardsDynamically(collection) {
        // this function get the data of quests and pass that to home-list.html
        // the argument should be "quests"
        let questCardTemplate = document.getElementById("questCardTemplate");  // Retrieve the HTML element with the ID "questCardTemplate" and store it in the questCardTemplate variable. 

        let allQuestsSnapshot = await db.collection(collection).get();  //the collection called "quests"
        for (const doc of allQuestsSnapshot.docs) {  //iterate thru each doc
            var quest_name = doc.data().quest_name;  // get value of the "quest_name" key
            var quest_stars = doc.data().rate;  // get value of the "rate" key
            var quest_cost = doc.data().cost;  // get value of the "cost" key
            var quest_location = doc.data().location;  // get value of the "location" key as a list including longitude and latitude
            var quest_distance = calculateDistance(current_location, quest_location);  // calculate the distance from current location
            var quest_tags = doc.data().tag_ids;  // get value of the "tag_ids" key as a list including tag ids
            var image_name = doc.data().image_name;  // get value of the "image_name" that leads to the image in images folder

            let new_card = questCardTemplate.content.cloneNode(true);

            // pass necessary data to the html
            new_card.querySelector('.quest_name').textContent = quest_name;
            new_card.querySelector('.quest_stars').textContent = `${'★'.repeat(quest_stars)}`;
            new_card.querySelector('.quest_cost').textContent = `${'$'.repeat(quest_cost)}`;
            new_card.querySelector('.quest_distance').textContent = quest_distance + "mi";
            new_card.querySelector('.quest_image').innerHTML = `<img class="w-100" src="./images/${image_name}.jpg" alt="">`;

            // convert tag ids to tag names
            let tagString = "";
            if (quest_tags[0] !== '') {
                for (let tag_id of quest_tags) {
                    let tagName = await convertTagIdToName(tag_id);
                    tagString += `<button class="d-inline-block rounded px-2 m-1 border-0 card_tag">${tagName}</button>`;
                }
            }

            // pass tag names to the html
            new_card.querySelector('.quest_tags').innerHTML = tagString;

            // identify the place to insert html
            document.getElementById(collection + "_go_here").appendChild(new_card);
        }
    }

    displayQuestCardsDynamically("quests");

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