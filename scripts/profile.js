
// Demo 10 Step 1.2 - Reading the user data from Firestore and populating the form
var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
      firebase.auth().onAuthStateChanged(user => {
            // Check if user is signed in:
            if (user) {

                  //go to the correct user document by referencing to the user uid
                  currentUser = db.collection("users").doc(user.uid)
                  //get the document for current user.
                  currentUser.get()
                        .then(userDoc => {
                              //get the data fields of the user
                              var name = userDoc.data().name;
                              var username = userDoc.data().username;
                              var email = userDoc.data().email;
                              var birthdate = userDoc.data().birthdate;
                              var address = userDoc.data().address;
                              var city = userDoc.data().city;
                              var province = userDoc.data().province;
                              var country = userDoc.data().country;

                              // var level = userDoc.data().level;
                              // var preference = userDoc.data().preference;
                              // var points_earned = userDoc.data().points_earned;
                              // var accepted_quests = userDoc.data().accepted_quests;
                              // var completed_quests = userDoc.data().completed_quests_quests;

                              //if the data fields are not empty, then write them in to the form.
                              if (userName != null) {
                                    document.getElementById("name").value = name;
                              }
                              if (userSchool != null) {
                                    document.getElementById().value = userSchool;
                              }
                              if (userCity != null) {
                                    document.getElementById().value = userCity;
                              }

                              if (userName != null) {
                                    document.getElementById("nameInput").value = userName;
                              }
                              if (userSchool != null) {
                                    document.getElementById("schoolInput").value = userSchool;
                              }
                              if (userCity != null) {
                                    document.getElementById("cityInput").value = userCity;
                              }
                              
                              



                        })
            } else {
                  // No user is signed in.
                  console.log("No user is signed in");
            }
      });
}

//call the function to run it 
populateUserInfo();

// Demo 10 Step 1.3 Activate the edit button
function editUserInfo() {
      //Enable the form fields
      document.getElementById('personalInfoFields').disabled = false;
}

// Demo 10 Step 1.4 Activate the save button
function saveUserInfo(){
      // get information entered by user
      userName = document.getElementById("nameInput").value
      userSchool = document.getElementById("schoolInput").value
      userCity = document.getElementById("cityInput").value


      currentUser.update({
            name: userName,
            school: userSchool,
            // there is no city in the firestore but that is okay because update will create the key
            city: userCity
      })
      .then(() => {
            console.log("Document successfully updated!");
      })
      
      document.getElementById("personalInfoFields").disabled = true;
}