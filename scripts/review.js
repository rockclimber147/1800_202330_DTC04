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