async function display_points_earned() {
    let user_doc;
    await firebase.auth().onAuthStateChanged(async user =>{
        if (user) {
            user_doc = await db.collection("users").doc(user.uid).get();
            let user_point = user_doc.data().points;
            $("#points_earned").text(`${user_point} pt`)
        }
    })
}