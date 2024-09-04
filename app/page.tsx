'use client'

import { ChangeEvent, ReactNode, useState } from "react";
import styles from "./page.module.css";
import { OpenWeatherResponseType } from "./response.types";
import Image from "next/image";
import { kelvinToCelsius } from "./helpers";


export default function Home() {
  const [city, setCity] = useState('');
  const [retrievedData, setRetrievedData] = useState<OpenWeatherResponseType>();
  const [callErrored, setCallErrored] = useState<boolean>(false);

  const buttonClick = async () => {
    console.log(process);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=0844d47de1a02561e472ca33f1d240c4`;
    const response = await fetch(url);

    if (!response.ok) {
      setCallErrored(true);
      throw new Error('The API call to Open Weather has failed');
    }

    setCallErrored(false);
    const data = await response.json();
    setRetrievedData(data);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const renderWeatherConditions = (
    weatherConditions: {
      id: number,
      main: string,
      description: string,
      icon: string
    }[]
  ): ReactNode => {
    let renderedConditions = [];

    for (let i = 0; i < weatherConditions.length; i++) {
      renderedConditions.push(
        <>
          {weatherConditions[i].main}&nbsp;
          <Image width="24" height="24" className={styles.image} src={`https://openweathermap.org/img/wn/${weatherConditions[i].icon}.png`} alt="Weather Condition primary" />&nbsp;
        </>
      )
    }

    return renderedConditions
  }

  const { getName } = require('country-list');

  return (
    <main className={styles.main}>
      <div className={styles.searchSection}>
        <label htmlFor="city">Type in a city:</label>
        <input onChange={handleChange} className={styles.searchInput} name="city" id="city" type="text" />
        <p>Press underlying button to look up weather for the city</p>
        <button className={styles.searchButton} onClick={buttonClick} >Look up weather</button>
      </div>
      {retrievedData && !callErrored && (
        <div className={styles.weatherInfo}>
          <div>City: {retrievedData.name}</div>
          <div>Country code: {getName(retrievedData.sys.country)}</div>
          <div>Current temperature: {kelvinToCelsius(retrievedData.main.temp)} °C</div>
          <div>Feels like: {kelvinToCelsius(retrievedData.main.feels_like)} °C</div>
          <div>Weather conditions: {renderWeatherConditions(retrievedData.weather)}</div>
          <div>Humidity: {retrievedData.main.humidity} %</div>
          <div>Wind speed: {retrievedData.wind.speed} meters/s</div>
        </div>
      )}
    </main>
  );
}
