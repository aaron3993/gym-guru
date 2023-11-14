import axios from 'axios';

const BASE_URL = 'https://wger.de/api/v2';

const wgerApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': 'Token f0d6dc132439eb4a8417d62b4d81b62bf6e7b8f7',
  },
});

export default wgerApi;