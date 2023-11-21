import { update_quest_cards, initialize_map, update_map, toggle_view } from './modules/quest_display.js';

$(document).ready(function () {
      var all_quest_tags = {};
      var all_keywords = []

      var user_location = [0, 0];
      var quest_db, tag_db, quest_html_node, tag_html_node, quest_name_collection, user_doc;

      /**
       * Initialize the page by retrieving necessary data
       * 
       * This should: Get the player location, get a list of tag names, get a list of quest names, display the search bar and (?) an empty map.
       */
      async function init() {
            var map;
            navigator.geolocation.getCurrentPosition(async position => {                          // Get player position
                  user_location = [position.coords.latitude, position.coords.longitude];
                  console.log('user_location in position', user_location)
                  map = await initialize_map(user_location);
                  document.getElementById('search_button').current_map = map;

            });

            await firebase.auth().onAuthStateChanged(async user => {
                  // Check if user is signed in:
                  if (user) {
                        [quest_db, tag_db, quest_html_node, tag_html_node, quest_name_collection, user_doc] = await Promise.all([
                              await db.collection('quests').get(),
                              await db.collection('tags').get(),
                              $.get('reusable_html/quest_card.html'), // Quest card template from reusable html
                              $.get('reusable_html/quest_tag.html'),
                              db.collection('quest_names').doc('NJYbhL8TFCSnv3peyJPv').get(),
                              await db.collection('users').doc(user.uid).get()
                        ])
                        // We're using strict mode now so add all these to the search button so it can access them in the event listener
                        document.getElementById('search_button').quest_html_node = quest_html_node
                        document.getElementById('search_button').tag_html_node = tag_html_node
                        document.getElementById('search_button').user_location = user_location
                        document.getElementById('search_button').all_quest_tags = all_quest_tags

                        let quest_names = quest_name_collection.data().all_quest_names;
                        console.log(`all quest names: ${quest_names}`)
                        for (let i = 0; i < quest_names.length; i++) {
                              console.log(`quest name: ${quest_names[i]}`)
                              let quest_name_keywords = quest_names[i].split(' ')
                              console.log(`keywords: ${quest_name_keywords}`)
                              for (let j = 0; j < quest_name_keywords.length; j++) {
                                    if (!all_keywords.includes(quest_name_keywords[j])) {
                                          all_keywords.push(quest_name_keywords[j]);
                                    }
                              }
                        }
                        console.log(`all keywords from quest name: ${all_keywords}`)
                        tag_db.forEach(tag_doc => {
                              all_quest_tags[tag_doc.id] = tag_doc.data().tag_name;
                              all_keywords.push(tag_doc.data().tag_name)                            // add tag names to tag array
                        })

                        console.log('all keywords with tags', all_keywords)
                        /*initiate the autocomplete function on the "myInput" element, and pass along the keyword array as possible autocomplete values:*/
                        autocomplete(document.getElementById("myInput"), all_keywords);
                  } else {
                        alert('user is not logged in!')
                  }
            });



      }

      function autocomplete(inp, arr) {
            /*the autocomplete function takes two arguments,
            the text field element and an array of possible autocompleted values:*/
            var currentFocus;
            /*execute a function when someone writes in the text field:*/
            inp.addEventListener("input", function (e) {
                  var a, b, i, val = this.value;
                  /*close any already open lists of autocompleted values*/
                  closeAllLists();
                  if (!val) { return false; }
                  currentFocus = -1;
                  /*create a DIV element that will contain the items (values):*/
                  a = document.createElement("DIV");
                  a.setAttribute("id", this.id + "autocomplete-list");
                  a.setAttribute("class", "autocomplete-items");
                  /*append the DIV element as a child of the autocomplete container:*/
                  this.parentNode.appendChild(a);
                  /*for each item in the array...*/
                  let count = 0;
                  for (i = 0; i < arr.length; i++) {
                        /*check if the item starts with the same letters as the text field value:*/
                        if (arr[i].toUpperCase().includes(val.toUpperCase())) { // EDIT to include any overlap
                              /*create a DIV element for each matching element:*/
                              b = document.createElement("DIV");
                              /*make the matching letters bold:*/
                              b.innerHTML += arr[i];
                              /*insert a input field that will hold the current array item's value:*/
                              b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                              /*execute a function when someone clicks on the item value (DIV element):*/
                              b.addEventListener("click", function (e) {
                                    /*insert the value for the autocomplete text field:*/
                                    inp.value = this.getElementsByTagName("input")[0].value;
                                    /*close the list of autocompleted values,
                                    (or any other open lists of autocompleted values:*/
                                    closeAllLists();
                              });
                              a.appendChild(b);
                              count++;
                        }
                        if (count >= 4) {     // Break when 4 suggestions reached (Prevents long lists)
                              break;
                        }
                  }
            });
            function closeAllLists(elmnt) {
                  /*close all autocomplete lists in the document,
                  except the one passed as an argument:*/
                  var x = document.getElementsByClassName("autocomplete-items");
                  for (var i = 0; i < x.length; i++) {
                        if (elmnt != x[i] && elmnt != inp) {
                              x[i].parentNode.removeChild(x[i]);
                        }
                  }
            }
            /*execute a function when someone clicks in the document:*/
            document.addEventListener("click", function (e) {
                  closeAllLists(e.target);
            });
      }
      /**
       * Initiate search for keywords in search bar and load relevant quests
       */

      $('#search_button').on('click', async function (event) {
            console.log('clicked search');
            let search_text = $('#myInput').val().toLowerCase();             // put text to lowercase to match keywords
            console.log('search text:', search_text);
            let search_keywords = search_text.split(' ');                    // split text into array of words
            let final_search_keywords = []
            for (let i = 0; i < search_keywords.length; i++) {
                  let current = search_keywords[i].toLowerCase()
                  console.log(`current keyword: ${current}`)
                  for (let j = 0; j < all_keywords.length; j++) {
                        console.log(`checking against: ${all_keywords[j].toLowerCase() }`)
                        if (all_keywords[j].toLowerCase().includes(current)) {
                              console.log(`match found: ${all_keywords[j]}`)
                              final_search_keywords.push(all_keywords[j].toLowerCase())
                        }
                  }
            }

            while (final_search_keywords.length >= 10) {
                  final_search_keywords.pop()
            }

            console.log('final search keywords:', final_search_keywords);
            let search_results = await db.collection('quests')               // get quests
                  .where('keywords', 'array-contains-any', final_search_keywords).get(); // where quest keywords contain any word in search array
            console.log('TEST', event.currentTarget.current_map)
            update_map(event.currentTarget.current_map, search_results);                                      // update map with results
            update_quest_cards(
                  search_results,
                  quest_html_node,
                  tag_html_node,
                  user_location,
                  all_quest_tags,
                  user_doc
            );                              // update cards with results
      })

      init()
      $('#quest_cards_go_here').hide();

})

$('#view_toggle').on('click', toggle_view)
