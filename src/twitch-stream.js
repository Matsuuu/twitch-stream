export class TwitchStream extends HTMLElement {
    static TWITCH_EMBED_URL = 'https://embed.twitch.tv/embed/v1.js';
    static get attributes() {
        return {
            channel: {},
            width: { default: 940 },
            height: { default: 480 },
            theme: { default: 'dark' },
            muted: { default: false },
            autoplay: { default: true },
            chat: { default: false },
            allowfullscreen: { default: true },
            parent: { default: '' },
        };
    }

    constructor() {
        super();
        this.initialized = false;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.setDefaults();
        this.initializeTwitchEmbed();
        this.render();
    }

    getPlayer() {
        return this.embed ? this.embed.getPlayer() : null;
    }

    play() {
        this.embed.play();
    }

    pause() {
        this.embed.pause();
    }

    getChannel() {
        return this.embed.getChannel();
    }

    setChannel(channel) {
        this.setAttribute('channel', channel);
        this.embed.setChannel(channel);
    }

    getQualities() {
        return this.embed.getQualities();
    }

    setQuality(quality) {
        const qualities = this.embed.getQualities().map(q => q.name);
        if (!qualities.includes(quality)) {
            throw Error(`Quality is not valid. Valid qualities are ${qualities.join(', ')}`);
        }
        this.embed.setQuality(quality);
    }

    getMuted() {
        return this.embed.getMuted();
    }

    setMuted(muted) {
        if (muted) {
            this.setAttribute('muted', '');
        } else {
            this.removeAttribute('muted', '');
        }
        this.embed.setMuted(muted);
    }

    getVolume() {
        return this.embed.getVolume();
    }

    setVolume(volume) {
        this.embed.setVolume(volume);
    }

    async initializeTwitchEmbed() {
        if (!window.Twitch) {
            await this.importTwitch();
        }
        await this.newFrame();
        let embedElem = this.shadowRoot.querySelector('#twitch-embed');
        const embed = new Twitch.Embed(embedElem, {
            width: this.width,
            height: this.height,
            channel: this.channel,
            theme: this.theme,
            muted: this.muted,
            autoplay: this.autoplay,
            layout: this.chat ? 'video-with-chat' : 'video',
            allowfullscreen: this.allowfullscreen,
            parent: this.parent,
        });
        this.embed = embed;

        this._setEmbedListeners();
        this.initialized = true;
    }

    _setEmbedListeners() {
        this.embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
            this.dispatchEvent(new CustomEvent('twitch-stream.video.ready', { detail: { embed: this.embed } }));
        });
        this.embed.addEventListener(Twitch.Embed.VIDEO_PLAY, sessionId => {
            this.dispatchEvent(
                new CustomEvent('twitch-stream.video.play', { detail: { embed: this.embed, sessionId } }),
            );
        });
        // Set all the callback events in a loop since we are just exposing them and no extra
        // functionality is required
        const events = ['ENDED', 'PAUSE', 'PLAY', 'PLAYBACK_BLOCKED', 'PLAYING', 'OFFLINE', 'ONLINE', 'READY'];
        events.forEach(ev => {
            this.embed.addEventListener(Twitch.Player[ev], async () => {
                await this._handlePlayingState(ev);
                this.dispatchEvent(
                    new CustomEvent(`twitch-stream.${ev.toLowerCase()}`, { detail: { embed: this.embed } }),
                );
            });
        });
    }

    async _handlePlayingState() {
        await this.wait(50);
        const isPaused = this.embed.isPaused();
        if (isPaused) {
            this.setAttribute('paused', '');
            this.removeAttribute('playing');
        } else {
            this.setAttribute('playing', '');
            this.removeAttribute('paused');
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    newFrame() {
        return new Promise(resolve => window.requestAnimationFrame(resolve));
    }

    _handleAttributeChange(attributeName) {
        switch (attributeName) {
            case 'channel':
                this.setChannel(this.channel);
                break;
        }
    }

    importTwitch() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = TwitchStream.TWITCH_EMBED_URL;
            document.head.appendChild(script);

            script.onload = resolve;
            script.onerror = reject;
        });
    }

    render() {
        const content = TwitchStream.template.content.cloneNode(true);
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(content);
    }

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `<div id="twitch-embed" style="height: 100%"></div>`;
        return template;
    }

    setDefaults() {
        const attributes = TwitchStream.attributes;
        Object.keys(attributes).forEach(attr => {
            if (!this[attr]) {
                this[attr] = attributes[attr].default;
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        this[name] = newValue === '' ? true : newValue;
        if (this.initialized) {
            this._handleAttributeChange(name);
        }
    }

    static get observedAttributes() {
        const attributes = TwitchStream.attributes;
        return Object.keys(attributes).filter(attr => {
            return typeof attributes[attr].watch === 'undefined' || attributes[attr].watch;
        });
    }
}

if (!customElements.get('twitch-stream')) {
    customElements.define('twitch-stream', TwitchStream);
}
