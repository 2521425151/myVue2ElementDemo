import axios from './newAxios'

const api = {
    getList: params => axios.get('/list', { params }),
};