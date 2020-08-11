# Sonos-Kids-Controller

## Content
[About Sonos-Kids-Controller](#about-sonos-kids-controller)\
[Hardware](#hardware)\
[Dependencies](#dependencies)\
[Usage](#usage)\
[Configuration](#configuration)\
[Adding Content](#adding-content)\
[Autostart](#autostart)


<img src="https://user-images.githubusercontent.com/170099/89946592-7863e480-dc23-11ea-9634-3fd8ff55852b.jpg" width="800" height="450"><br>

<img src="https://user-images.githubusercontent.com/170099/89946772-b82acc00-dc23-11ea-914e-d45263c50ab0.jpg" width="800" height="450"><br>

<img src="https://user-images.githubusercontent.com/170099/89948614-b7476980-dc26-11ea-8ff7-65ab747e7bb0.png" width="800" height="480"><br>

<img src="https://user-images.githubusercontent.com/170099/89948807-09888a80-dc27-11ea-86f2-60b15258a899.png" width="800" height="480"><br>

<img src="https://user-images.githubusercontent.com/170099/89948825-14431f80-dc27-11ea-809a-607260fed229.png" width="800" height="480"><br>

## About Sonos-Kids-Controller
This software can be used to create a touch-based Sonos controller for your kids.\
(When they start listening to more audio books than you can manage with your RFID based Toniebox clone you build for them when they were smaller.)

*Sonos-Kids-Controller uses __TTS__ (text to speech) when you click on texts in the UI, so your kids don't have to aks you anymore about the name of a specific episode.*

The recommended use case is in combination with Spotify Premium, as it's web API allows you to add albums using artist and album name instead of cryptic album-IDs. It's also possible to add multiple albums with a single search query (e.g. all albums from a sepcific artist).

But you can also add albums from the local Sonos library (in case an album isn't available in your favorite streaming service), or from Amazon Music Unlimited by specifiying the corresponding album IDs. See the music services section about how to retrieve these IDs.

The software consists of 2 parts:
* The server component, running in an node express environment. Handles the album library and serves the client component to the browser
*  The client component, developed in Ionic/angular, which can be run in the browser

## Hardware
While you can simply run this software on any server supported by node.js and open it in the browser of your choice (as long as it isn't IE or Edge), the typical use case will be a small box powered by an Raspberry Pi and a capacitive touch screen.

I recommend a 5" touch screen with a resolution of 800x480, as you otherwise might have to edit the layout of the software.

Here's a list of what I bought for my player:
* bla
* bla
* bla

## Dependencies
This software uses [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) to control your Sonos hardware. So you need to have it running somewhere, for example on the same system as this software.\
This doesn't have to be the Pi itself, but should be possible too (if it can handle everything performance-wise without any lags).

## Usage
Ensure that you have Node.js and npm installed.
Also install [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) as described in the readme of the software. 
If you plan on using Spotify, follow the instructions [here.](https://github.com/jishi/node-sonos-http-api#note-for-spotify-users)

Then install this software from Github:
```
sudo npm install -g @ionic/cli

wget https://github.com/Thyraz/Sonos-Kids-Controller/archive/master.zip

unzip master.zip

rm master.zip 

cd Sonos-Kids-Controller-master

npm install

ionic build --prod

```
Create the configuration file by making a copy of the included example:
```
cd server/config

cp config-example.json config.json
```
Edit the config file as discribed in the chapter [configuration](#configuration)

Then start the software like this:
```
npm start
```

After that open a browser window and navigate to 
```
http://ip.of.the.server:8200
```
Now the user interface should appear

## Configuration
```
{
    "node-sonos-http-api": {
        "server": "127.0.0.1",
        "port": "5005",
        "rooms": [
            "Livingroom",
            "Kitchen"
        ]
    },
    "spotify": {
        "clientId": "your_id",
        "clientSecret": "your_secret"
    }
}
```
Point the node-sonos-http-api section to the adress and the port where the service is running.
The rooms are the Sonos room names that you want to be allowed as target.

Room selection isn't implemented yet, so only the first room will be used at the moment.

The spotify section is only needed when you want to use Spotify Premium as source.
The id and the secret are the same values as entered in the node-sonos-http-api configuration as described [here.](https://github.com/jishi/node-sonos-http-api#note-for-spotify-users)

## Adding Content
There's a hidden button on the right side of the top navigation bar.
If you click there, you should see an overlay lighting up.
Click this button quickly 10 times to get in the library editor.

Then click the "+" button on the top right to add a new entry.

### Local Sonos Library:
* Enter artist name and album name exactly as it's displayed in the Sonos app.
* Enter an artwork link for an artwork image (remember, you can open the UI on any browser, so you can use a desktop pc or an mobile phone to add items to the library and use copy and paste for artwork links.)
A good source for album artworks is the iTunes Artwork Finder: https://bendodson.com/projects/itunes-artwork-finder/

### Spotify Premium:
* Enter artist and album name to add a single album
* Add a query instead to search for multiple albums
* Album artwork will automatically retreived from Spotify

Examples for query strings:
```
artist: Max Kruse album: Urmel

artist:Grüffelo

artist:Benjamin Blümchen album:folge NOT gute-nacht

artist:"Super Wings"
```

More details on Spotify web API search querys:
https://developer.spotify.com/documentation/web-api/reference/search/search/#writing-a-query---guidelines


## Autostart

