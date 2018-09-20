importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-messaging.js')

var config = {
    apiKey: "AIzaSyDevJziMzAlMpErfarI9Q1DcBGU6JF-EF8",
    authDomain: "explorefirebase-80b58.firebaseapp.com",
    databaseURL: "https://explorefirebase-80b58.firebaseio.com",
    projectId: "explorefirebase-80b58",
    storageBucket: "explorefirebase-80b58.appspot.com",
    messagingSenderId: "994024778201"
  };
  firebase.initializeApp(config);

  const messaging = firebase.messaging()
  messaging.setBackgroundMessageHandler(function(payload){
      const title = payload.data.title
      const options = {
          body:payload.data.status
      }
      return self.registration.showNotification(title,options)
  })