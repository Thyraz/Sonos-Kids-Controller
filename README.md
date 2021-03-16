# Sonos-Kids-Controller

## Content
[About Sonos-Kids-Controller](#about-sonos-kids-controller)\
[Dependencies](#dependencies)\
[Usage](#usage)\
[Configuration](#configuration)\
[Adding Content](#adding-content)\
[Autostart](#autostart)\
[Update](#update)\
[Hardware Player](#hardware-player)

<img src="https://user-images.githubusercontent.com/170099/89946592-7863e480-dc23-11ea-9634-3fd8ff55852b.jpg" width="800" height="450"><br>

<img src="https://user-images.githubusercontent.com/170099/89946772-b82acc00-dc23-11ea-914e-d45263c50ab0.jpg" width="800" height="450"><br>

<img src="https://user-images.githubusercontent.com/170099/89948614-b7476980-dc26-11ea-8ff7-65ab747e7bb0.png" width="800" height="480"><br>

<img src="https://user-images.githubusercontent.com/170099/89948807-09888a80-dc27-11ea-86f2-60b15258a899.png" width="800" height="480"><br>

<img src="https://user-images.githubusercontent.com/170099/89948825-14431f80-dc27-11ea-809a-607260fed229.png" width="800" height="480"><br>

## About Sonos-Kids-Controller
This software can be used to create a touch-based Sonos controller for your kids.

It can also be used with Spotify Connect compatible devices instead of Sonos if you use [this software](https://github.com/amueller-tech/spotifycontroller) instead of the node-sonos-http-api discribed later in this document.

*Sonos-Kids-Controller uses __TTS__ (text to speech) when you click on texts in the UI, so your kids don't have to aks you anymore about the name of a specific episode.*

The recommended use case is in combination with Spotify Premium, as it's web API allows you to add albums using artist and album name instead of cryptic album-IDs. It's also possible to add multiple albums with a single search query (e.g. all albums from a sepcific artist).

But you can also add albums from the local Sonos library (in case an album isn't available in your favorite streaming service), from Apple Music or from Amazon Music Unlimited by specifiying the corresponding album IDs. See the music services section about how to retrieve these IDs.

The software consists of 2 parts:
* The server component, running in an node express environment. Handles the album library and serves the client component to the browser
*  The client component, developed in Ionic/Angular, which can be opened in a browser

## Dependencies
This software uses [node-sonos-http-api](https://github.com/Thyraz/node-sonos-http-api) to control your Sonos hardware. __So you need to have it running somewhere, for example on the same system as this software__.\
This doesn't have to be the Pi itself, but should be possible too (if it can handle everything performance-wise without any lags).

## Usage
Ensure that you have Node.js and npm installed.
Also install [node-sonos-http-api](https://github.com/Thyraz/node-sonos-http-api) as described in the readme of the software. 
If you plan on using Spotify, follow the instructions [here.](https://github.com/Thyraz/node-sonos-http-api#note-for-spotify-users)

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
The id and the secret are the same values as entered in the node-sonos-http-api configuration as described [here.](https://github.com/Thyraz/node-sonos-http-api#note-for-spotify-users)

## Adding Content
There's a hidden button in the root view on the right side of the top navigation bar.
If you click there, you should see an overlay lighting up.
Click this button quickly 10 times to open the library editor.

Then click the "+" button on the top right to add a new entry.

### Local Sonos Library:
* Enter artist name and album name exactly as it's displayed in the Sonos app.
* Enter an artwork link for an artwork image (remember, you can open the UI on any browser, so you can use a desktop pc or an mobile phone to add items to the library and use copy and paste for artwork links.)
A good source for album artworks is the iTunes Artwork Finder: https://bendodson.com/projects/itunes-artwork-finder/

### Spotify Premium:
* Enter artist and album name to add a single album
* Add a query instead, to search for multiple albums
* Album artwork will be automatically retreived from Spotify

Examples for query strings:
```
artist:Max Kruse album:Urmel

artist:Grüffelo

artist:Benjamin Blümchen album:folge NOT gute-nacht

artist:"Super Wings"
```

More details on Spotify web API search querys:
https://developer.spotify.com/documentation/web-api/reference/search/search/#writing-a-query---guidelines

### Apple Music or Amazon Music Unlimited:
* Enter artist name and album name as they should be displayed in the UI.
* Enter the album ID which can be discovered as described here: https://github.com/jishi/node-sonos-http-api#spotify-apple-music-and-amazon-music-experimental
* Enter an artwork link for an artwork image (remember, you can open the UI on any browser, so you can use a desktop pc or an mobile phone to add items to the library and use copy and paste for artwork links.)
A good source for album artworks is the iTunes Artwork Finder: https://bendodson.com/projects/itunes-artwork-finder/

Pro Tip:
As Amazon and Apple don't provide a full public API to search for content like Spotify does, adding AlbumIDs and artwork links through the UI might be time consuming and complicated.
you can also edit the library by editing _server/config/data.json_ (created after you added the first content through the UI).
The structure should be self-explaining.
Just be sure to shutdown Sonos-Kids-Controller before editing the file, as the software might otherwise overwrite your changes with an in-memory copy of the data.
Also a backup of the file might be a good idea, as the software might overwrite the file with an empty library on startup, when you have some syntax errors in your edits, preventing the data from loading.


## Autostart
I use pm2 as process manager for node.js projects.
So both services (node-sonos-http-api and Sonos-Kids-Controller) are startet on boot time in this case

```
sudo npm install pm2 -g
```
Then build a startup script for pm2 (don't run with sudo):
```
pm2 startup
```
after that pm2 should show you a command that has to be run as sudo to finish install the startup scripts.
Copy and paste it into the terminal and execute it.

then in the directory of node-sonos-http-api:
```
pm2 start server.js
pm2 save
```

again in the directory of Sonos-Kids-Controller:
```
pm2 start server.js
pm2 save
```

After a reboot, enter `pm2 list` in the terminal and you should see that the 2 services are running. 

## Update
Updating to a newer Sonos-Kids-Controller version works similar to the initial installation.
Execute these commands, starting from the parent directory of you current _Sonos-Kids-Controller-master_ installation:
```
wget https://github.com/Thyraz/Sonos-Kids-Controller/archive/master.zip

unzip master.zip

rm master.zip 

cd Sonos-Kids-Controller-master

npm install

ionic build --prod

```
If you run into out of memory erros during the build process, try to set a memory limit manually:

```
export NODE_OPTIONS=--max-old-space-size=3072

ionic build --prod
```

## Hardware Player
While you can simply run this software on any server supported by node.js and open it in the browser of your choice (as long as it isn't IE or Edge), the typical use case will be a small box powered by an Raspberry Pi and a capacitive touch screen.

I recommend a 5" touch screen with a resolution of 800x480, as you otherwise might have to edit the layout of the software.

### Part List:

Here's a list of what I bought for my player:
* [Raspberry Pi 3b](https://www.amazon.de/gp/product/B01CD5VC92/)
* [Micro SD card](#https://www.amazon.de/gp/product/B073JWXGNT/)
* [Power Supply](https://www.amazon.de/gp/product/B07NW9NXGF/)
* [Capacitive 5 inch touchscreen](https://www.amazon.de/gp/product/B07YCBWRQP/)
* [Flat HDMI cable](https://www.amazon.de/gp/product/B07R9RXWM5/)
* [Tilted micro USB cable](https://www.amazon.de/gp/product/B01N26RAL6/)\
(use a cutter knive to remove some of the isolation of the tilted connector to save some more height)
* [Small kitchen storage box as case](https://www.amazon.de/gp/product/B0841PZZ2C/) (ATTENTION: you need the mid sized box: 15.8cm x 12cm)
* The bottom part of a raspberry case like [this one](https://www.amazon.de/schwarz-Gehäuse-Raspberry-neueste-Kühlkörper/dp/B00ZHG7AP0/) where you can tighten the raspberry without the need to drill holes in the backside of the jukebox
* Tesa Powerstrips to fix the raspberry inside the jukebox

### Front Cover Cutout:

As first step, choose the position of the cutout for the touchscreen in the wooden front cover.
Pay attention how far the HDMI and USB connectors stick out of the touch screen.
Because of that you won't be able to center the touchscreen vertically in the front cover.

After that I drilled 4 holes in each edge of the cutout.
Then I used a fredsaw to remove the part between the holes.
Keep the cutout a little bit smaller than the touchscreen, as working with a fredsaw might not be that precise.

Now the hard part begins:\
Tweak the shape of the cutout with a rasp until the touchscreen fits in tightly.
This might take a while and I recommend to hold the touchscreen and the cover in front of each other toward a light source from time to time, to see where you need to remove more of the wood.

When the touchscreen fits into the cutout, use sand paper to smooth the surface. I started with grain size 80 and ended with 300.
If you want an uniform look, use the finer grained sandpaper also on the front surface of the wood and apply some wood oil everywhere for a consistant looking finish.

### Assembly:
Cut off the connector of the power supply, and drill a hole for the cable in the back of the case.
Stick the cable through the hole and solder the connector back on.

Assemble the Pi in the bottom part of the raspberry case and use the Powerstrips to attach it inside the box.

If the touchscreen isn't sitting tight enough in the cutout, use __short__ screws to attach it to the front cover.
Maybe predrill the holes, so the wood won't crack.

Connect the cables, insert the microSD card and you're done.
The wooden front cover should stick firmly if you press it onto the backside. I didn't need any screws to hold it in place.
If you need to open it again, push a knive between the front cover and the backside and use it as lever. 

### Kiosk Mode Installation

Use raspbian light (currently Buster is the latest stable version as I write this readme) as we don't want to install the default desktop environment.

a) because we don't need it\
b) because our Ionic/Angular app will stress the Pi enough, so we want to avoid too much running services and RAM usage.

edit the config.txt in the boot partition and add the following lines at the end to configure the display:
```
max_usb_current = 1 
Hdmi_group = 2 
Hdmi_mode = 87 
Hdmi_cvt 800 480 60 6 0 0 0 
```
After the initial boot process, start `raspi-config` and configure:
* Localisation options and keyboard layout
* Configure Wifi
* Enable SSH if you wish to be able to log into the box remotely
* Disable HDMI overscan in the advanced option
* Change user password for pi
* In _Boot Options_ Select 'Desktop/CLI' and then 'Console Autologin' for automatic login of the user pi

Now reboot the Pi. If everything worked, you should be logged into the terminal session without having to enter you password at the end the boot process.

Update all preinstalled packages:
```
sudo apt-get update
sudo apt-get upgrade

```
Now we install Openbox as a lightweight window manager:
```
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
```
And Chromium as a browser:
```
sudo apt-get install --no-install-recommends chromium-browser
```

You can now install node-sonos-http-api and Sonos-Kids-Controller on the Pi (as described in the previous chapters) if you don't want to run it on a different server.
Depending on where the services are running edit the automatic startup of Openbox and Chromium in _/etc/xdg/openbox/autostart_ 


```
# Disable screen saver / power management
xset s off
xset s noblank
xset -dpms

# Start Chromium
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences
chromium-browser --disable-infobars --kiosk 'http://url-to-sonos-kids-controller:8200'
```

Now Chromium should display our web app when Openbox is started.
The last thing to do is to start the X server automatically when the Pi is powered on.
As we already have automatic login in the terminal session,
we can use __.bash_profile__ for starting X.
Append the following line to the file:
```
[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor
```
This starts X when the user logged into the first system terminal (which is the one autologin uses).

Restart the pi to see if everything works.

If you see a bubble in Chromium after some time, about Chromium not beeing up to date, use this workaround from [StackOverflow](https://stackoverflow.com/questions/58993181/disable-chromium-can-not-update-chromium-window-notification) and execute the following command:
```
sudo touch /etc/chromium-browser/customizations/01-disable-update-check;echo CHROMIUM_FLAGS=\"\$\{CHROMIUM_FLAGS\} --check-for-update-interval=31536000\" | sudo tee /etc/chromium-browser/customizations/01-disable-update-check
```

## Docker
An easy and fast way to deploy Sonos-Kids-Controller is using docker. Using docker avoids the compilation on small hardware. This repository contains a Dockerfile to build a container image. 

Docker image is provided [here](https://github.com/stepman0/docker-sonos-kids-controller).
