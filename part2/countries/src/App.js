import { useState, useEffect } from "react";
import countryServices from "./services/country";
import Filter from "./components/Filter";
import Countries from "./components/Countries";


function App() {
  const [countries, setCountries] = useState([])
  const [filtered, setFiltered] = useState([])
  
  useEffect(() => {
    countryServices
    .getCountries()
    .then(response => {
      setCountries(countries.concat(response))
    })
  }, [])

  const handleChange = (e) => {
    setFiltered(countries.filter(country => country.name.common.toLowerCase().includes(e.target.value.toLowerCase())))
  }

  return(
    <>
      <Filter handleChange={handleChange}/>
      <Countries filtered={filtered} setFiltered={setFiltered}/>
    </>
  )
}

export default App;
