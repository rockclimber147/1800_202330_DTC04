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

function insertNameFromFirestore() {
      // Check if the user is logged in:
      firebase.auth().onAuthStateChanged(user => {
            if (user) {
                  console.log(user.uid); // Let's know who the logged-in user is by logging their UID
                  currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
                  currentUser.get().then(userDoc => {
                        // Get the user name
                        var name = userDoc.data().name;
                        var username = userDoc.data().username;
                        var email = userDoc.data().email;
                        var birthdate = userDoc.data().birthdate;

                        //$("#name-goes-here").text(userName); // jQuery
                        document.getElementById("name").innerText = name;
                        document.getElementById("username").innerText = username;
                        document.getElementById("email").innerText = email;
                        document.getElementById("birthdate").innerText = birthdate;
                        document.getElementById("username").innerText = username;
                        document.getElementById("username").innerText = username;
                        
                  })
            } else {
                  console.log("No user is logged in."); // Log a message when no user is logged in
            }
      })
}

insertNameFromFirestore();