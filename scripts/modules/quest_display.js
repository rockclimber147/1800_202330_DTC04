/**
 * Populates quest cards based on the input quest database
 * @param {firestoreDatabase} quest_db A database of quests
 * @param {DOMObject} quest_html_node A DOM object representing a quest card
 * @param {DOMObject} tag_html_node A DOM object representing a quest tag
 * @param {Map} all_quest_tags A Map relating tag ids to tag names
 */
export function update_quest_cards(quest_db, quest_html_node, tag_html_node, user_location, all_quest_tags) {
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

          // Clone the contents of the quest card template element (not the parent template element)
          let new_quest_card = $(quest_html_node).clone();

          //update title and text and image
          new_quest_card.find('.quest_name').text(quest_name);
          new_quest_card.find('.quest_rating').text('★'.repeat(quest_rating));
          new_quest_card.find('.quest_price').text('$'.repeat(quest_price));
          new_quest_card.find('.quest_description').text(quest_description);
          new_quest_card.find('.quest_distance').text(quest_distance + 'km');
          new_quest_card.find('.quest_image').attr('src', image_url); // find image and put in new quest card
          new_quest_card.find('.quest_detail_link').attr('href', `./quest-detail.html?quest_id=${quest_id}`); // set links to quest cards

          if (quest_tag_id_list[0] != "") {
                for (let i = 0; i < quest_tag_id_list.length; i++) {
                      let new_quest_tag = $(tag_html_node).clone();
                      new_quest_tag.text(all_quest_tags[quest_tag_id_list[i]]);
                      new_quest_tag.appendTo(new_quest_card.find('.quest_tags_container'));
                }
          }
          new_quest_card.appendTo('#quest_cards_go_here')
    })
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
            'https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style.
                map.addImage('eventpin', image); // Pin Icon

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
 * @param {*} map OpenGL mapbok
 * @param {*} quest_db Quest database
 */
export function update_map(map, quest_db) {

    const features = []; // Defines an empty array for information to be added to

    quest_db.forEach(doc => {
        let lat = doc.data().location[0];
        let lng = doc.data().location[1];
        // console.log(lat, lng);
        let coordinates = [lng, lat];
        // console.log(coordinates);
        // Coordinates
        let event_name = doc.data().quest_name; // Event Name
        let preview = doc.data().description; // Text Preview
        // let img = doc.data().posterurl; // Image
        // url = doc.data().link; // URL

        // Pushes information into the features array
        features.push({
            'type': 'Feature',
            'properties': {
                'description': `<strong>${event_name}</strong><p>${preview}</p> <br> <a href="/quest-detail.html?quest_id=${doc.id}" title="Opens in this window">Read more</a>`
            },
            'geometry': {
                'type': 'Point',
                'coordinates': coordinates
            }
        });
    });

    // Remove sources and layers if previous searches have been executed
    if (map.getLayer("places")) {
        map.removeLayer("places");
    }
    if (map.getSource("places")) {
        map.removeSource("places");
    }


    // Adds features as a source to the map
    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': features
        }
    });

    // Creates a layer above the map displaying the pins
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        // source: 'places',
        'source': 'places',
        'layout': {
            'icon-image': 'eventpin', // Pin Icon
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

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Defaults cursor when not hovering over the places layer
    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
    });
}

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
 * 
 * @param {Array} current 
 * @param {Array} destination 
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