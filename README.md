# Cope'er

---

This is a modern day coping mechanism built on the legible scientific data that listening to artists like Tame Impala,
Chase Atlantic and Arctic Monkeys can save you from the reality.[1]

---

This alien technology listens to the happenings of your life and prescribes you with the perfect song that you need to 
cure yourself.

## Installation

1. The code is simply and minimalistic. 
1. Clone the repository into a machine that has npm systems installed.
1. Run 
    ```npm run dev```

## Contribution

If you wish to add more and more references to the machine, kindly go through the following steps.

1. If the song is available then just go into ./src/assets/references.json, and add the words and sentences in the file.
---
1. If the song is not available then create a new child as follows:

  "  {
        "trackId": "",
        "artist": "",
        "name": "",
        "reference": [
        ]
    }  "  
1. Copy the Spotify link of a song from the Spotify App.
1. Extract the trackId from the link. (track ID is just after the spotify head endpoint)
    ```https://open.spotify.com/track/6Yj7Zhxt73uvwFFvzQXdxO```
    has the Track ID of ```6Yj7Zhxt73uvwFFvzQXdxO```
1. Enter the rest of the required details and you succesfully added a song.




[1] Gng, just trust me.