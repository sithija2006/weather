const weatherBitApiKey = '6fbef20bd73343bfa40b18d1a3f51ce7'; // Weatherbit API
const weatherApiKey = '73f800f0eaaa411baa5181549243110'; // WeatherAPI

const districtCoordinates = {
    Colombo: { lat: 6.9271, lon: 79.9612 },
    Kandy: { lat: 7.2906, lon: 80.6328 },
    Galle: { lat: 6.0354, lon: 80.2195 },
    Jaffna: { lat: 9.6618, lon: 80.0240 },
    Matara: { lat: 5.9415, lon: 80.5432 },
    Kurunegala: { lat: 7.4834, lon: 80.3510 },
    Gampaha: { lat: 6.9792, lon: 79.9774 },
    Negombo: { lat: 7.2114, lon: 79.8354 },
    'Nuwara Eliya': { lat: 6.9485, lon: 80.7952 },
    Trincomalee: { lat: 8.5760, lon: 81.2165 },
    Batticaloa: { lat: 7.7067, lon: 81.6936 },
    Anuradhapura: { lat: 8.3139, lon: 80.4056 },
    Polonnaruwa: { lat: 7.4539, lon: 81.0000 },
    Hambantota: { lat: 6.1242, lon: 81.1180 },
    Badulla: { lat: 6.9654, lon: 81.0598 },
    Monaragala: { lat: 6.8895, lon: 81.7891 },
    Mannar: { lat: 8.9887, lon: 79.9772 },
    Vavuniya: { lat: 8.7478, lon: 80.5885 },
    Kilinochchi: { lat: 9.3984, lon: 80.3842 },
    Puttalam: { lat: 8.3275, lon: 79.8340 },
    Kegalle: { lat: 6.0236, lon: 80.2584 },
    Rathnapura: { lat: 6.6900, lon: 80.3921 },
    Dambulla: { lat: 7.4503, lon: 80.6490 },
    Kalutara: { lat: 6.5861, lon: 79.9684 },
    Mullaitivu: { lat: 9.2921, lon: 80.5091 },
};

let map; // Declare map variable

const getWeather = async () => {
    const location = document.getElementById('districtSelect').value; // Get selected district
    const weatherBitUrl = `https://api.weatherbit.io/v2.0/current?city=${location}&key=${weatherBitApiKey}`;
    const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}&aqi=no`;

    try {
        // Weatherbit API
        const response1 = await fetch(weatherBitUrl);
        const data1 = await response1.json();
        console.log("Weatherbit API Response:", data1); // Log response
        if (data1 && data1.data) {
            displayWeather(data1);
        }

        // WeatherAPI
        const response2 = await fetch(weatherApiUrl);
        const data2 = await response2.json();
        console.log("WeatherAPI Response:", data2); // Log response
        if (data2) {
            displayRainInfo(data2);
        }

        // Initialize map
        const { lat, lon } = districtCoordinates[location]; // Get coordinates for selected district
        initMap(lat, lon);
    } catch (error) {
        console.error('API සම්බන්ධතා දෝෂය:', error);
    }
};

const displayWeather = (data) => {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>${data.data[0].city_name}</h2>
        <p>උෂ්ණත්වය: ${data.data[0].temp} °C</p>
        <p>හාමින: ${data.data[0].rh}%</p>
        <p>සුළං වේගය: ${data.data[0].wind_spd} m/s</p>
    `;
    weatherInfo.style.opacity = '1'; // Set opacity for smooth transition
};

const displayRainInfo = (data) => {
    const rainInfo = document.getElementById('rain-info');
    // Check if precip_mm exists in the response
    const precip = data.current && data.current.hasOwnProperty('precip_mm') 
        ? data.current.precip_mm 
        : 'තොරතුරු නොමැත'; // Default message if no data

    rainInfo.innerHTML = `<p>අද වහින තැන්: ${precip} mm</p>`;
    rainInfo.style.opacity = '1'; // Set opacity for smooth transition
};

// Initialize the map
const initMap = (lat, lon) => {
    // Check if the map is already initialized
    if (map) {
        map.setView([lat, lon]); // If map exists, just set the view
    } else {
        // Create a new map if it doesn't exist
        map = L.map('map').setView([lat, lon], 10); // Set map view to district coordinates

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    }

    L.marker([lat, lon]).addTo(map)
        .bindPopup('මෙහි කාලගුණය')
        .openPopup();
};

// Event listeners
document.getElementById('getWeather').addEventListener('click', getWeather);
