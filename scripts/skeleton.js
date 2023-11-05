//            _..--""---.
//           /           ".
//           `            l
//           |'._  ,._ l/"\
//           |  _J<__/.v._/
//            \( ,~._,,,,-)
//             `-\' \`,,j|    JOHN SKELLINGTON AT YOUR SERVICE
//                \_,____J
//           .--.__)--(__.--.
//          /  `-----..--'. j
//          '.- '`--` `--' \\
//         //  '`---'`  \-' \\
//        //   '`----'`.-.-' \\
//      _//     `--- -'   \' | \________
//     |  |         ) (      `.__.---- -'\
//      \7          \`-(               74\\\
//      ||       _  /`-(               l|//7__
//      |l    ('  `-)-/_.--.          f''` -.-"|
//      |\     l\_  `-'    .'         |     |  |
//      llJ   _ _)J--._.-('           |     |  l
//      |||( ( '_)_  .l   ". _    ..__I     |  L
//      ^\\\||`'   "   '"-. " )''`'---'     L.-'`-.._
//           \ |           ) /.              ``'`-.._``-.
//           l l          / / |                      |''|
//            " \        / /   "-..__                |  |
//            | |       / /          1       ,- t-...J_.'
//            | |      / /           |       |  |
//            J  \  /"  (            l       |  |
//            | ().'`-()/            |       |  |
//           _.-"_.____/             l       l.-l
//       _.-"_.+"|                  /        \.  \
// /"\.-"_.-"  | |                 /          \   \
// \_   "      | |                1            | `'|
//   |ll       | |                |            i   |
//   \\\       |-\               \j ..          L,,'. `/
//  __\\\     ( .-\           .--'    ``--../..'      '-..
//    `'''`----`\\\\ .....--'''
//               \\\\                                 ''


//---------------------------------------------------
// This function loads the reusable html 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //if the pointer to "user" object is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log($('#reusable_header').load('./reusable_html/top_nav_after_login.html'));
            console.log($('#reusable_footer').load('./reusable_html/bottom_nav.html'));
        } else {
            // No user is signed in.
            console.log($('#reusable_header').load('./reusable_html/top_nav_before_login.html'));
            console.log($('#reusable_footer').load('./reusable_html/bottom_nav.html'));
        }
    });
}
loadSkeleton(); //invoke the function