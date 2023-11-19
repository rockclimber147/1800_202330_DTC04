function log_tags() {
    db.collection('tags').get()
        .then(all_tags => {
            all_tags.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data().tag_name);
            })
        });
}

/**
 * Run this to keep tags up to date with the amount of quests that use them (This should ideally be deprecated once we implement quest creation)
 */
async function write_tag_popularity() {              // ASYNC function so we can wait for the database response
    tag_db = await db.collection('tags').get()       // Here we wait until we get a response, no ned for .then() as the code will pause here
    tag_popularity = {}                              // empty dictionary to keep track of tags
    tag_id_list = []                                 // Empty list to store tag_ids
    tag_db.forEach(tag_doc => {                      // for each tag in the tag collection
        console.log(tag_doc.id)
        tag_id_list.push(tag_doc.id)                 // add the tag id to the list
        tag_popularity[tag_doc.id] = 0;              // associate that tag id with 0 in the dictionary
    });
    db.collection('quests').get().then(quests => {   // get the quests, THEN (alternative to async await) 
        quests.forEach(doc => {                      // for each quest in the collection:
            quest_tag_id_list = doc.data().tag_ids;  // store the tag_ids associated with the quest

            if (quest_tag_id_list[0] != "") {        // for each tag_id associated with that quest:
                for (let i = 0; i < quest_tag_id_list.length; i++) {
                    tag_popularity[quest_tag_id_list[i]]++ // increment the popularity of that tag_id in the dictionary
                }
            }
        })
        console.log(tag_popularity)
    }).then(() => {                                   // Once looping is done, THEN
        for (let i = 0; i < tag_id_list.length; i++)  // for each tag_id in the list we made earlier
            db.collection('tags').doc(tag_id_list[i]).update({ 'popularity': tag_popularity[tag_id_list[i]] }) // update the tag in the collection to include the popularity associated with it in the dictionary
    })
}
/**
 * Reads the quests and tag databases and adds a list of associated quests to each tag
 */
async function write_quest_ids_to_tags() {               // Async function because we are getting data from databases
    console.log('Reading tags...')
    tag_db = await db.collection('tags').get()           // Wait for tag db and store response
    console.log('Done.')
    console.log('Reading quests...')
    quest_db = await db.collection('quests').get()       // Wait for quest db and store response
    console.log('Done.')

    tag_quest_dict = {}                                  // Make empty dictionary to associate tag ids with a list of quest ids

    console.log('Adding tag_ids to dictionary...')
    tag_db.forEach(tag_doc => {
        console.log(`    Adding ${tag_doc.id} (${tag_doc.data().tag_name})...`)
        tag_quest_dict[tag_doc.id] = []                  // Add key/value pair (tag_id: empty list) for each tag id in the database so each id has an empty list
    })
    console.log('Done.')
    console.log(tag_quest_dict)

    quest_db.forEach(quest_doc => {                       // for each quest in the quest collection
        quest_id = quest_doc.id                           // store the current quest id                    
        console.log(`parsing ${quest_id} (${quest_doc.data().quest_name})...`)

        quest_tag_list = quest_doc.data().tag_ids         // get the tag_id list associated with that quest
        console.log(quest_tag_list)

        for (i = 0; i < quest_tag_list.length; i++) {     // for each tag in that list

            if (quest_tag_list[i] != "") {                // Skip empty lists (we decided to just add an empty string)
                console.log(`Found tag_id: ${quest_tag_list[i]}, appending quest...`)
                tag_quest_dict[quest_tag_list[i]].push(quest_id) // find the list associated with the tag_id in the dictionary and append the current quest id
            }
        }
    })                                                    // We now have a dictionary associating tag_ids with a list of quests that use them

    for (const tag_id in tag_quest_dict) {                // for each iag_id (key) in the dictionary:
        console.log(tag_id, tag_quest_dict[tag_id])
        db.collection('tags').doc(tag_id).update({ 'used_in_quests': tag_quest_dict[tag_id] }) // update the tag in the collection to include the list of quests that use that tag
    }
}

