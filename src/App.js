import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState(localStorage.getItem('city') || '');
  const [country, setCountry] = useState(localStorage.getItem('country') || '');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [bgColor, setBgColor] = useState(localStorage.getItem('bgColor') || '#ffffff');
  const [textColor, setTextColor] = useState(localStorage.getItem('textColor') || '#000000');
  const apiKey = '7174df0ad27177f990de8ae0ae1e0458';


  useEffect(() => {
    localStorage.setItem('city', city);
    localStorage.setItem('country', country);
    localStorage.setItem('bgColor', bgColor);
    localStorage.setItem('textColor', textColor);
  }, [city, country, bgColor, textColor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cityQuery = `${city}${country ? `,${country}` : ''}`;
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${apiKey}&units=metric`);
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      setError('Помилка! Невірне місто чи країна.');
      setWeatherData(null);
    }
  };

  return (
    <div className="app" style={{ backgroundColor: bgColor, color: textColor }}>
      <h1>Погода</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Місто"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Країна (необов'язково)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <button type="submit">Отримати погоду</button>
      </form>

      {error && <p>{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>Температура: {weatherData.main.temp} °C</p>
          <p>Вологість: {weatherData.main.humidity} %</p>
          <p>Опис: {weatherData.weather[0].description}</p>
          <p>Схід сонця: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p>Захід сонця: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>

          <img
            src={new Date(weatherData.sys.sunrise * 1000) > new Date() && new Date(weatherData.sys.sunset * 1000) > new Date() ? 'sun.png' : 'moon.png'}
            alt="Sun/Moon"
            className="sun-moon-icon"
          />
        </div>
      )}

      <div className="settings">
        <label>Колір фону:</label>
        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        <label>Колір тексту:</label>
        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
      </div>
    </div>
  );
};

export default App;
