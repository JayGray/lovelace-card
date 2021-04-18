import { sortBy, take } from 'lodash-es';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km

    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

const distanceReducer = (latitude, longitude) => (acc, station) => {
    const { position } = station;

    if (!position) {
        return acc;
    }

    const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        position.latitude,
        position.longitude
    );

    if (distance <= 0.5) {
        acc.push({
            ...station,
            distance,
        });
    }

    return acc;
};

export const calculateNearbyStations = (stations, latitude, longitude) => {
    const reducer = distanceReducer(latitude, longitude);

    return stations
        .reduce(reducer, [])
        .sort((lh, rh) => lh.distance - rh.distance);
};

export const tranformDepartures = (departures) => {
    return departures.reduce((acc, departure) => {
        const sorted = sortBy(departure.journeys, 'prognosis');
        const top = take(sorted, 5);
        const stationName = departure.station.names.common;

        acc[stationName] = {
            ...departure.station,
            journeys: top.map((journey) => ({
                to: journey.line.terminus.name,
                text: journey.prognosis_text,
                station: departure.station,
            })),
        };

        return acc;
    }, {});
};
