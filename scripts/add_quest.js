const stars = document.querySelectorAll('.star'); //selects the stars from review.html
const money = document.querySelectorAll('.money') 

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

async function add_quest_to_database() {
    let user_doc;
    await firebase.auth().onAuthStateChanged(async user => {
        // Check if user is signed in:
        if (user) {
            console.log(`user is logged in, user.uid: ${user.uid}`)
            
            // Make sure user is ok with the current state of the quest
            let confirm_text = "Are you sure you want to add this quest?\nThis can't be undone!";
            // return if user doesn't want to add quest
            if (!confirm(confirm_text)){
                return;
            }

            // get fields from page
            quest_title = document.getElementById("add_quest_title").value
            var stars = document.querySelectorAll('.star');
            var money = document.querySelectorAll('.money')
            var quest_points = document.querySelector('#add_quest_points')
            var quest_description = document.getElementById("add_quest_description").value;
            let quest_rating = 0;
            let quest_cost = 0;

            stars.forEach((star) => {
                if (star.textContent === 'star') {
                    quest_rating++;
                }
            });
            money.forEach((money) => {
                if (money.textContent === 'attach_money') {
                    quest_cost++;
                }
            });

            let quest_keywords = get_keywords_from_name(quest_title);
        } 
    })
}

function get_keywords_from_name(quest_name){
    return quest_name.lower().split(' ');
}
