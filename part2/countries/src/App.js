import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({country}) => {
  const [weather, setWeather] = useState({
		weather: [{ icon: "01d" }],
		main: { temp: 0 },
		wind: { speed: 0 },
	})
  const api_key = process.env.REACT_APP_API_KEY
	const latitude = country.capitalInfo.latlng[0]
	const longitude = country.capitalInfo.latlng[1]
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`
	const iconCode = weather.weather[0].icon
	const imageLink = `http://openweathermap.org/img/wn/${iconCode}@2x.png`
	const temperature = weather.main.temp
	const wind = weather.wind.speed

	function fetchHook(link) {
		const eventHandler = response => {
			setWeather(response.data)
		}
		axios.get(link).then(eventHandler)
		console.log(link)
	}

	useEffect(() => {
		fetchHook(url)
	}, [])

	return (
		<>
			<h3>Weather in {country.capital}</h3>
			<div>temperature {temperature.toFixed(2)} Celcius</div>
			<img src={imageLink} alt="weatherIcon" />
			<div>wind {wind} m/s</div>
		</>
	)
}
const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png}/>
      <Weather country={country}/>
    </div>
  )
}

const Countries = ({countriesToShow, newSearch, handleSearch}) => {
  
  if (newSearch === '') {
    return <div></div>
  }else{
    if (countriesToShow.length > 10) {
      return <div>Too many matches, specify another filter</div>
    }else if (countriesToShow.length > 1) {
      return (
        <div>
          {countriesToShow.map(country => 
            <div key={country.name}>
              {country.name.common}{' '}
              <button onClick={() => handleSearch(country.name.common)}>show</button>

            </div>
          )}
        </div>
      )
    }else if (countriesToShow.length === 1) {
      return (
        <Country country={countriesToShow[0]}/>
      )
    }else{
      return <div>No matches, specify another filter</div>
    }
  }
}

function App() {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then(response => {setCountries(response.data)
    })
  }, [])

  const handleSearchCountry = event => {
		setNewSearch(event.target.value)
	}

  const handleSearch = (countryName) => {
    console.log(countryName)
    setNewSearch(countryName)
  }

  const countriesToShow = countries.filter(country => country.name.common.
    toLowerCase().includes(newSearch.toLocaleLowerCase()))

  console.log(countriesToShow)

  return (
    <div>
        find countries <input
          value={newSearch}
          onChange={handleSearchCountry}/>
        < Countries countriesToShow={countriesToShow} newSearch={newSearch} handleSearch={handleSearch}/>
    </div>
  );
}

export default App;
