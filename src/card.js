import { LitElement, html } from 'lit-element';
import { size, map, isEmpty } from 'lodash-es';
import { loadingStyle, stationsStyle } from './styles.js';
import { calculateNearbyStations, tranformDepartures } from './utils.js';

const API_BASE_URL = 'https://insa-ms.netzmap.com/api/v2/';
const META_DATA_URLS = [
    `${API_BASE_URL}/lines.json`,
    `${API_BASE_URL}/stations.json`,
    `${API_BASE_URL}/platforms.json`,
];

const LOADING_HTML = html`
  <div class="loading">
    <svg width="60" height="60" viewBox="25 25 50 50">
      <circle cx="50" cy="50" r="20" />
    </svg>
    <span>Loading nearby stations</span>
  </div>
`;

function renderStations(stations) {
    return html`
    <div class="stations-list">
      ${map(
        stations,
        (station, stationName) => html`
          <div class="station">
            <div class="station-name">
              <span>${stationName}</span>
              <ha-icon icon="mdi:bus-stop-covered" />
            </div>
            ${station.journeys.map(
        (journey) =>
            html`
                  <span class="journey">${journey.to} - ${journey.text}</span>
                `
    )}
          </div>
        `
    )}
    </div>
  `;
}

class HavagCard extends LitElement {
    constructor(args) {
        super(args);
        this.meta = null;
        this.nearbyStations = null;
        this.timeoutId = null;
    }

    static get properties() {
        return {
            hass: {},
            config: {},
            stations: {},
        };
    }

    static get styles() {
        return [loadingStyle, stationsStyle];
    }

    setConfig(config) {
        if (!config.useLocation && !config.street) {
            console.error('You need to define either `useLocation` or `street`');
        }

        this.config = config;
    }

    getCardSize() {
        return size(this.stations) + 1;
    }

    async firstUpdated() {
        this.meta = await this._getMetadata();
        this.nearbyStations = this._getNearbyStations();

        this._pollDepartures();
        console.log(this.nearbyStations);
    }

    async _getMetadata() {
        try {
            const [lines, stations, platforms] = await Promise.all(
                META_DATA_URLS.map((url) => fetch(url).then((r) => r.json()))
            );

            return {
                lines,
                stations,
                platforms,
            };
        } catch (error) {
            console.error(error);
        }
    }

    _getNearbyStations() {
        const { stations } = this.meta;
        const { longitude, latitude } = this.hass.config;

        return calculateNearbyStations(stations, latitude, longitude);
    }

    async _pollDepartures() {
        const departures = await Promise.all(
            this.nearbyStations.map((station) =>
                fetch(`${API_BASE_URL}/stations/${station.id}/departures.json`).then(
                    async (r) => {
                        const departures = await r.json();

                        return {
                            ...departures,
                            station,
                        };
                    }
                )
            )
        );
        this.stations = tranformDepartures(departures);

        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
        }
        this.timeoutId = window.setTimeout(() => this._pollDepartures(), 60000);
    }

    render() {
        return html`
      <ha-card
        >${isEmpty(this.stations)
        ? LOADING_HTML
        : renderStations(this.stations)}</ha-card
      >
    `;
    }
}
document.createElement('havag-card');
customElements.define('havag-card', HavagCard);
window.havagCards = window.customCards || [];
window.havagCards.push({
    type: 'havag-card',
    name: 'Havag Card',
    preview: false, // Optional - defaults to false
    description: 'A havag card made by me!', // Optional
});
