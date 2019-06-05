import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://project-grand-canyon.appspot.com/api'
});

export default instance;