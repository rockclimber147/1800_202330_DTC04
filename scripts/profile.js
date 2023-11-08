// Function to read the username from Firestore "username" collection
// Input param is the String representing the day of the week, aka, the document name
// function readName(name) {
//       db.collection("users").doc(name)                                                      //name of the collection and documents should match exactly with what you have in Firestore
//             .onSnapshot(nameDoc => {                                                               //arrow notation
//                   console.log("current document data: " + nameDoc.data());                          //.data() returns data object
//                   document.getElementById("name").innerHTML = nameDoc.data().name;    
//                   document.getElementById("username").innerHTML = '#' + nameDoc.data().username;   
//                   document.getElementById("email").innerHTML = 'Email: ' + nameDoc.data().email; 
//                   document.getElementById("level").innerHTML = 'Level: ' + nameDoc.data().level; 
//                   document.getElementById("points_earned").innerHTML = 'Points: ' + nameDoc.data().points_earned; 
//                   document.getElementById("age").innerHTML = 'Age: ' + nameDoc.data().age; 
//                   document.getElementById("address").innerHTML = 'Address: ' + nameDoc.data().address; 
//                   document.getElementById("city").innerHTML = ', ' + nameDoc.data().city; 
//                   document.getElementById("province").innerHTML = ', ' + nameDoc.data().province; 
//                   document.getElementById("country").innerHTML = ', ' + nameDoc.data().country;
                  
//                   //using javascript to display the data on the right place

//                   //Here are other ways to access key-value data fields
//                   // $('#name').text(nameDoc.data().name);         //using jquery object dot notation
//                   // $("#name").text(nameDoc.data()["name"]);      //using json object indexing
//                   //document.querySelector("#name").innerHTML = nameDoc.data().name;
//             })
// }
// readName("irene_cheung");        //calling the function

// function insertNameFromFirestore() {
//       // Check if the user is logged in:
//       firebase.auth().onAuthStateChanged(user => {
//             if (user) {
//                   console.log(user.uid); // Let's know who the logged-in user is by logging their UID
//                   currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
//                   currentUser.get().then(userDoc => {
//                         // Get the user name
//                         var name = userDoc.data().name;
//                         var username = userDoc.data().username;
//                         var email = userDoc.data().email;
//                         var birthdate = userDoc.data().birthdate;
//                         var address = userDoc.data().address;
//                         var city = userDoc.data().city;
//                         var province = userDoc.data().province;
//                         var country = userDoc.data().country;
                        

//                         // Need to connect to other collections
//                         var level = userDoc.data().level;
//                         var preference = userDoc.data().preference;
//                         var points_earned = userDoc.data().points_earned;
//                         var accepted_quests = userDoc.data().accepted_quests;
//                         var completed_quests = userDoc.data().completed_quests_quests;
                        

//                         //$("#name-goes-here").text(userName); // jQuery
//                         document.getElementById("name").innerText = name;
//                         document.getElementById("username").innerText = username;
//                         document.getElementById("email").innerText = email;
//                         document.getElementById("birthdate").innerText = birthdate;
//                         document.getElementById("address").innerText = address;
//                         document.getElementById("city").innerText = city;
//                         document.getElementById("province").innerText = province;
//                         document.getElementById("country").innerText = country;

//                         document.getElementById("preference").innerText = preference;
//                         document.getElementById("level").innerText = level;
                        
//                   })
//             } else {
//                   console.log("No user is logged in."); // Log a message when no user is logged in
//             }
//       })
// }

// insertNameFromFirestore();

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
                              var userName = userDoc.data().name;
                              var userSchool = userDoc.data().school;
                              var userCity = userDoc.data().city;

                              //if the data fields are not empty, then write them in to the form.
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