async function update_quest_name_list() {
    quest_name_list = []
    all_quests = await db.collection("quests").get();
    all_quests.forEach((quest_doc) => {
        quest_name_list.push(quest_doc.data().quest_name)
    })
    console.log(quest_name_list)
    let quest_names_doc_id;
    quest_names_doc = await db.collection("quest_names").get();
    quest_names_doc.forEach((quest_name_list_doc) => {
        quest_names_doc_id = quest_name_list_doc.id;
    })

    db.collection('quest_names').doc(quest_names_doc_id).update({ 'all_quest_names': quest_name_list })
}

/**
 * This adds search keywords to each quest composed of its tags and the words in the title, ALL LOWERCASE
 */
async function add_keywords_to_quests() {
    let quest_collection = await db.collection("quests").get(); // get quest collection
    let tag_collection = await db.collection("tags").get(); // get tag collection
    tag_id_map = {};

    tag_collection.forEach((tag_doc) => {                  // populate dictionary
        console.log(tag_doc.data().tag_name)
        tag_id_map[tag_doc.id] = tag_doc.data().tag_name;
    })
    console.log(tag_id_map)

    quest_collection.forEach((quest_doc) => {
        keyword_list = quest_doc.data().quest_name.toLowerCase().split(' '); // break up quest name into lowercase words and store as a list
        if (quest_doc.data().tag_ids[0] != '') {
            for (let i = 0; i < quest_doc.data().tag_ids.length; i++) {
                keyword_list.push(tag_id_map[quest_doc.data().tag_ids[i]].toLowerCase()) // get the tag name from the tag id, make it lowercase and add it to the keyword list
            }
        }
        console.log('keyword list:', keyword_list);
        db.collection('quests').doc(quest_doc.id).update({ 'keywords': keyword_list })
    })
}

