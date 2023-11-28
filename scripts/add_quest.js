var tag_name_to_id_map;

async function init() {
    const stars = document.querySelectorAll('.star'); //selects the stars from review.html
    const money = document.querySelectorAll('.money')
    var tag_db;
    tag_name_to_id_map = {};
    // Iterate through each star element
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Fill in clicked star and stars before it
            for (let i = 0; i <= index; i++) {
                // Change the text content of stars to 'star' (filled)
                document.getElementById(`star${i + 1}`).textContent = 'star';
            }
        });
    });

    // Iterate through each money element
    money.forEach((money, index) => {
        money.addEventListener('click', () => {
            // Fill in clicked star and stars before it
            for (let i = 0; i <= index; i++) {
                document.getElementById(`money${i + 1}`).textContent = 'attach_money';
            }
        });
    });

    tag_db = await db.collection('tags').get();

    tag_db.forEach((doc) => {
        tag_name_to_id_map[doc.data().tag_name] = doc.id;
        $("#add_quest_checkboxes").append(
            `<div class="form-check">
                <input type="checkbox" class="form-check-input" id="${doc.id}" name="tagcheckbox"/>
                <label id="checkbox_${doc.id}" for="tagcheckbox">${doc.data().tag_name}</label>  
            </div>`)
    })
}

init();

async function add_quest_to_database() {
    console.log('clicked add quest')
    let user_doc;
    await firebase.auth().onAuthStateChanged(async user => {
        // Check if user is signed in:
        if (user) {
            console.log(`user is logged in, user.uid: ${user.uid}`)

            // Make sure user is ok with the current state of the quest
            let confirm_text = "Are you sure you want to add this quest?\nThis can't be undone!";
            // return if user doesn't want to add quest
            if (!confirm(confirm_text)) {
                return;
            }

            // get fields from page
            quest_title = document.getElementById("add_quest_title").value
            var stars = document.querySelectorAll('.star');
            var money = document.querySelectorAll('.money')
            var quest_points = parseInt(document.querySelector('#add_quest_points').value)
            console.log(quest_points)
            var quest_description = document.getElementById("add_quest_description").value;
            console.log(quest_description)
            let quest_rating = 0;
            let quest_cost = 0;
            let quest_image = document.querySelector('#add_quest_image').value
            console.log(quest_image )
            let quest_latitude = parseFloat(document.querySelector('#add_quest_latitude').value)
            console.log(quest_latitude)
            let quest_longitude = parseFloat(document.querySelector('#add_quest_longitude').value)
            console.log(quest_longitude)
            let quest_location_name = document.querySelector('#add_quest_location_name').value
            console.log(quest_location_name)

            stars.forEach((star) => {
                if (star.textContent === 'star') {
                    quest_rating++;
                }
            });

            console.log(quest_rating)

            money.forEach((money) => {
                if (money.textContent === 'attach_money') {
                    quest_cost++;
                }
            });

            console.log(quest_cost)

            let quest_tag_ids = []
            document.querySelectorAll('input[name="tagcheckbox"]:checked').forEach((checkbox) => {
                quest_tag_ids.push(checkbox.id.replace('_'))
            });
            console.log(quest_tag_ids)
            // Do stuff with field values

            let quest_keywords = quest_title.toLowerCase().split(' ');

            db.collection("quests").add({
                quest_name: quest_title,
                location_name: quest_location_name,
                location: [quest_latitude, quest_longitude], // copy from Google map
                rate: quest_rating, //integer between 1 to 5 (decide as you want!)
                cost: quest_cost, // integer between 1 to 5 (1: $0, 2: ~$15, 3: ~$30, 4: ~$50, 5: $50~)
                description: quest_description,
                tag_ids: quest_tag_ids, // uncomment helper.js at main_home.html and run log_tags() to see the list of tags (or you can copy tag_ids from firebase)
                image_url: quest_image, // right click on the image at google image search and then select "Copy Image Address"
                point: quest_points, // integer which is multiple of 50 (if required time to complete the quest from downtown is: ~30min => ~500pt, ~1hr => ~700pt, ~2hr => ~1000pt )
                keywords: quest_keywords, // array of string (each string is a keyword)
            })
        }
    })
}
