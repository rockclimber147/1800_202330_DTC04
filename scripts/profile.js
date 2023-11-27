
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
      firebase.auth().onAuthStateChanged(async user => {
            // Check if user is signed in:
            if (user) {
                  [userDoc, tag_db] = await Promise.all([
                        db.collection("users").doc(user.uid).get(),
                        db.collection("tags").get()
                  ])
                  console.log(userDoc)
                  console.log(tag_db)

                  //get the data fields of the user
                  var userName = userDoc.data().name;
                  var userBirthDate = userDoc.data().birthdate;
                  var userAddress = userDoc.data().address;
                  var userCity = userDoc.data().city;
                  var userProvince = userDoc.data().province;
                  var userCountry = userDoc.data().country;
                  // Gender 
                  var userGender = userDoc.data().gender;

                  var userBio = userDoc.data().bio;

                  var userPreferences = userDoc.data().preferences
                  var userPoints = userDoc.data().points
                  var userLevel = userDoc.data().level



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

                  if (userGender != null) {
                        document.getElementById("genderInput").value = userGender;
                  }

                  if (userBio != null) {
                        document.getElementById("bioInput").value = userBio;
                  }

                  if (userPoints != null) {
                        document.getElementById("points_earned").innerHTML = `<h4 id="points">Points: ${userPoints}</h4>`
                  }

                  if (userLevel != null) {
                        document.getElementById("level").innerHTML = `<h4 id="level">Level: ${userLevel}</h4>`
                  }

                  tag_db.forEach((doc) => {
                        let checked = ''
                        if (userPreferences != null) {
                              if (userPreferences.includes(doc.id))
                                    checked = 'checked'
                              $("#check").append(
                                    `
                        <div class="form-check">
                              <input ${checked} type="checkbox" class="form-check-input" id="tagcheckbox" name="tagcheckbox"/>
                              <label id="${doc.id}" for="tagcheckbox">${doc.data().tag_name}</label>  
                        </div>
                        `
                              )
                        } else {
                              $("#check").append(
                                    `
                              <div class="form-check">
                                    <input ${checked} type="checkbox" class="form-check-input" id="tagcheckbox" name="tagcheckbox"/>
                                    <label id="${doc.id}" for="tagcheckbox">${doc.data().tag_name}</label>  
                              </div>
                        `)
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
      console.log("hi")
      document.getElementById('personalInfoFields').disabled = false;
}

// // Demo 10 Step 1.4 Activate the save button
function saveUserInfo() {
      // get information entered by user

      userName = document.getElementById("nameInput").value
      userBirthDate = document.getElementById("birthDateInput").value
      userAddress = document.getElementById("addressInput").value
      userCity = document.getElementById("cityInput").value
      userProvince = document.getElementById("provinceInput").value
      userCountry = document.getElementById("countryInput").value
      // Gender
      userGender = document.getElementById("genderInput").value
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
            gender: userGender,
            preferences: selectedCheckboxes
      })
            .then(() => {
                  console.log("Document successfully updated!");
                  alert("Your information is saved!")
            })

      document.getElementById("personalInfoFields").disabled = true;
}

var ImageFile;      //global variable to store the File Object reference

function chooseFileListener() {
      const fileInput = document.getElementById("profile_pic_input");   // pointer #1
      const image = document.getElementById("profile_pic_container");   // pointer #2

      //attach listener to input file
      //when this file changes, do something
      fileInput.addEventListener('change', function (e) {

            //the change event returns a file "e.target.files[0]"
            ImageFile = e.target.files[0];
            var blob = URL.createObjectURL(ImageFile);

            //change the DOM img element source to point to this file
            image.src = blob;    //assign the "src" property of the "img" tag
      })
}
chooseFileListener();

function saveUserInfo() {
      console.log("save button")
      firebase.auth().onAuthStateChanged(async function (user) {
            var storageRef = storage.ref("images/" + user.uid + ".jpg");

            //Asynch call to put File Object (global variable ImageFile) onto Cloud
            await storageRef.put(ImageFile)

            console.log('Uploaded to Cloud Storage.');

            //Asynch call to get URL from Cloud
            let url = await storageRef.getDownloadURL()

            console.log("Got the download URL.");
            //get values from the from
            userName = document.getElementById("nameInput").value
            userBirthDate = document.getElementById("birthDateInput").value
            userAddress = document.getElementById("addressInput").value
            userCity = document.getElementById("cityInput").value
            userProvince = document.getElementById("provinceInput").value
            userCountry = document.getElementById("countryInput").value
            // Gender
            userGender = document.getElementById("genderInput").value
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

            //Asynch call to save the form fields into Firestore.
            currentUser.update({
                  name: userName,
                  birthdate: userBirthDate,
                  address: userAddress,
                  city: userCity,
                  province: userProvince,
                  country: userCountry,
                  bio: userBio,
                  gender: userGender,
                  preferences: selectedCheckboxes
            })
                  .then(() => {
                        console.log("Document successfully updated!");
                        alert("Your information is saved!")
                        console.log('Added Profile Pic URL to Firestore.');
                        console.log('Saved use profile info');
                        document.getElementById('personalInfoFields').disabled = true;
                  })

      })
}