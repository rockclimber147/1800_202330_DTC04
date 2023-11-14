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
                              var userName = userDoc.data().name;
                              var userBirthDate = userDoc.data().birthdate;
                              var userAddress = userDoc.data().address;
                              var userCity = userDoc.data().city;
                              var userProvince = userDoc.data().province;
                              var userCountry = userDoc.data().country;
                              var userBio = userDoc.data().bio;

                              //if the data fields are not empty, then write them into the form.
                              if (userName != null) {
                                    document.getElementById("nameInput").value = userName;
                              }
                              if (userBirthDate != null) {
                                    document.getElementById("birthDateInput").value = userBirthDate;
                              }
                              if (userAddress != null) {
                                    document.getElementById("addressInput").value = userAddress;
                              }
                              if (userCity != null) {
                                    document.getElementById("cityInput").value = userCity;
                              }
                              if (userProvince != null) {
                                    document.getElementById("provinceInput").value = userProvince;
                              }
                              if (userCountry != null) {
                                    document.getElementById("countryInput").value = userCountry;
                              }
                              if (userBio != null) {
                                    document.getElementById("bioInput").value = userBio;
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
function saveUserInfo() {
      // get information entered by user

      userName = document.getElementById("nameInput").value
      userBirthDate = document.getElementById("birthDateInput").value
      userAddress = document.getElementById("addressInput").value
      userCity = document.getElementById("cityInput").value
      userProvince = document.getElementById("provinceInput").value
      userCountry = document.getElementById("countryInput").value
      userBio = document.getElementById("bioInput").value

      checkboxDivs = document.getElementById("check").getElementsByTagName("div")
      selectedCheckboxes = []

      for (i = 0; i < checkboxDivs.length; i++) {
            var div = checkboxDivs[i];
            console.log(div)
            checkbox = div.getElementsByTagName("input")[0]
            label = div.getElementsByTagName("label")[0]

            if (checkbox.checked) {
                  selectedCheckboxes.push(label.id);
            }
      }

      // Update, will add fields as needed
      currentUser.update({
            name: userName,
            birthdate: userBirthDate,
            address: userAddress,
            city: userCity,
            province: userProvince,
            country: userCountry,
            bio: userBio,
            preferences: selectedCheckboxes
      })
            .then(() => {
                  console.log("Document successfully updated!");
            })

      document.getElementById("personalInfoFields").disabled = true;
}

// Populates the dropdown menu options
function log_tags() {
      preferences = document.getElementById("activities")
      db.collection('tags').get()
            .then(all_tags => {
                  all_tags.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        var option = document.createElement("option");
                        option.text = doc.data().tag_name;
                        option.value = doc.data().tag_name;
                        preferences.appendChild(option);
                  })
            })
}

log_tags()

// Displaying the tag after dropdown selection
function print_tag() {
      preferences.addEventListener("change", (event) => {
            var selectedOption = document.getElementById("activities").value;
            var buttonOption = document.createElement("button")
            var buttonText = document.createElement("span")
            buttonText.innerHTML = selectedOption
            buttonOption.appendChild(buttonText)
            document.getElementById("tag_div").append(buttonOption)
      }
      )
};

print_tag()

function print_tag_checkbox() {
      db.collection('tags').get()
            .then(all_tags => {
                  all_tags.forEach((doc) => {
                        $("#check").append(
                              `
                              <div>
                              <input type="checkbox" id="tagcheckbox" name="tagcheckbox" checked />
                              <label id="${doc.id}"  for="tagcheckbox">${doc.data().tag_name}</label>  
                              </div>
                              `
                        )
                  })
            });
}

print_tag_checkbox()


