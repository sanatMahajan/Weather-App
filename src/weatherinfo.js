import React, { useState, useEffect, Component } from "react";
import axios from "axios";
import ReactAnimatedWeather from 'react-animated-weather';

const defaults = {
    icon: 'CLEAR_DAY',
    color: 'white',
    size: 100,
    animate: true
  };
function WeatherInfo(props){
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [weather, setWeather] = useState({});

    const search = (city) => {
        axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city!="[object Object]"?city:query}&units=metric&APPID=e911e2c42fdbe3903db885ec7766137f`
        )
        .then((response) => {
            setWeather(response.data);
            setQuery("");
        })
        .catch(function (error) {
            console.log(error);
            setWeather("");
            setQuery("");
            setError({ message: "Not Found", query: query });
        });
    };
    useEffect(() => {
      search(props.locationName);
    }, []);
    var weatherIcon;
    switch(props.weatherName){
        case "Dust":
        case "Tornado":
            weatherIcon="WIND";
            break;
        case "Clouds":
            weatherIcon="CLOUDY";
            break;
        case "Clear":
        case "Haze":
            weatherIcon="CLEAR_DAY";
            break;
        case "Fog":
        case "Smoke":
            weatherIcon="FOG";
            break; 
        case "Thunderstorm":
        case "Rain":
            weatherIcon="RAIN";
            break;
        case "Snow":
            weatherIcon="SNOW";
            break;
        case "Drizzle":
            weatherIcon="SLEET";
            break;
        default:
            weatherIcon="CLEAR_DAY";
    }
    return (
        <React.Fragment>
            <div className='col-4 side-bg text-center py-3'>
                <ReactAnimatedWeather
                    icon={weatherIcon}
                    color={defaults.color}
                    size={defaults.size}
                    animate={defaults.animate}
                />
                <h2 className='text-white py-2'>{props.weatherName}</h2>
                <div className="search-box">
                    <input 
                        type="text"
                        className='search-bar'
                        placeholder='Search any city'
                        onChange={(e)=>setQuery(e.target.value)}
                        value={query}
                    />
                    <div className='img-box'>
                        {" "}
                        <img 
                            src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
                            onClick={search}
                        />
                    </div>
                </div>
                {typeof weather.main!="undefined" ? (
                    <div>
                        <div className="cityHead text-white">
                            <p>
                            {weather.name}, {weather.sys.country}
                            </p>
                        </div>
                        <div className='d-flex flex-wrap'>
                            <div className='d-flex col-12 px-4 py-1'>
                                <div className='text-white'><strong>Temperature</strong></div>
                                <div className='text-white ms-auto'>{Math.round(weather.main.temp)}°c ({weather.weather[0].main})</div>
                            </div>
                            <div className='d-flex col-12 px-4 py-1'>
                                <div className='text-white'><strong>Humidity</strong></div>
                                <div className='text-white ms-auto'>{Math.round(weather.main.humidity)}%</div>
                            </div>
                            <div className='d-flex col-12 px-4 py-1'>
                                <div className='text-white'><strong>Visibility</strong></div>
                                <div className='text-white ms-auto'>{Math.round(weather.visibility)} mi</div>
                            </div>
                            <div className='d-flex col-12 px-4 py-1'>
                                <div className='text-white'><strong>Wind Speed</strong></div>
                                <div className='text-white ms-auto'>{Math.round(weather.wind.speed)} Km/h</div>
                            </div>
                            <div className='d-flex col-12 px-4 py-1'>
                                <div className='text-white'><strong>Max Temp</strong></div>
                                <div className='text-white ms-auto'>{Math.round(weather.main.temp_max)}°C</div>
                            </div>
                         </div>
                    </div>
                ) : (
                    <div>
                      {error.query} {error.message}
                    </div>
                  )}
            </div>
        </React.Fragment>
    );
}
export default WeatherInfo 