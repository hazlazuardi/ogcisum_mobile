const API_URL = 'https://wmp.interaction.courses/api/v1/';
const API_KEY = 'n1FVp837';

export const LOCATION_URL = `${API_URL}?apiKey=${API_KEY}&mode=read&endpoint=locations&order=asc`;

export const SAMPLES_TO_LOCATIONS_URL = `${API_URL}?apiKey=${API_KEY}&mode=read&endpoint=samples_to_locations&limit=999&order=asc`;

export const SAMPLES_URL = `${API_URL}?apiKey=${API_KEY}&mode=read&endpoint=samples&order=asc`;
