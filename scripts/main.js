$(document).ready(function () {
    var quest_card_template = $('#quest_card_template');
    var quest_card_node = quest_card_template.prop('content');  // get quest templates ready

    var quest_tag_template = $('#quest_tag_template');
    var quest_tag_node = quest_tag_template.prop('content'); // get tag template ready

    var quest_collection = db.collection('quests');
    var all_quest_tags = {};

    var user_location = [0, 0];

    async function init() {
        tag_db = await db.collection('tags').get()

        tag_db.forEach(tag_doc => {
            all_quest_tags[tag_doc.id] = tag_doc.data().tag_name;
        })

        navigator.geolocation.getCurrentPosition(position => {
            user_location = [position.coords.latitude, position.coords.longitude];
            console.log('user_location in position', user_location)
            update_quest_cards();
            show_map();
        });
    }
    init()

    function update_quest_cards() {
        quest_collection.get()                                       // the collection called "quests"
            .then(all_quests => {
                all_quests.forEach(doc => {                          // iterate through each doc and for each:
                    var quest_name = doc.data().quest_name;          // get the quest name
                    var quest_rating = doc.data().rate;              // get value of the "details" key
                    var quest_price = doc.data().cost;               // get the price of the quest
                    var image_name = doc.data().image_name;          // get the name of the image
                    var quest_description = doc.data().description;  // gets the description field (TODO)
                    var quest_location = doc.data().location;
                    console.log('user_location from quest cards', user_location)
                    var quest_distance = calculateDistance(user_location, quest_location);
                    var quest_tag_id_list = doc.data().tag_ids          // get the list of tag ids 

                    // Clone the contents of the quest card template element (not the parent template element)
                    let new_quest_card = $(quest_card_node).children().clone();

                    //update title and text and image
                    new_quest_card.find('.quest_name').text(quest_name);
                    new_quest_card.find('.quest_rating').text('★'.repeat(quest_rating));
                    new_quest_card.find('.quest_price').text('$'.repeat(quest_price));
                    new_quest_card.find('.quest_description').text(quest_description);
                    new_quest_card.find('.quest_distance').text(quest_distance + 'km');
                    new_quest_card.find('.quest_image').attr('src', './images/' + image_name + '.jpeg') // Find image and put in new quest card

                    if (quest_tag_id_list[0] != "") {
                        for (let i = 0; i < quest_tag_id_list.length; i++) {
                            let new_quest_tag = $(quest_tag_node).children().clone();
                            new_quest_tag.text(all_quest_tags[quest_tag_id_list[i]]);
                            new_quest_tag.appendTo(new_quest_card.find('.quest_tags_container'));
                        }
                    }


                    //Optional: give unique ids to all elements for future use
                    // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                    // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                    // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                    //attach to gallery, Example: "hikes-go-here"
                    // document.getElementById(collection + "-go-here").appendChild(newcard);

                    //i++;   //Optional: iterate variable to serve as unique ID

                    new_quest_card.appendTo('#quest_cards_go_here')
                })
            })
    }



})

function calculateDistance(current, destination) {
    // this function receives two arrays that represent coordinates and returns the distance in miles

    // calculate difference in longitude and latitude
    let longitude_difference = current[0] - destination[0]
    let latitude_difference = current[1] - destination[1]

    // calculate distance using Pythagorean theorem and convert it to mile
    let distance = ((longitude_difference ** 2 + latitude_difference ** 2) ** 0.5 * 60 * 1.60934).toFixed(1)
    return distance;
}

function show_map() {
    // Defines basic mapbox data
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
    const map = new mapboxgl.Map({
          container: 'map', // Container ID
          style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
          center: [-122.964274, 49.236082], // Starting position
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

                      // READING information from "events" collection in Firestore
                      db.collection('hikes').get().then(allEvents => {
                            const features = []; // Defines an empty array for information to be added to

                            allEvents.forEach(doc => {
                                  lat = doc.data().lat;
                                  lng = doc.data().lng;
                                  console.log(lat, lng);
                                  coordinates = [lng, lat];
                                  console.log(coordinates);
                                  // Coordinates
                                  event_name = doc.data().name; // Event Name
                                  preview = doc.data().details; // Text Preview
                                  // img = doc.data().posterurl; // Image
                                  // url = doc.data().link; // URL

                                  // Pushes information into the features array
                                  features.push({
                                        'type': 'Feature',
                                        'properties': {
                                              'description': `<strong>${event_name}</strong><p>${preview}</p> <br> <a href="/hike.html?id=${doc.id}" target="_blank" title="Opens in a new window">Read more</a>`
                                        },
                                        'geometry': {
                                              'type': 'Point',
                                              'coordinates': coordinates
                                        }
                                  });
                            });

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
                      });
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
                            userLocation = [position.coords.longitude, position.coords.latitude];
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
}

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}