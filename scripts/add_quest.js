async function add_quest_to_database() {
    let user_doc;
    await firebase.auth().onAuthStateChanged(async user => {
        // Check if user is signed in:
        if (user) {
            console.log(`user is logged in, user.uid: ${user.uid}`)
            
            // Make sure user is ok with the current state of the quest
            let confirm_text = "Are you sure you want to add this quest?\nThis can't be undone!";
            // return if user doesn't want to add quest
            if (!confirm(confirm_text)){
                return;
            }

            

        } 
    })
}

function get_keywords_from_name(quest_name){
    return quest_name.lower().split(' ');
}