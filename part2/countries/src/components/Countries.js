import { useState } from "react"
import countryServices from '../services/country'

const Countries = ({filtered, setFiltered}) => {
    const [weather, setWeather] = useState([])

    if(filtered.length > 10){
        return <p>Too many matches, specify another filter</p>
    }
    
    return (
        <>  
            {filtered.length === 1 
            ? <>
            <h1>{filtered[0].name.common}</h1>
                <p>capital {filtered[0].capital}</p>
                <p>area {filtered[0].area}</p>
                <h4>languages:</h4>
                <ul>
                    {Object.values(filtered[0].languages).map(item => <li key={item}>{item}</li>)}
                </ul>
                <img src={filtered[0].flags.png} />   
                {weather.length !== 0 ? <>
                    <h2>weather in {filtered[0].capital}</h2>
                <p>temperature {Math.floor(weather.main.temp) - 273} Celcius</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}/>
                <p>wind {weather.wind.speed} m/s</p>
                </> : null}
                </>
            : <>
                {filtered.map(country => <p key={country.name.common}>{country.name.common} <button onClick={() => {
                    countryServices
                    .getWeather(country.capital)
                    .then(response => {
                        setWeather(response)
                    })

                    if(weather.length !== 0){
                        setFiltered(filtered.filter(item => item.capital === country.capital))    
                    }else{
                        setWeather([])
                    }
                }}>Show</button></p>)}
            </>
            }
        </>
    )
}

export default Countries