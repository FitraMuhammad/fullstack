import axios from 'axios'


const baseUrl = `https://studies.cs.helsinki.fi/restcountries/api/all`

const api_key = process.env.REACT_APP_API_KEY

const getCountries = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getWeather = (capital) => {
    const request = axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${api_key}`)

    return request.then(response => response.data)
}


export default {getCountries,getWeather}