export default class TwitchStream extends HTMLElement {
    static get properties() {
        return {
            channel: {},
            width: { default: 940 },
            height: { default: 480 },
            theme: { default: 'dark' },
            muted: { default: false },
            autoplay: { default: true },
            nochat: { default: false },
        };
    }

    constructor() {
        super();
        this.setDefaults();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(TwitchStream.template.content.cloneNode(true));
    }

    connectedCallback() {
        this.initializeTwitchEmbed();
    }

    async initializeTwitchEmbed() {
        if (!window.Twitch) {
            await this.importTwitch();
        }
        const embedElem = this.shadowRoot.querySelector('#twitch-embed');
        const embed = new Twitch.Embed(embedElem, {
            width: this.width,
            height: this.height,
            channel: this.channel,
            theme: this.theme,
            muted: this.muted,
            autoplay: this.autoplay,
            layout: this.nochat ? 'video' : 'video-with-chat',
        });
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

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `${TwitchStream.style}${TwitchStream.html}`;
        return template;
    }

    static get html() {
        return `
            <div id="twitch-embed"></div>
        `;
    }

    static get style() {
        return `
            <style>
            </style>
        `;
    }

    setDefaults() {
        const props = TwitchStream.properties;
        Object.keys(props).forEach(prop => {
            this[prop] = props[prop].default;
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (TwitchStream.properties[name].noreflect) return; // Let's see if we even need this
        if (oldValue === newValue) return;

        this[name] = newValue === '' ? true : newValue;
    }

    static get observedAttributes() {
        const props = TwitchStream.properties;
        return Object.keys(props).filter(prop => {
            return typeof props[prop].watch === 'undefined' || props[prop].watch;
        });
    }

    static TWITCH_EMBED_URL = 'https://embed.twitch.tv/embed/v1.js';
}

if (!customElements.get('twitch-stream')) {
    customElements.define('twitch-stream', TwitchStream);
}
