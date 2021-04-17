import { LitElement, html, css } from 'lit-element';

class Card extends LitElement {
    static get properties() {
        return {
            hass: {},
            config: {},
        };
    }

    render() {
        return html` <div></div> `;
    }

    setConfig(config) {
        if (!config.entities) {
            throw new Error('You need to define entities');
        }
        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
        return this.config.entities.length + 1;
    }

    static get styles() {
        return css``;
    }
}
document.createElement('card');
customElements.define('card', Card);
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'card',
    name: 'Card',
    preview: false, // Optional - defaults to false
    description: 'A custom card made by me!', // Optional
});
