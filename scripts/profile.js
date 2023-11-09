// Demo 7 Step 7.4 - Get name from authentication
// function getNameFromAuth() {
//       firebase.auth().onAuthStateChanged(user => {
//             // Check if a user is signed in:
//             if (user) {
//                   // Do something for the currently logged-in user here: 
//                   console.log(user.uid); //print the uid in the browser console
//                   console.log(user.displayName);  //print the user name in the browser console
//                   userName = user.displayName;

//                   //method #1:  insert with JS
//                   document.getElementById("name-goes-here").innerText = userName;    

//                   //method #2:  insert using jquery
//                   //$("#name-goes-here").text(userName); //using jquery

//                   //method #3:  insert using querySelector
//                   //document.querySelector("#name-goes-here").innerText = userName

//             } else {
//                   // No user is signed in.
//             }
//       });
// }
// getNameFromAuth(); //run the function

// Demo 9 Step 3.3 - Display name from firestore
function insertNameFromFirestore() {
      // Check if the user is logged in:
      firebase.auth().onAuthStateChanged(user => {
            if (user) {
                  console.log(user.uid); // Let's know who the logged-in user is by logging their UID
                  currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
                  currentUser.get().then(userDoc => {
                        // Get the user name
                        var userName = userDoc.data().name;
                        console.log(userName);
                        //$("#name-goes-here").text(userName); // jQuery
                        document.getElementById("name-goes-here").innerText = userName;
                  })
            } else {
                  console.log("No user is logged in."); // Log a message when no user is logged in
            }
      })
}

insertNameFromFirestore();

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
                              // var username = userDoc.data().userName;
                              // var email = userDoc.data().userEmail;
                              var birthdate = userDoc.data().userBirthDate;
                              var address = userDoc.data().userAddress;
                              var city = userDoc.data().userCity;
                              var province = userDoc.data().userProvince;
                              var country = userDoc.data().userCountry;
                              var bio = userDoc.data().userBio;

                              // var level = userDoc.data().level;
                              // var preference = userDoc.data().preference;
                              // var points_earned = userDoc.data().points_earned;
                              // var accepted_quests = userDoc.data().accepted_quests;
                              // var completed_quests = userDoc.data().completed_quests_quests;

                              //if the data fields are not empty, then write them in to the form.



                              if (name != null) {
                                    document.getElementById("name").value = name;
                              }
                              // if (userName != null) {
                              //       document.getElementById("userName").value = username;
                              // }
                              // if (userEmail != null) {
                              //       document.getElementById("userEmail").value = email;
                              // }

                              if (userBirthDate != null) {
                                    document.getElementById("userBirthDate").value = birthdate;
                              }
                              if (userAddress != null) {
                                    document.getElementById("userAddress").value = address;
                              }
                              if (userCity != null) {
                                    document.getElementById("userCity").value = city;
                              }
                              if (userProvince != null) {
                                    document.getElementById("userProvince").value = province;
                              }
                              if (userCountry != null) {
                                    document.getElementById("userCountry").value = country;
                              }
                              if (userBio != null) {
                                    document.getElementById("userBio").value = country;
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
      name = document.getElementById("name").value
      // username = document.getElementById("userName").value
      birthdate = document.getElementById("userBirthDate").value
      address = document.getElementById("userAddress").value
      city = document.getElementById("userCity").value
      province = document.getElementById("userProvince").value
      country = document.getElementById("userCountry").value
      bio = document.getElementById("userBio").value

      // Update will add fields as needed
      currentUser.update({
            name: name,
            userName: username,
            userBirthDate: birthdate,
            userAddress: address,
            userCity: city,
            userProvince: province,
            userCountry: country,
            userBio: bio

      })
      .then(() => {
            console.log("Document successfully updated!");
      })
      
      document.getElementById("personalInfoFields").disabled = true;
}


