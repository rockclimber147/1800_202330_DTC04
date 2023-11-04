// Function to read the username from Firestore "username" collection
// Input param is the String representing the day of the week, aka, the document name
function readName(name) {
      db.collection("users").doc(name)                                                      //name of the collection and documents should match exactly with what you have in Firestore
            .onSnapshot(nameDoc => {                                                               //arrow notation
                  console.log("current document data: " + nameDoc.data());                          //.data() returns data object
                  document.getElementById("name").innerHTML = nameDoc.data().name;    
                  document.getElementById("username").innerHTML = '#' + nameDoc.data().username;   
                  document.getElementById("age").innerHTML = nameDoc.data().age; 
                  document.getElementById("address").innerHTML = nameDoc.data().address; 
                  document.getElementById("province").innerHTML = nameDoc.data().province; 
                  document.getElementById("canada").innerHTML = nameDoc.data().canada; 
                  
                  //using javascript to display the data on the right place

                  //Here are other ways to access key-value data fields
                  // $('#name').text(nameDoc.data().name);         //using jquery object dot notation
                  // $("#name").text(nameDoc.data()["name"]);      //using json object indexing
                  //document.querySelector("#name").innerHTML = nameDoc.data().name;
            })
}
readName("irene_cheung");        //calling the function