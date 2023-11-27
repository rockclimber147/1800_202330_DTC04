/**
 * Populates quest cards based on the input quest database
 * @param {firestoreDatabase} quest_db A database of quests
 * @param {DOMObject} quest_html_node A DOM object representing a quest card
 * @param {DOMObject} tag_html_node A DOM object representing a quest tag
 * @param {Map} all_quest_tags A Map relating tag ids to tag names
 * @param {firestoreDatabase} user_db A database of users
 */
export function update_quest_cards(quest_db, quest_html_node, tag_html_node, user_location, all_quest_tags, user_doc) {
    $('#quest_cards_go_here').empty()
    quest_db.forEach(doc => {                          // iterate through each doc and for each:
        var quest_name = doc.data().quest_name;          // get the quest name
        var quest_rating = doc.data().rate;              // get value of the "details" key
        var quest_price = doc.data().cost;               // get the price of the quest
        var image_url = doc.data().image_url;          // get the name of the image
        var quest_description = doc.data().description;  // gets the description field (TODO)
        var quest_location = doc.data().location;
        var quest_distance = calculateDistance(user_location, quest_location);
        var quest_tag_id_list = doc.data().tag_ids       // get the list of tag ids
        var quest_id = doc.id;                           // get the quest ids
        var quest_point = doc.data().point;            // get the quest points
        var bookmarked_quests = user_doc.data().bookmarked_quests;  // get the list of bookmarked quests
        var user_accepted_quests = user_doc.data().accepted_quests; // get the list of accepted quests
        var user_completed_quests = user_doc.data().completed_quests;   // get the list of completed quests

        // determine the current state of the quest
        var display_state;
        if (user_accepted_quests.includes(quest_id)) {
            display_state = 'quest is accepted';
        } else if (user_completed_quests.includes(quest_id)) {
            display_state = 'quest is completed';
        } else {
            display_state = 'quest is not yet accepted';
        }

        // Clone the contents of the quest card template element (not the parent template element)
        let new_quest_card = $(quest_html_node).clone();

        let bookmark_state = 'bookmark_border'
        if (bookmarked_quests.includes(quest_id)) {
            bookmark_state = "bookmark"
        }

        // append 'completed', 'accepted', or point depending on the state of the quest
        switch (display_state) {
            case 'quest is accepted': {
                new_quest_card.find('.quest_state').text('Accepted');
                break;
            } case 'quest is completed': {
                new_quest_card.find('.quest_state').text('Completed');
                break;
            } case 'quest is not yet accepted': {
                new_quest_card.find('.quest_state').text(quest_point + 'pt');
                break;
            }
        }

        //update title and text and image
        new_quest_card.find('.quest_name').text(quest_name);
        new_quest_card.find('.quest_rating').text('★'.repeat(quest_rating));
        new_quest_card.find('.quest_price').text('$'.repeat(quest_price));
        new_quest_card.find('.quest_description').text(quest_description);
        new_quest_card.find('.quest_distance').text(quest_distance + 'km');
        new_quest_card.find('.quest_image').attr('src', image_url); // find image and put in new quest card
        new_quest_card.find('.quest_detail_link').attr('href', `./quest-detail.html?quest_id=${quest_id}`); // set links to quest cards
        new_quest_card.find('.quest_bookmark').text(bookmark_state)
        new_quest_card.find('.quest_bookmark').attr('id', 'bookmark_' + doc.id) // set id to id of current quest
        new_quest_card.find('i').click(() => (toggle_bookmark(quest_id, user_doc.id)));
        new_quest_card.find('.quest_name, .quest_rating, .quest_price, .quest_distance, .quest_image').click(() => (window.location.href = `./quest-detail.html?quest_id=${quest_id}`)); // set links to quest cards

        // append tags to quest card
        if (quest_tag_id_list[0] != "") {
            for (let i = 0; i < quest_tag_id_list.length; i++) {
                let new_quest_tag = $(tag_html_node).clone();
                new_quest_tag.text(all_quest_tags[quest_tag_id_list[i]]);
                new_quest_tag.appendTo(new_quest_card.find('.quest_tags_container'));
            }
        }

        new_quest_card.appendTo('#quest_cards_go_here')

    });
}

/**
 * Initializes a map centered on the user location
 * @param {Array} user_location User latude and Longitude
 * @returns A map
 */
export async function initialize_map(user_location) {
    // Defines basic mapbox data
    console.log('user_location in load_map():', user_location)
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
    let map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
        center: [user_location[1], user_location[0]], // Make map start centered on user location
        zoom: 8 // Starting zoom
    });

    // Add user controls to map
    map.addControl(new mapboxgl.NavigationControl());

    // Adds map features
    map.on('load', () => {
        // Defines map pin icon for events
        map.loadImage( 
            '/images/quest_pin.png',
            (error, image) => {
                if (error) throw error;
                map.addImage('quest_pin', image); // Pin Icon
            }
        );

        map.loadImage( 
            '/images/completed_quest_pin.png',
            (error, image) => {
                if (error) throw error;
                map.addImage('completed_quest_pin', image);
            }
        );

        // Add the image to the map style.
        map.loadImage(
            'https://cdn-icons-png.flaticon.com/512/61/61168.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style with width and height values
                map.addImage('userpin', image, { width: 10, height: 10 });

                // Adds user's current location as a source to the map
                navigator.geolocation.getCurrentPosition(position => {
                    let userLocation = [position.coords.longitude, position.coords.latitude];
                    console.log(userLocation);
                    if (userLocation) {
                        map.addSource('userLocation', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [{
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': userLocation
                                    },
                                    'properties': {
                                        'description': 'Your location'
                                    }
                                }]
                            }
                        });

                        // Creates a layer above the map displaying the user's location
                        map.addLayer({
                            'id': 'userLocation',
                            'type': 'symbol',
                            'source': 'userLocation',
                            'layout': {
                                'icon-image': 'userpin', // Pin Icon
                                'icon-size': 0.05, // Pin Size
                                'icon-allow-overlap': true // Allows icons to overlap
                            }
                        });

                        // Map On Click function that creates a popup displaying the user's location
                        map.on('click', 'userLocation', (e) => {
                            // Copy coordinates array.
                            const coordinates = e.features[0].geometry.coordinates.slice();
                            const description = e.features[0].properties.description;

                            new mapboxgl.Popup()
                                .setLngLat(coordinates)
                                .setHTML(description)
                                .addTo(map);
                        });

                        // Change the cursor to a pointer when the mouse is over the userLocation layer.
                        map.on('mouseenter', 'userLocation', () => {
                            map.getCanvas().style.cursor = 'pointer';
                        });

                        // Defaults
                        // Defaults cursor when not hovering over the userLocation layer
                        map.on('mouseleave', 'userLocation', () => {
                            map.getCanvas().style.cursor = '';
                        });
                    }
                });
            }
        );
    });
    return map;
}

