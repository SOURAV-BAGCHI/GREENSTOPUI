export let config={
    hostname:'https://api1.greenstop.in/',
    //  hostname:'https://api1.greenstop.in/',
    // hostname:'http://localhost:5000/',
    
    //  globalsite:'http://localhost:4200',
    globalsite:'https://greenstop.in',
    //  globalsite:'https://gs.trikaltech.com',


    // subscribe_hostname:'http://localhost:5001/',
    // subscribe_hostname:'https://notificationapi1.greenstop.in/',
    subscribe_hostname:'https://api1.greenstop.in/',

    //  firebaseConfig :{
    //     apiKey: "AIzaSyBpXONGpJZhKStGLhQaG3aECT-hV7fiAGc",
    //     authDomain: "greenstoptest.firebaseapp.com",
    //     projectId: "greenstoptest",
    //     storageBucket: "greenstoptest.appspot.com",
    //     messagingSenderId: "720771269395",
    //     appId: "1:720771269395:web:6a87948a70eec6713d50e6"
    //   },
    firebaseConfig : {
      apiKey: "AIzaSyBrvwVC4Xgg9NN7ut9FLjb0m8MadcQj3Iw",
      authDomain: "greenauth-a534b.firebaseapp.com",
      projectId: "greenauth-a534b",
      storageBucket: "greenauth-a534b.appspot.com",
      messagingSenderId: "517330349041",
      appId: "1:517330349041:web:1428f0075004ab6649b250"//,
      //measurementId: "G-V84BV1LWKQ"
    },
      deliveryTimeIdValue:new Map([[1,"11 am - 12 pm"],[2,"12 pm - 1 pm"],[3,"1 pm - 2 pm"],
                            [4,"2 pm - 3 pm"],[5,"3 pm - 4 pm"],[6,"4 pm - 5 pm"],
                            [7,"5 pm - 6 pm"],[8,"6 pm - 7 pm"],[9,"7 pm - 8 pm"],
                            [10,"8 pm - 9 pm"],[11,"9 pm - 10 pm"]
    ])
}