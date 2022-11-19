This project is the mobile app version of Ogcisum made with [React Native](https://reactnative.dev/).

<br>

# Overview
**Ogcisum** is a web app and a mobile app for a music and location based experience similar to [Pokemon GO](https://pokemongolive.com/en/). When users are within 100 meters of a pre-defined location, they can play music when there is any.

<br>

# Getting Started

## Prerequisites
1. Computer with MacOS installed.
2. React Native development environment.
3. Haz API local server.


## Setting up the development environment
Make sure you have set up React Native development environent in your Mac. If not, follow [this documentation](https://reactnative.dev/docs/environment-setup).

After setting up the environment, follow these steps:
### Step 1: Install the dependencies stated in `package.json`: 
```bash
npm install
```

### Step 2: For iOS, install the required pods configured in `Podfile`:

**Attention!** if you are using MacOS with Apple Silicone (e.g M1/M2), use this command:
```bash
cd ios
sudo arch -arm64 pod install
```

If you're using MacOS with Intel chip, use this command:
```bash
cd ios
pod install
```


## Haz API local server
Since this project is only the front-end part, you have to set up the [Haz API](https://github.com/hazlazuardi/haz-api) back-end app before spinning up the mobile app and try its features.

Follow [this documentation](https://github.com/hazlazuardi/haz-api) to set up the local server.


<br>

# Running the App

## Haz API local server
Before spinning up the web app, make sure to run the [Haz API](https://github.com/hazlazuardi/haz-api) back-end server. 

Follow [this documentation](https://github.com/hazlazuardi/haz-api) to run the local server.

## Ogcisum iOS App

### Step 1: Start Metro:
Navigate to the root project directory. Then, use this command:
```bash
npx react-native start
```

The main dependencies used in this project:
1. [React Navigation](https://reactnavigation.org/), for the bottom tabs navigation.
2. [react-native-maps](https://github.com/react-native-maps/react-native-maps), for embedding native maps.
3. [@react-native-community/geolocation](https://github.com/michalchudziak/react-native-geolocation), for getting the user’s current location.
4. [Geolib](https://github.com/manuelbieh/geolib), to calculate distances between coordinates.
5. [React Native WebView](https://github.com/react-native-webview/react-native-webview), for running the sounds via Tone.js in a webpage.
6. [WMP COMP2140](https://wmp.interaction.courses/playback-webview/), the web for running the sounds via Tone.js in a webpage.
7. [React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker), for taking & selecting photos from the system’s photo library.
8. [react-native-linear-gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient), for making the tab bar gradient without images.


### Step 2: Run the app with XCode simulator:
```bash
npx react-native run-ios
```

<br>

# Features
1. See the pre-defined locations in Map page.
2. Preview samples shared with a location in Now Playing page.
3. Set a profile picture and profile name in Profile page.

<br>

# Pages

## Map page

<div style="display: flex; width: 100%;">
<figure>
    <img
    src="https://mattluscombe.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fdacdf3bc-49aa-4a75-b475-256ddf23cd87%2FHow_Should_the_App_Look__Function.003.png?table=block&id=32d3f4ab-6a07-4314-b199-903b8342ef9e&spaceId=3a1e6697-269f-42da-bfc5-96b033e213cf&width=2000&userId=&cache=v2"> 
    <figcaption>Map page: When there's no music nearby<figcaption>
</figure>
<br>
<figure>
    <img
    src="https://mattluscombe.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F417ee4d3-1c12-4a7b-aca2-d935bde3f53b%2FHow_Should_the_App_Look__Function.001.png?table=block&id=333ed7db-974a-44f9-871a-3f2c0e0be5a6&spaceId=3a1e6697-269f-42da-bfc5-96b033e213cf&width=2000&userId=&cache=v2"
    >
    <figcaption>Map page: When there's music nearby<figcaption>
</figure>
<br>
</div>

</br>

- See the pre-defined locations represented by purple circles.
    - Each circle has a radius of 100 meters from a location's coordinate.
- See indicator at the Bottom Tab Bar when there's music to play nearby.

<br>

## Now Playing page

<div style="display: flex; width: 100%;">
<figure>
    <img
    src="https://mattluscombe.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Ff3193555-37c9-4928-b80a-0d1f493bbe9d%2FHow_Should_the_App_Look__Function.004.png?table=block&id=b37681f3-cd96-4294-9653-2b12c2809273&spaceId=3a1e6697-269f-42da-bfc5-96b033e213cf&width=2000&userId=&cache=v2"> 
    <figcaption>Now Playing page: When there's no music nearby<figcaption>
</figure>
<br>
<figure>
    <img
    src="https://mattluscombe.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F2a922155-3cb8-4c9b-a3cf-ab631f00f769%2FHow_Should_the_App_Look__Function.002.png?table=block&id=0b2ea777-79e2-4fc6-99b2-e3bf015e32a2&spaceId=3a1e6697-269f-42da-bfc5-96b033e213cf&width=2000&userId=&cache=v2"
    >
    <figcaption>Now Playing page: When there's music nearby<figcaption>
</figure>
<br>
</div>

</br>

- See the location information.
- Play/Stop music shared with the location by clicking the `Play button`.
- See profile picture and profile name.

<br>

## Profile page

<div style="display: flex; width: 100%;">
<figure>
    <img
    src="https://mattluscombe.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F382612cd-39c1-4223-a31d-e2c2729568f3%2FHow_Should_the_App_Look__Function.005.png?table=block&id=192638f3-680f-4ebc-ac47-4bb7d9b5ce1e&spaceId=3a1e6697-269f-42da-bfc5-96b033e213cf&width=2000&userId=&cache=v2"> 
    <figcaption>Profile page: When no photo and name added<figcaption>
</figure>
<br>
<figure>
    <img
    src="https://mattluscombe.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe20e0b80-8a0a-4725-a7e8-46772fe81559%2FHow_Should_the_App_Look__Function.006.png?table=block&id=95d8ec1a-b2d5-4a17-8348-e260ae0d8ff1&spaceId=3a1e6697-269f-42da-bfc5-96b033e213cf&width=2000&userId=&cache=v2"
    >
    <figcaption>Profile page: When a photo and name added<figcaption>
</figure>
<br>
</div>
</br>

- Add a profile picture by clicking the `Add Photo button`.
- Change the profile picture by clicking the `Change Photo button`.
- Set / change the profile name by typing in the `Text Input`.

<br>

# Known Minor Issues

## No sound when playing music
**Solution —** Toggle / Un-toggle the `Physical Silent button` on the left side of the phone in the simulator.

## Keyboard does not show up in iOS simulator
**Solution —** Toggle / Un-toggle the `Connect Hardware Keyboard` in the `I/O > Keyboard` setting of the simulator.
