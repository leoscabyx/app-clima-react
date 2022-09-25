import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [clima, setClima] = useState(null)

  useEffect(() => {
    ( async () => {
      const responseCountries = await fetch('https://restcountries.com/v3.1/all')
      const dataCountries = await responseCountries.json()
      setCountries(dataCountries)
    })()
  }, [])

  const handleSelectCountries = async (e) => {
    if(e.currentTarget.value === '') {
      setCities([])
      setClima(null)
      return
    }

    const options = {
      method: 'GET',
      url: 'https://spott.p.rapidapi.com/places/autocomplete',
      params: {limit: '100', skip: '0', country: e.currentTarget.value, type: 'CITY'},
      headers: {
        'X-RapidAPI-Key': '9e50a3a602msh7ab9832556ed6aep10e110jsn0cd0961f5852',
        'X-RapidAPI-Host': 'spott.p.rapidapi.com'
      }
    };
    
    const { data: cities } = await axios.request(options)
    setCities(cities)
    setClima(null)
  }

  const handleSelectCities = async (e) => {
    if(e.currentTarget.value === '') {
      setClima(null)
      return
    }

    const options = {
      method: 'GET',
      url: 'https://api.openweathermap.org/data/2.5/weather',
      params: {appid: 'f6a1964c9a371c0d7a22a2bc88ca4217', q: e.currentTarget.value, units: 'metric'}
    };
    
    const { data } = await axios.request(options)
    setClima({...data.main, icon: data.weather[0].icon})
  }

  return (
    <div className="App">
      <h1>App Clima</h1>
      {countries.length === 0 && (<div className='spinner'></div>)}
      
      <div className='selects'>
        {countries.length > 0 && (
          <>
            <label>Selecciona un Pais:</label>
            <select name="countries" className="countries" onChange={handleSelectCountries}>
              <option value="">Seleccione</option>
              {countries.map( country => (<option key={country.cca2} value={country.cca2}>{country.name.common}</option>))}
            </select>
          </>
        )}
        
        {cities.length > 0 && (
          <>
            <label>Selecciona una Ciudad:</label>
            <select name="cities" className="cities" onChange={handleSelectCities}>
              <option value="">Seleccione</option>
              {cities.map( city => (<option key={city.id} value={city.name}>{city.name}</option>))}
            </select>
          </>
        )}
      </div>
      {clima && (
        <div className='clima'>
          <div className='clima__info'>
            <h2 className='clima__feels-like'>Sensacion {clima.feels_like.toFixed()}°</h2>
            <span>Maxima {clima.temp_max.toFixed()}°</span>
            <span>Minima {clima.temp_min.toFixed()}°</span>
          </div>
          <div className='clima__marco'>
            <img src={`http://openweathermap.org/img/wn/${clima.icon}@2x.png`}/>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
