export default class TwitchStream extends HTMLElement {
    static TWITCH_EMBED_URL = 'https://embed.twitch.tv/embed/v1.js';
    static get attributes() {
        return {
            title: { default: 'Simplr HTML Element Template' },
            subtitle: { default: 'Made with 💖 by the Simplr bois' },
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
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.setDefaults();
        this.initializeTwitchEmbed();
        this.render();
    }

    render() {
        const content = TwitchStream.template.content.cloneNode(true);
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(content);
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

    requestRender() {
        if (this._requestRenderCalled) return;

        this._requestRenderCalled = true;
        window.requestAnimationFrame(() => {
            this.render();
            this._requestRenderCalled = false;
        });
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
        this.requestRender();
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
