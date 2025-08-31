const introScreen = document.querySelector('.intro-screen');
const searchScreen = document.querySelector('.search-screen');
const getStartedBtn = document.querySelector('.get-started');

const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');
const Weather_body = document.querySelector('.weather-body');

// === Switch Screen ===
getStartedBtn.addEventListener("click", () => {
  gsap.to(introScreen, { opacity: 0, y: -50, duration: 0.8, onComplete: () => {
    introScreen.classList.add("hidden");
    searchScreen.classList.remove("hidden");
    gsap.from(".search-screen", { opacity: 0, y: 50, duration: 0.8 });
  }});
});

// === Weather Function ===
async function checkWeather(city) {
  const api_key = "6f9eece0ae166abe18f18cec50265ba8";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

  const weather_data = await fetch(`${url}`).then(response => response.json());

  if (weather_data.cod === `404`) {
    gsap.fromTo(location_not_found, { opacity: 0, y: -20 }, { display: "flex", opacity: 1, y: 0, duration: 0.6 });
    Weather_body.style.display = "none";
    return;
  }

  location_not_found.style.display = "none";
  Weather_body.style.display = "flex";
  gsap.fromTo(".weather-body", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 });

  temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
  description.innerHTML = `${weather_data.weather[0].description}`;
  humidity.innerHTML = `${weather_data.main.humidity}%`;
  wind_speed.innerHTML = `${weather_data.wind.speed} Km/H`;

  switch (weather_data.weather[0].main) {
    case 'Clouds': weather_img.src = "images/Cloud.jpg"; break;
    case 'Clear': weather_img.src = "images/Clear.jpg"; break;
    case 'Rain': weather_img.src = "images/Rain.jpg"; break;
    case 'Mist': weather_img.src = "images/Mist.jpg"; break;
    case 'Snow': weather_img.src = "images/Snow.jpg"; break;
    case 'scattered':weather_img.src = "images/images-2.jpeg"; break; 
    case'few-cloud ':weather_img.src = "images/Cloud.jpg";break;
    default: weather_img.src = "images/w6.jpg";
  }
}

// === Event Listener ===
searchBtn.addEventListener('click', () => {
  checkWeather(inputBox.value);
});

// === Initial Load Animation ===
gsap.from(".intro-screen", { opacity: 0, scale: 0.8, duration: 1, ease: "back" });
