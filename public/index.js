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

    const page = document.getElementById('root')

    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    page.appendChild(container);

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

    var allSongs = [];

    //Grabs songQuantity amount of songs from library and adds them to allSongs[] in nested arrays
    function fetchAllSongs(arrayToAddTo, songQuantity) {
      let offsetValue = 0;
      while (offsetValue <= songQuantity) {
        music.api.library.songs({ limit: 100, offset: offsetValue }).then(function(results) {
          arrayToAddTo.push(results);
        }).catch(function(error) {
          window.alert(error);
        }); 
        setTimeout(placeholder(), 100);
        offsetValue += 100;
        
      }
    }

    document.getElementById('fetch-all-songs').addEventListener('click', () => {
      fetchAllSongs(allSongs, 2000);
      setTimeout(placeholder(), 5000);
      console.log(allSongs);
    });

    document.getElementById('song-fetch-by-year').addEventListener('click', () => {
      const dateInput = document.getElementById('date-input');

      page.replaceChildren();

      const container = document.createElement('div');
      container.setAttribute('class', 'container');

      page.appendChild(container);
      
      allSongs.forEach(array => {
        array.forEach(element => {
          if (typeof element.attributes.releaseDate === "string") {
            let year = element.attributes.releaseDate.substring(0,4);
            if (year === dateInput.value.substring(0,4)) {
              console.log(element.attributes.name);


              const card = document.createElement('div');
              card.setAttribute('class', 'card');

              const h1 = document.createElement('h1');
              h1.textContent = element.attributes.name + " by " + element.attributes.artistName;

              //const h3 = document.createElement('h3');
              //h3.textContent = "By: " + element.attributes.artistName;

              container.appendChild(card);

              console.log(element.attributes.artwork);

              const albumCover = document.createElement('img');
              albumCover.src = element.attributes.artwork.url.replace('{w}x{h}', '150x150');

              card.appendChild(h1);
              //card.appendChild(h3);
              card.appendChild(albumCover);


            }
          }
        })
      })


    });
    
    //Used with setTimeout() to stall program
    function placeholder(){
      
    }
    
      
      function search100LibrarySongsByYear(offsetVal, inputDateVal) {
      music.api.library.songs({ limit: 100, offset: offsetVal }).then(function(results) {
        allSongs.push(results);
        /*
        results.forEach(element => {
            if (typeof element.attributes.releaseDate === "string") {
              let year = element.attributes.releaseDate.substring(0,4);
              
              if (year === inputDateVal.substring(0,4)) {
                console.log("Songs released in " + year + ": " + element.attributes.name);
              }
            }
        });*/
      }).catch(function(error) {
        window.alert(error);
      }); 
  }

    document.getElementById('song-fetch-by-this-date').addEventListener('click', () => {
      const dateInput = document.getElementById('date-input');
      let found = false;

      music.api.library.songs({ limit: 1000, offset: 0 }).then(function(results) {
        //console.log(results);
        page.replaceChildren();

        const container = document.createElement('div');
        container.setAttribute('class', 'container');

        page.appendChild(container);
        
        console.log("Songs released on " + dateInput.value.substring(5) + ": ");
        results.forEach(element => {
            console.log(element);
            if (typeof element.attributes.releaseDate === "string") {
              let date = element.attributes.releaseDate.substring(5);
              
              if (date === dateInput.value.substring(5)) {
                //console.log(element.attributes.name);
                found = true;

                const card = document.createElement('div');
                card.setAttribute('class', 'card');

                const h1 = document.createElement('h1');
                h1.textContent = element.attributes.name + " by " + element.attributes.artistName;
                

                //const h3 = document.createElement('h3');
                //h3.textContent = "By: " + element.attributes.artistName;

                container.appendChild(card);

                console.log(element.attributes.artwork);

                const albumCover = document.createElement('img');
                albumCover.src = element.attributes.artwork.url.replace('{w}x{h}', '150x150');
                //albumCover.src = element.attributes.artwork.url;
                console.log(element.attributes.artwork.url);
                console.log(albumCover.src);
                
                console.log(albumCover);
                
                


                
                card.appendChild(h1);
                //card.appendChild(h3);
                card.appendChild(albumCover);
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
