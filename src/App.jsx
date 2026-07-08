import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const API_KEY = "afd86a3b57d8f6717e51d997269d44e9";

  const fetchSuggestions = async (value) => {
    setCity(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
      );

      const data = await response.json();

      console.log("Suggestions:", data);

      if (Array.isArray(data)) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    }
  };

  const getWeather = async (selectedCity = city) => {
    if (!selectedCity) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (data.cod === "404") {
        setError("City not found");
        setWeather(null);
      } else {
        setWeather(data);
        setError("");
        setSuggestions([]);
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className={`app ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
      <div className="container">
        <div className="header">
          <h1>Weather App</h1>

          <button
            className="theme-toggle"
            type="button"
            onClick={() => setIsDarkTheme((currentTheme) => !currentTheme)}
          >
            {isDarkTheme ? "Light Theme" : "Dark Theme"}
          </button>
        </div>

        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => fetchSuggestions(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getWeather();
                }
              }}
            />

            <button onClick={() => getWeather()}>Search</button>
          </div>

          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setCity(item.name);
                    setSuggestions([]);
                    getWeather(item.name);
                  }}
                >
                  <strong>{item.name}</strong>
                  {item.state ? `, ${item.state}` : ""}, {item.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather"
            />

            <h3>{weather.main.temp}&deg;C</h3>

            <p>{weather.weather[0].description}</p>

            <p>Humidity: {weather.main.humidity}%</p>

            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
