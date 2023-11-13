import axios from 'axios';

const BASE_URL = 'https://wger.de/api/v2';

const wgerApi = axios.create({
  baseURL: BASE_URL,
});

export default wgerApi;