/**
 * Saves the quest_id from the URL and saves this as a value for 'questDocID' into local storage - redirects to review.html 
 */
function saveQuestDocumentIDAndRedirect() {
      let params = new URL(window.location.href) //get the url from the search bar - new creates an object
      let ID = params.searchParams.get("quest_id"); 
      localStorage.setItem('questDocID', ID); // set a new key 'questDocID' and value of ID into local storage
      window.location.href = 'review.html'; //Change the URL into the review.html
}

//Get the questDocID from local storage and make it into a global variable
var questDocID = localStorage.getItem("questDocID");    



/**
 * Get the quest documents from firestore, THEN do this anonymous function that takes a parameter thisQuest (quest document) and saves the quest_name as a variable questName.  After, change the DOM where id is questName to the collected data.
 * @param {*} id 
 */
function getQuestName(id) {
      db.collection("quests")
            .doc(id)
            .get()
            .then((thisQuest) => {
                  var questName = thisQuest.data().quest_name;
                  document.getElementById("questName").innerHTML = questName;
            });
}

//Only when the URL has review.html, should we execute getQuestName (title of the review page)
if (window.location.href.includes("review.html")) { 
      getQuestName(questDocID);
}


// Make stars and dollar signs clickable
const stars = document.querySelectorAll('.star'); //selects the stars from review.html
const money = document.querySelectorAll('.money') //selects the money from review.html

// Iterate through each star element
// Callback function is a function passed into another function
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

/**
 * Read the submitted review form values and update it onto firestore
 */
function writeReview() {
      console.log("inside write review");
      // Saving all the written values in the review form and store them into variables
      let questTitle = document.getElementById("title").value;
      let questLevel = document.getElementById("level").value;
      let questDescription = document.getElementById("description").value;

      // Initialize a variable 'questRating' and 'questCost' to keep track of the rating and cost
      let questRating = 0;
      let questCost = 0;

      // Iterate through each element in the 'stars' NodeList using the forEach method
      stars.forEach((star) => {
            if (star.textContent === 'star') {
                  questRating++;
            }
      });
      money.forEach((money) => {
            if (money.textContent === 'attach_money') {
                  questCost++;
            }
      });

      var user = firebase.auth().currentUser;
      if (user) {
            db.collection("users").doc(user.uid);
            var userID = user.uid;

            // Get the document for the current user.
            db.collection("reviews").add({
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

/**
 * Makes the previously submitted reviews show up in the corresponding quest detail page
 */
function populateReviews() {
      // Saving the templates into a variable
      let questCardTemplate = document.getElementById("reviewCardTemplate");
      let questCardGroup = document.getElementById("reviewCardGroup");

      let params = new URL(window.location.href); // Get the URL from the search bar
      let quest_id = params.searchParams.get("quest_id"); //Get the quest id from the URL

      // In the firestore reviews collection where the localStorage variable (questDocID) is the quest id 
      db.collection("reviews")
            .where("questDocID", "==", quest_id)
            .get()
            .then((allReviews) => {
                  reviews = allReviews.docs;
                  console.log(reviews);
                  // Saving the firestore values into variables
                  reviews.forEach((doc) => {
                        var title = doc.data().title;
                        var level = doc.data().level;
                        var description = doc.data().description;
                        var time = doc.data().timestamp.toDate();
                        var rating = doc.data().rating; // Get the rating value
                        var cost = doc.data().cost

                        // Cloning the review card contents into a variable
                        let reviewCard = questCardTemplate.content.cloneNode(true);

                        reviewCard.querySelector(".title").innerHTML = title;
                        reviewCard.querySelector(".time").innerHTML = new Date(time).toLocaleString();
                        reviewCard.querySelector(".level").innerHTML = `Level: ${level}`;
                        reviewCard.querySelector(".description").innerHTML = `Description: ${description}`;

                        // Populate the star rating based on the rating value

                        let starRating = "";
                        // This loop stores filled stars
                        for (let i = 0; i < rating; i++) {
                              starRating += '<span class="material-icons">star</span>';
                        }
                        // This loop stores empty stars
                        for (let i = rating; i < 5; i++) {
                              starRating += '<span class="material-icons">star_outline</span>';
                        }
                        // Replace the part in the review card where it has the .star-rating class with the stars
                        reviewCard.querySelector(".star-rating").innerHTML = starRating;


                        let costRating = "";
                        for (let i = 0; i < cost; i++) {
                              costRating += '<span class="material-icons">attach_money</span>';
                        }

                        for (let i = cost; i < 5; i++) {
                              costRating += '<span></span>';
                        }

                        // FIXED THE BUG! I was appending reviewCard twice

                        reviewCard.querySelector(".cost-rating").innerHTML = costRating;

                        questCardGroup.appendChild(reviewCard);
                  });
            });
}

populateReviews();