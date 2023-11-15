function saveQuestDocumentIDAndRedirect(){
      let params = new URL(window.location.href) //get the url from the search bar
      let ID = params.searchParams.get("quest_id");
      localStorage.setItem('questDocID', ID);
      window.location.href = 'review.html';
}

var questDocID = localStorage.getItem("questDocID");    //visible to all functions on this page

function getQuestName(id) {
      db.collection("quests")
            .doc(id)
            .get()
            .then((thisQuest) => {
                  var questName = thisQuest.data().quest_name;
                  document.getElementById("questName").innerHTML = questName;
            });
}

getQuestName(questDocID);

// Add this JavaScript code to make stars clickable

// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');
const money = document.querySelectorAll('.money')

// Demo 10 Step 2.7
// Iterate through each star element
stars.forEach((star, index) => {
      // Add a click event listener to the current star
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
      // Add a click event listener to the current star
      money.addEventListener('click', () => {
            // Fill in clicked star and stars before it
            for (let i = 0; i <= index; i++) {
                  // Change the text content of stars to 'star' (filled)
                  document.getElementById(`money${i + 1}`).textContent = 'attach_money';
            }
      });
});

function writeReview() {
      console.log("inside write review");
      let questTitle = document.getElementById("title").value;
      let questLevel = document.getElementById("level").value;
      let questDescription = document.getElementById("description").value;

      // Get the star rating
      // Get all the elements with the class "star" and store them in the 'stars' variable
      const stars = document.querySelectorAll('.star');
      const money = document.querySelectorAll('.money')
      // Initialize a variable 'questRating' to keep track of the rating count
      let questRating = 0;
      let questCost = 0;
      // Iterate through each element in the 'stars' NodeList using the forEach method
      stars.forEach((star) => {
            // Check if the text content of the current 'star' element is equal to the string 'star'
            if (star.textContent === 'star') {
                  // If the condition is met, increment the 'questRating' by 1
                  questRating++;
            }})
      money.forEach((money) => {
            // Check if the text content of the current 'star' element is equal to the string 'star'
            if (money.textContent === 'attach_money') {
                  // If the condition is met, increment the 'questRating' by 1
                  questCost++;
            }
      });

      console.log(questTitle, questLevel, questDescription, questRating, questCost);

      var user = firebase.auth().currentUser;
      if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            var userID = user.uid;

            // Get the document for the current user.
            db.collection("reviews").add({
                  questDocID: questDocID,
                  userID: userID,
                  title: questTitle,
                  level: questLevel,
                  description: questDescription,
                  rating: questRating, // Include the rating in the review
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                  window.location.href = "thanks.html"; // Redirect to the thanks page
            });
      } else {
            console.log("No user is signed in");
            window.location.href = 'review.html';
      }
}

// Demo 10 - Populating reviews

function populateReviews() {
      console.log("test");
      let questCardTemplate = document.getElementById("reviewCardTemplate");
      let questCardGroup = document.getElementById("reviewCardGroup");

      let params = new URL(window.location.href); // Get the URL from the search bar
      let quest_id = params.searchParams.get("quest_id");

      // Double-check: is your collection called "Reviews" or "reviews"?
      db.collection("reviews")
            .where("questDocID", "==", quest_id)
            .get()
            .then((allReviews) => {
                  reviews = allReviews.docs;
                  console.log(reviews);
                  reviews.forEach((doc) => {
                        var title = doc.data().title;
                        var level = doc.data().level;
                        var description = doc.data().description;
                        var time = doc.data().timestamp.toDate();
                        var rating = doc.data().rating; // Get the rating value
                        console.log(rating)

                        console.log(time);

                        let reviewCard = questCardTemplate.content.cloneNode(true);
                        reviewCard.querySelector(".title").innerHTML = title;
                        reviewCard.querySelector(".time").innerHTML = new Date(
                              time
                        ).toLocaleString();
                        reviewCard.querySelector(".level").innerHTML = `Level: ${level}`;
                        reviewCard.querySelector(".description").innerHTML = `Description: ${description}`;

                        // Populate the star rating based on the rating value

                        // Initialize an empty string to store the star rating HTML
                        let starRating = "";
                        // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
                        for (let i = 0; i < rating; i++) {
                              starRating += '<span class="material-icons">star</span>';
                        }
                        // After the first loop, this second loop runs from i=rating to i<5.
                        for (let i = rating; i < 5; i++) {
                              starRating += '<span class="material-icons">star_outline</span>';
                        }
                        reviewCard.querySelector(".star-rating").innerHTML = starRating;

                        questCardGroup.appendChild(reviewCard);
                  });
            });
}

populateReviews();