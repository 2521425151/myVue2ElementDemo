import { NRequest } from '../utils/configAxios'


export const getData = (data) => {
	return NRequest({
		url:'',
		method: 'get',
		params: data
	})
}

export const postData = (data) => {
	return NRequest({
		url:'',
		method: 'post',
		data: data
	})
}
