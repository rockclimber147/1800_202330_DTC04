/*
* Display user points on top navigation bar
*/
async function display_points_earned() {
    let user_doc;
    await firebase.auth().onAuthStateChanged(async user =>{
        if (user) {
            user_doc = await db.collection("users").doc(user.uid).get();  // get user information
            let user_point = user_doc.data().points;                  // get user points
            $("#points_earned").text(`${user_point} pt`)            // display user points
        }
    })
}