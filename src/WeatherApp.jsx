import React, { useRef, useState } from "react"

function WeatherApp () {
    const cityRef = useRef("")
    const [city, setCity] = useState("")
    const [savedCity, setSavedCity] = useState("")


    const handleInputChange = (event) => {
        cityRef.current = event.target.value
    }
    
    const handleSubmit = (event) => {
        event.preventDefault()
        setSavedCity(cityRef.current)
        console.log("Spremljeni grad:", cityRef.current)
    }

    return (
        <>
        <div>
            <h1>AHAHAH</h1>
        <div>
          <h2>WEATHER APP</h2>
        </div>
        <div>
          <label htmlFor="city"></label>
          <input type='text' name='city' onChange={handleInputChange}></input>
          <button onClick={handleSubmit}>check</button>
          <p>{cityRef.current}</p>
        </div>
      </div>
        </>
    )
}

export default WeatherApp