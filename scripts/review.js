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