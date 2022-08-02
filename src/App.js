import React, { Component } from 'react';
import './App.css';
import Clock from 'react-live-clock';
import WeatherInfo from './weatherinfo';

class App extends React.Component{
  state={
    latitude: null,
    longitude: null,
    temp: null,
    locationName: null,
    country: null,
    humidity: null,
    visibility: null,
    windSpeed: null,
    feelsLike: null,
    maxTemp: null,
    weatherName: null
  };

  componentDidMount(){
    if(navigator.geolocation){
      this.getPositions()
      .then((position)=>{
          console.log(position.coords.latitude);
          this.getWeather(position.coords.latitude,position.coords.longitude)
      })
      .catch((err)=>{
        this.getWeather(28.67, 77.72);
        alert(
          "You have disabled location service. Allow Weather to use your location"
        );
      })
    }

    this.timerId=setInterval(
      ()=>this.getWeather(this.state.latitude, this.state.longitude),
      60000
    );
  }
  componentWillUnmount(){
    clearInterval(this.timerId);
  }
  getPositions=()=>{
    return new Promise(function(resolve, reject){
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })
  }
  getWeather=async(latitude, longitude)=>{
    const api=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=e911e2c42fdbe3903db885ec7766137f`);
    const data=await api.json();
    console.log(data);
    this.setState(
      {
        temp: Math.round(data.main.temp),
        locationName: data.name,
        country: data.sys.country,
        humidity: data.main.humidity,
        visibility: data.visibility,
        windSpeed: data.wind.speed,
        feelsLike: data.main.feels_like,
        maxTemp: data.main.temp_max,
        weatherName: data.weather[0].main
      }
    )
  }
  render(){
    if(this.state.temp){
      return (
        <React.Fragment>
          <div className='col-8 d-flex justify-content-center mx-auto py-5'>
            <div className='col-6 app-bg d-flex flex-wrap'>
              <div className='col-12 pt-3 px-4'>
                <h2 className='text-white m-0'>{(this.state.locationName)}</h2>
                <p className='text-white'>{(this.state.country)}</p>
              </div>
              <div className='col-12 mt-auto px-4 d-flex'>
                <div>
                  <h2 className='text-white m-0'><Clock format={'HH:mm:ss'} ticking={true} /></h2>
                  <p className='text-white'><Clock format={'dddd, MMMM DD, YYYY'} date={''} /></p>
                </div>
                <div className='ms-auto'>
                  <h1 className='text-white'>{(this.state.temp)}°C</h1>
                </div>
              </div>
            </div>
            <WeatherInfo locationName={this.state.locationName} weatherName={this.state.weatherName}/>
          </div>
        </React.Fragment>
      );
    } else{
      return(
        <React.Fragment>
          <h3 style={{color:"white",fontSize:"22px",fontWeight:"600"}}>Detecting your location</h3>
          <h3 style={{color:"white",marginTop:"10px"}}>Your current location will be displayed on the App <br></br> and used for calculating Real time weather.</h3>
        </React.Fragment>
      )
    } 
  }
}

export default App;