/**
 * Adds pins from quest_db to the map
 * @param {*} map OpenGL mapbox
 * @param {*} quest_db Quest database
 */
export function update_map(map, quest_db, user_doc) {

    const features = []; // Defines an empty array for information to be added to
    const completed_quests = []; // Defines an empty array for information to be added to
    let currentArray;

    quest_db.forEach(doc => {
        let lat = doc.data().location[0];
        let lng = doc.data().location[1];
        // console.log(lat, lng);
        let coordinates = [lng, lat];
        // console.log(coordinates);
        // Coordinates
        let event_name = doc.data().quest_name; // Event Name
        let pin_type = 'quest_pin.png'
        if (user_doc.data().completed_quests.includes(doc.id)){
            currentArray = completed_quests;
        } else {
            currentArray = features;
        }

        // Pushes information into the features array
        currentArray.push({
            'type': 'Feature',
            'properties': {
                'description': `<strong>${event_name}</strong><a href="/quest-detail.html?quest_id=${doc.id}" title="Opens in this window">Read more</a>`
            },
            'geometry': {
                'type': 'Point',
                'coordinates': coordinates
            },
        });
    });

    // Remove sources and layers if previous searches have been executed
    if (map.getLayer("places")) {
        map.removeLayer("places");
    }
    if (map.getSource("places")) {
        map.removeSource("places");
    }
    if (map.getLayer("completed_quests")) {
        map.removeLayer("completed_quests");
    }
    if (map.getSource("completed_quests")) {
        map.removeSource("completed_quests");
    }


    // Adds features as a source to the map
    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': features
        }
    });

    // Adds features as a source to the map
    map.addSource('completed_quests', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': completed_quests
        }
    });

    // Creates a layer above the map displaying the pins
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        // source: 'places',
        'source': 'places',
        'layout': {
            'icon-image': 'quest_pin', // Pin Icon
            'icon-size': 0.1, // Pin Size
            'icon-allow-overlap': true // Allows icons to overlap
        }
    });

    // Creates a layer above the map displaying the pins
    map.addLayer({
        'id': 'completed_quests',
        'type': 'symbol',
        // source: 'places',
        'source': 'completed_quests',
        'layout': {
            'icon-image': 'completed_quest_pin', // Pin Icon
            'icon-size': 0.1, // Pin Size
            'icon-allow-overlap': true // Allows icons to overlap
        }
    });

    // Map On Click function that creates a popup, displaying previously defined information from "events" collection in Firestore
    map.on('click', 'places', (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    map.on('click', 'completed_quests', (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Defaults cursor when not hovering over the places layer
    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
    });
}

/**
 * Toggles the view from map to quest card and back
 */
export function toggle_view() {
    console.log('switching...');
    console.log($('#view_toggle_text').text())
    switch ($('#view_toggle_text').text()) {
        case 'MAP': {
            $('#view_toggle_text').text('LIST');
            $('#map').show();
            $('#quest_cards_go_here').hide();
            break;
        } case 'LIST': {
            $('#view_toggle_text').text('MAP');
            $('#map').hide();
            $('#quest_cards_go_here').show();
            break;
        }
    }
}

/**
 * Calculates the distance between two latitude/longitude coordinates
 * @param {Array} current current latitude and longitude
 * @param {Array} destination destination latitude and longitude
 * @returns 
 */
function calculateDistance(current, destination) {
    // this function receives two arrays that represent coordinates and returns the distance in miles

    // calculate difference in longitude and latitude
    let longitude_difference = current[0] - destination[0]
    let latitude_difference = current[1] - destination[1]

    // calculate distance using Pythagorean theorem and convert it to mile
    let distance = ((longitude_difference ** 2 + latitude_difference ** 2) ** 0.5 * 60 * 1.60934).toFixed(1)
    return distance;
}

async function toggle_bookmark(quest_id, user_id) {
    var iconID = 'bookmark_' + quest_id;
    if (document.getElementById('bookmark_' + quest_id).innerText == 'bookmark') {
        await db.collection("users").doc(user_id).update({
            bookmarked_quests: firebase.firestore.FieldValue.arrayRemove(quest_id)
        })
        console.log("bookmark has been removed for " + quest_id);
        document.getElementById(iconID).innerText = 'bookmark_border';
    } else {
        await db.collection("users").doc(user_id).update({
            bookmarked_quests: firebase.firestore.FieldValue.arrayUnion(quest_id)
        })
        console.log("bookmark has been saved for " + quest_id);
        document.getElementById(iconID).innerText = 'bookmark';
    }
}