function writeQuests() {
    //define a variable for the collection you want to create in Firestore to populate data
    var questRef = db.collection("quests");

    questRef.add({
        quest_name: "Experience the underwater world!",
        location_name: "Vancouver Aquarium",
        location: [49.30120109782259, -123.13059318497679], // copy from Google map
        rate: 4, //integer between 1 to 5 (decide as you want!)
        cost: 3, // integer between 1 to 3 (1: ~$15, 2: ~$40, 3: $40~)
        description: "The Vancouver Aquarium offers a memorable experience, showcasing the wonders of the underwater world. Located in the heart of Stanley park, it is the perfect spot for nature and animal lovers. Come to see sea otters, seals, sea lions, sharks, and more! Not only do they have animals, but you can immerse yourself in a 4D theatre experience. It will be an unforgettable experience for visitors of all ages.",
        tag_ids: ["FRqykuyJ6ibTjRW2SRYs"], // uncomment helper.js at main.html and run log_tags() to see the list of tags (or you can copy tag_ids from firebase)
        image_url: "https://smapse.com/storage/2019/09/converted/895_0_o-2.jpg", // right click on the image at google image search and then select "Copy Image Address"
        point: 1300, // integer which is multiple of 50 (if required time to complete the quest from downtown is: ~30min => ~500pt, ~1hr => ~700pt, ~2hr => ~1000pt )
    })

    questRef.add({
        quest_name: "Treat yourself to a drink at the oldest bar in Vancouver!",
        location_name: "The Lamplighter",
        location: [49.283906730938504, -123.10620894614956], // copy from Google map
        rate: 3, //integer between 1 to 5 (decide as you want!)
        cost: 2, // integer between 1 to 3 (1: ~$15, 2: ~$40, 3: $40~)
        description: "Nestled in Vancouver's charming Gastown district, the Lamplighter is one of the most iconic bars in the city. It was established back in 1925 and was the first pub to be granted an alcohol license. With its rustic decor and warm ambiance, it is the perfect spot for a casual drink and a lively evening. Next time you trek through the cobblestone streets of Gastown, make sure you make a stop at the Lamplighter!",
        tag_ids: ["amcTVmlcFPvVZo2XarCH", "j6MrxNTQVsVDqZZqKY3A"], // uncomment helper.js at main.html and run log_tags() to see the list of tags (or you can copy tag_ids from firebase)
        image_url: "https://www.vmcdn.ca/f/files/via/import/2018/01/04115149_lamplighter-pub-vancouver.jpg;w=960", // right click on the image at google image search and then select "Copy Image Address"
        point: 650, // integer which is multiple of 50 (if required time to complete the quest from downtown is: ~30min => ~500pt, ~1hr => ~700pt, ~2hr => ~1000pt )
    })

    questRef.add({
        quest_name: "Tap into your artistic side!",
        location_name: "Vancouver Art Gallery",
        location: [49.283107643362, -123.12042858847792], // copy from Google map
        rate: 3, //integer between 1 to 5 (decide as you want!)
        cost: 2, // integer between 1 to 3 (1: ~$15, 2: ~$40, 3: $40~)
        description: "The gallery spans 165,000 square feet, making it the largest art museum in Western Canada. Here, you can explore the diverse collections of artwork and immerse yourself in thought-provoking exhibitions. Find artwork in various mediums including paintings, sculptures, and more. This is the perfect destination for those who are interested in fine and contemporary arts. Located in the heart of downtown Vancouver at Robson Square, it is close to Robson Street, a popular shopping district. Visit the Vancouver Art Gallery for an unforgettable cultural experience!",
        tag_ids: ["FRqykuyJ6ibTjRW2SRYs"], // uncomment helper.js at main.html and run log_tags() to see the list of tags (or you can copy tag_ids from firebase)
        image_url: "https://contentadmin.vanartgallery.bc.ca/wp-content/uploads/2019/06/5_HISTORY-Robson-Square-Vancouver-Art-Gallery-1024PX.jpg", // right click on the image at google image search and then select "Copy Image Address"
        point: 1000, // integer which is multiple of 50 (if required time to complete the quest from downtown is: ~30min => ~500pt, ~1hr => ~700pt, ~2hr => ~1000pt )
    })

    questRef.add({
        quest_name: "Experience a world-class performance!",
        location_name: "Orpheum",
        location: [49.28037661215589, -123.12046005322641], // copy from Google map
        rate: 4, //integer between 1 to 5 (decide as you want!)
        cost: 3, // integer between 1 to 3 (1: ~$15, 2: ~$40, 3: $40~)
        description: "The Orpheum is an iconic venue featuring an interior with elegant sweeping staircases, majestic chandeliers, and exquisite architecture. It is one of the designated National Heritage Sites and has enraptured millions of people since its opening in 1927. The Orpheum is also home to the internationally renowned Vancouver Symphony Orchestra. Make sure to book your next ticket here to experience an unparalleled performance!",
        tag_ids: ["HMrrJ40lism9mp1GIsAP"], // uncomment helper.js at main.html and run log_tags() to see the list of tags (or you can copy tag_ids from firebase)
        image_url: "https://lh3.googleusercontent.com/p/AF1QipO8YFYY-xsT6M0te3P2X7L4yAfekb8_NpCUn0Ti=s1360-w1360-h1020", // right click on the image at google image search and then select "Copy Image Address"
        point: 800, // integer which is multiple of 50 (if required time to complete the quest from downtown is: ~30min => ~500pt, ~1hr => ~700pt, ~2hr => ~1000pt )
    })


    questRef.add({
        quest_name: "Walk among trees and find the secret viewpoints!",
        location_name: "Greenheart Treewalk",
        location: [49.25077224296747, -123.24653281646229], // copy from Google map
        rate: 2, //integer between 1 to 5 (decide as you want!)
        cost: 1, // integer between 1 to 3 (1: ~$15, 2: ~$40, 3: $40~)
        description: "The Greenheart TreeWalk will spark your adventurous spirit as you navigate suspended walkways and tree platforms high above the forest ﬂoor. Located in the heart of UBC Botanical Garden, the 310 metre-long tree top canopy walkway hangs from huge Douglas firs, cedars and grand firs, many of which are over 100 years old. Reaching a height of nearly 20 metres above the forest floor, the walkway will give you a bird’s eye view of Vancouver’s magnificent coastal temperate rainforest.",
        tag_ids: ["D4NeTY30U09lD3TemV4Y", "ntk5nt0wadhVx4A17Weu"], // uncomment helper.js at main.html and run log_tags() to see the list of tags (or you can copy tag_ids from firebase)
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Greenheart_TreeWalk_-_UBC_Botanical_Garden_-_Vancouver%2C_Canada_-_DSC08050.jpg/1024px-Greenheart_TreeWalk_-_UBC_Botanical_Garden_-_Vancouver%2C_Canada_-_DSC08050.jpg", // right click on the image at google image search and then select "Copy Image Address"
        point: 650, // integer which is multiple of 50 (if required time to complete the quest from downtown is: ~30min => ~500pt, ~1hr => ~700pt, ~2hr => ~1000pt )
    })

    questRef.add({
        quest_name: "Nothing besides water!",
        location_name: "Iona South Jetty",
        location: [49.2092684568335, -123.26270005171358],
        rate: 3, //integer between 1 to 5
        cost: 1, // integer between 1 to 3
        description: "The Iona Jetty is a 8.2km long trail that juts out into the water. It is, in fact, a long pipe that runs out of the sewage treatment plant and into the water. If you were to view the jetty on a map, you will see a straight line in the water coming out of the peninsula. There are beaches in the area, although beachgoers and dogs are advised to avoid them because of the sewage emissions.",
        tag_ids: ["D4NeTY30U09lD3TemV4Y", "ntk5nt0wadhVx4A17Weu"],
        image_url: "https://www.insidevancouver.ca/wp-content/uploads/2021/11/ionajettyAlltrailsRickyBatallones-664x498.jpg",
        point: 1500,
    })

    questRef.add({
        quest_name: "Welcome to the Forest of Books!",
        location_name: "Vancouver Public Library",
        location: [49.27982782965753, -123.11556849852188],
        rate: 4, //integer between 1 to 5
        cost: 1, // integer between 1 to 3
        description: "Vancouver Public Library (VPL) is the public library system for the city of Vancouver, British Columbia. In 2013, VPL had more than 6.9 million visits with patrons borrowing nearly 9.5 million items including: books, ebooks, CDs, DVDs, video games, newspapers and magazines. Across 22 locations and online, VPL serves nearly 428,000 active members and is the third-largest public library system in Canada.",
        tag_ids: ["0o8PuZZQAbN2e6CU6veD", "j6MrxNTQVsVDqZZqKY3A"],
        image_url: "https://www.vpl.ca/sites/default/files/styles/landscape_sm/public/branch-CEN.jpg?itok=Vpx3FFJd",
        point: 350,
    })

    questRef.add({
        quest_name: "Enjoy exercise even on rainy days!",
        location_name: "Vancouver Aquatic Centre",
        location: [49.276949796368434, -123.13514559455747],
        rate: 4, //integer between 1 to 5
        cost: 1, // integer between 1 to 3
        description: "The Vancouver Aquatic Centre is a large city-run recreation centre with a swimming pool and fitness facilities. The swimming pool is a large indoor 50 metre pool with a diving tower (5m, 7.5m, and 10m), diving boards(1m and 3m), rope swing, and slide. It has a sauna and weight room.",
        tag_ids: ["R5xMy6JZru7488KC6ICA"],
        image_url: "https://images.dailyhive.com/20190513111503/vancouver-aquatic-centre.jpg",
        point: 600,
    })
}