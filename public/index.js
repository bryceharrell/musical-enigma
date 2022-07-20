// listen for MusicKit Loaded callback
document.addEventListener('musickitloaded', () => {
  // MusicKit global is now defined
  fetch('/token').then(response => response.json()).then(res => {
    /***
      Configure our MusicKit instance with the signed token from server, returns a configured MusicKit Instance
      https://developer.apple.com/documentation/musickitjs/musickit/musickitinstance
    ***/
    const music = MusicKit.configure({
      developerToken: res.token,
      app: {
        name: 'AppleMusicKitExample',
        build: '1978.4.1'
      }
    });

    // setup click handlers
    document.getElementById('add-to-q-btn').addEventListener('click', () => {
      const idInput   = document.getElementById('id-input');
      const typeInput = document.getElementById('type-input');

      /***
        Add an item to the playback queue
        https://developer.apple.com/documentation/musickitjs/musickit/musickitinstance/2992716-setqueue
      ***/
      music.setQueue({
        [typeInput.value]: idInput.value
      });

      idInput.value   = '';
      typeInput.value = '';
    });


    document.getElementById('song-fetch-by-year').addEventListener('click', () => {
      const dateInput = document.getElementById('date-input');


      music.api.library.songs({ limit: 1000, offset: 0 }).then(function(results) {
        console.log(results);
        //console.log(dateInput.value);
        results.forEach(element => {
            if (typeof element.attributes.releaseDate === "string") {
              let year = element.attributes.releaseDate.substring(0,4);
              
              if (year === dateInput.value.substring(0,4)) {
                console.log("Songs released in " + year + ": " + element.attributes.name);
              }
            }
            
           
        });
      }).catch(function(error) {
        window.alert(error);
      });
    });

    document.getElementById('song-fetch-by-this-date').addEventListener('click', () => {
      const dateInput = document.getElementById('date-input');


      music.api.library.songs({ limit: 1000, offset: 0 }).then(function(results) {
        //console.log(results);
        let found = false;
        //console.log(dateInput.value);
        results.forEach(element => {
            if (typeof element.attributes.releaseDate === "string") {
              let year = element.attributes.releaseDate.substring(5);
              
              if (year === dateInput.value.substring(5)) {
                console.log("Songs released on " + dateInput.value.substring(5) + ": " + element.attributes.name);
                found = true;
              }
            }
            
           
        });
        if (found == false) {
          console.log("No songs were released on this date.")
        }
      }).catch(function(error) {
        window.alert(error);
      });
    });

    

    document.getElementById('play-btn').addEventListener('click', () => {
      /***
        Resume or start playback of media item
        https://developer.apple.com/documentation/musickitjs/musickit/musickitinstance/2992709-play
      ***/
      music.play();
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
      /***
        Pause playback of media item
        https://developer.apple.com/documentation/musickitjs/musickit/musickitinstance/2992708-pause
      ***/
      music.pause();
    });

    document.getElementById('login-btn').addEventListener('click', () => {
      /***
        Returns a promise which resolves with a music-user-token when a user successfully authenticates and authorizes
        https://developer.apple.com/documentation/musickitjs/musickit/musickitinstance/2992701-authorize
      ***/
      music.authorize().then(musicUserToken => {
        console.log(`Authorized, music-user-token: ${musicUserToken}`);
      });
    });

    // expose our instance globally for testing
    window.music = music;
  });
});
