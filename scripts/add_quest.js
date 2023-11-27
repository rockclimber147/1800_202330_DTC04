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

            quest_title = document.getElementById("add_quest_title").value
            const stars = document.querySelectorAll('.star');
            const money = document.querySelectorAll('.money')
            const questpoints = document.querySelector('#add_quest_points')

        } 
    })
}

function add_quest() {
    console.log("inside add quest");
    let addquestTitle = document.getElementById("add_quest_title").value;
    let addquestDescription = document.getElementById("add_quest_description").value;

    // Initialize a variable 'questRating' and 'questCost' to keep track of the rating and cost
    let addquestRating = 0;
    let addquestCost = 0;

    // Iterate through each element in the 'stars' NodeList using the forEach method
    stars.forEach((star) => {
        if (star.textContent === 'star') {
            addquestRating++;
        }
    });
    money.forEach((money) => {
        if (money.textContent === 'attach_money') {
            addquestCost++;
        }
    });

    var user = firebase.auth().currentUser;
    if (user) {
        db.collection("users").doc(user.uid);
        var userID = user.uid;

        // Get the document for the current user.
        db.collection("").add({
            questDocID: questDocID,
            userID: userID,
            title: questTitle,
            level: questLevel,
            description: questDescription,
            rating: questRating,
            cost: questCost,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'review.html';
    }
}
