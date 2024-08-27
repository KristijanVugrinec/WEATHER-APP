import React, { useEffect, useRef, useState } from "react"
import axios from "axios";
import style from "./WeatherApp.module.css"

import cloudIcon from './icons/cloud.svg'
import cloudwithrainIcon from './icons/cloud-with-rain.svg'
import cloudwithlightningIcon from './icons/cloud-with-lightning.svg'
import cloudwithsnowIcon from './icons/cloud-with-snow.svg'
import sunbehindraincloudIcon from './icons/sun-behind-rain-cloud.svg'
import sunbehindlargecloudIcon from './icons/sun-behind-large-cloud.svg'
import sunIcon from './icons/sun.svg'
import searchButton from './icons/search-button.svg'



function WeatherApp () {

    const [data,setData] = useState(null)
    const [error,setError] = useState(false)
    const cityRef = useRef("")
    const [city, setCity] = useState("")
    const [savedCity, setSavedCity] = useState("")

    const apiKey = import.meta.env.VITE_API_KEY


    const handleInputChange = (event) => {

        const value = event.target.value

        const regEx = /^[A-Za-zäöüÄÖÜ\s]*$/

        if(regEx.test(value)){
          cityRef.current = value
        } else {
          event.target.value = "";
          alert("Please insert only letters")
        }

    }
    
    const handleSubmit = (event) => {
        setError(null)

        event.preventDefault()
        setSavedCity(cityRef.current)
        console.log("Spremljeni grad:", cityRef.current)

      axios.get(`/.netlify/functins/weatherApp?city=${cityRef.current}`)
          .then((response) => {
            setData(response.data);
            console.log("Podaci",response.data)
          })
            .catch((error) => {
              setData(null)
              setError(error)
            })
  }

    const dataObjects = data ? {
      country: data.sys.country,
      city: data.name,
      temperature: data.main.temp,
      minTemp: data.main.temp_min,
      maxTemp: data.main.temp_max,
      humidity: data.main.humidity,
      sunrise:data.sys.sunrise,
      sunset:data.sys.sunset,
      wind: data.wind.speed,
      weatherConditions: data.weather.map(({main,description,icon,id}) => ({
        main,
        description,
        icon,
        id
      }))
    }
    : null

    let sunsetNewTime = 'N/A'

  if (data) {
    const sunsetTime = data.sys.sunset;
    const sunsetDate = new Date(sunsetTime * 1000);
    const hours = sunsetDate.getHours().toString().padStart(2, '0');
    const minutes = sunsetDate.getMinutes().toString().padStart(2, '0');
    const seconds = sunsetDate.getSeconds().toString().padStart(2, '0');
    sunsetNewTime = `${hours}:${minutes}:${seconds}`;
  }



  let sunriseNewTime = 'N/A'

  if (data) {
    const sunriseTime = data.sys.sunrise;
    const sunriseDate = new Date(sunriseTime * 1000);
    const hours = sunriseDate.getHours().toString().padStart(2, '0');
    const minutes = sunriseDate.getMinutes().toString().padStart(2, '0');
    const seconds = sunriseDate.getSeconds().toString().padStart(2, '0');
    sunriseNewTime = `${hours}:${minutes}:${seconds}`;
  }


  const backgroundClass = () => {
    if(data && data.weather && data.weather.length > 0){
      switch(data.weather[0].main){
        case 'Clear':
                    return style.clear;
                case 'Clouds':
                    return style.clouds;
                case 'Rain':
                    return style.rain;
                case 'Snow':
                    return style.snow;
                case 'Mist':
                    return style.fog;
                case 'Drizzle':
                    return style.fog
                case 'Thunderstorm':
                    return style.storm
                default:
                    return style.default;
      }
    }
  }

    const weatherIcon = () => {
      if (data && data.weather && data.weather.length > 0) {
        let weatherCondition = data.weather[0];

        if (!['Clear', 'Clouds', 'Rain', 'Snow', 'Mist', 'Thunderstorm'].includes(weatherCondition.main)) {
            if (data.weather.length > 1) {
                weatherCondition = data.weather[1];
            }
        }

        switch (weatherCondition.main) {
            case 'Clear':
                return sunIcon;
            case 'Clouds':
                return cloudIcon;
            case 'Rain':
                return cloudwithrainIcon;
            case 'Snow':
                return cloudwithsnowIcon;
            case 'Mist':
                return cloudIcon;
            case 'Thunderstorm':
                return cloudwithlightningIcon;
            default:
                return sunIcon;
        }
    }
};

      
      const returnDayAndDate = () => {
        const today = new Date()
        const day = today.getDate()
        const month = today.getMonth() + 1
        const year = today.getFullYear()

        const dayI = today.getDay()
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

        const dayName = days[dayI]

        return `${dayName} ${day}.${month}.${year}`
      }
      
    

    return (
        <>
        <div className={`${style.main} ${backgroundClass()}`}>
        <div className={style.app}>
          <div className={style.appName}>
            <p>WEATHER APP</p>
          </div>
        <div className={style.input}>
          <label htmlFor="city"></label>
          <input type='text' name='city' onChange={handleInputChange} placeholder="Enter a City..."></input>
          <button className={style.buttonApp} onClick={handleSubmit}>
            <img src={searchButton} className={style.searchButton} />
          </button>
          </div>
          <div className={style.appsecond}>
          {error && <p>Došlo je do greške. Pokušajte ponovo.</p>}
          {dataObjects ? (
            <>
            <div className={style.iconandname}>
              <div className={style.iconsandcondition}>
                <div className={style.cityanddate}>
              <p>{dataObjects.city}</p>
              <p>{returnDayAndDate()}</p>
                <img src={weatherIcon()} className={style.icon}/>
                </div>
                <div className={style.temperatureAndCondition}>
              <p>{Math.round((dataObjects.temperature - 273.15) * 1)}°C</p>
              <div>
                {dataObjects.weatherConditions.map((condition) => (
                  <div key={condition.id}>
                    <p>{condition.description}</p>
                  </div>
                ))}
              </div>
              </div>
              </div>
            <div className={style.names}>
            </div>
            </div>
            <div className={style.specsMain}>
              <div className={style.specs}>
              <p>{dataObjects.humidity}%</p>
                <p>Humidity</p>
              </div>
              <div className={style.specs}>
              <p>{Math.round((dataObjects.maxTemp - 273.15) * 1)}°C</p>
                <p>High</p>
              </div>
              <div className={style.specs}>
              <p>{sunriseNewTime}</p>
              <p>Sunrise</p>
              </div>
              <div className={style.specs}>
                <p style={{width:"90px"}}>{dataObjects.wind} m/s</p>
                <p>Wind</p>
              </div>
              <div className={style.specs}>
              <p>{Math.round((dataObjects.minTemp - 273.15) * 1)}°C</p>
                <p>Min</p>
              </div>
              <div className={style.specs}>
              <p>{sunsetNewTime}</p>
              <p>Sunset</p>
              </div>
              </div>
            </>
          ) : (
            <p>Unesite grad i pritisnite "Check" da biste videli rezultate.</p>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default WeatherApp