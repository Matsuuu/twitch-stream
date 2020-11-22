![Twitch Stream Component logo](twitch-stream.png)

# TwitchStream

TwitchStream is a Web Component for embedding a Twitch Stream onto any web site with just 2 lines of HTML.

Check out a Demo [here](https://matsuuu.github.io/twitch-stream/)

## Installation

### NPM

```bash
npm install twitch-stream-embed
```

### CDN

```html
<script type="module" src="https://unpkg.com/twitch-stream-embed"></script>
```

## Usage

### With NPM

```javascript
import 'twitch-stream-embed';

<twitch-stream channel="ESL_SC2"></twitch-stream>;
```

### With CDN

```html
<script type="module" src="https://unpkg.com/twitch-stream-embed"></script>

<twitch-stream channel="ESL_SC2" chat muted></twitch-stream>
```

## Attributes

| Name            | Type          | Options                                                                                                                             |
| --------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Channel         | String        | Any channel name on Twitch.tv                                                                                                       |
| Width           | String/Number | Percentage or a Number                                                                                                              |
| Height          | String/Number | Percentage or a Number                                                                                                              |
| Theme           | String        | dark / light                                                                                                                        |
| Muted           | Boolean       | Add the "muted" attribute to start stream muted                                                                                     |
| Autoplay        | Boolean       | Add 'autoplay="false"' to disable autoplay                                                                                          |
| Chat            | Boolean       | Add the "chat" attribute to show chat next to the stream                                                                            |
| Allowfullscreen | Boolean       | Add 'allowfullscreen="false"' to disallow fullsreen viewing                                                                         |
| Parent          | String        | Only required if your site is embedded on any domain(s) other than the one that instantiates the Twitch Embed e.g. "codesandbox.io" |

## API

| Name                | Parameters                                                     | Description                                          |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| getPlayer()         |                                                                | Returns the Player instance                          |
| play()              |                                                                | Resume / Start the stream                            |
| pause()             |                                                                | Pause the stream                                     |
| getChannel()        |                                                                | Get the name of the channel currently being streamed |
| setChannel(channel) | channel: Name of the channel                                   | Set the active stream component to given channel     |
| getQualities()      |                                                                | Get the available video qualities for the stream     |
| setQuality(quality) | quality: String containing the quality identifier. e.g. "360p" | Set the stream quality to given quality              |
| getMuted()          |                                                                | Get the muted status of the active stream            |
| setMuted(isMuted)   | isMuted: Boolean, if the stream should be muted or not         | Set the muted status to given value (true/false)     |
| getVolume()         |                                                                | Get the current volume of the stream                 |
| setVolume(volume)   | volume: A float value between 0.0 and 1.0                      | Set the current volume of the stream                 |
