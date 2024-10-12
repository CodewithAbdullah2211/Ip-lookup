document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('locationBtn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    displayLocation(latitude, longitude);
                    initMap(latitude, longitude);
                },
                error => {
                    console.error('Error obtaining location:', error);
                    alert('Unable to retrieve your location. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    document.getElementById('lookupBtn').addEventListener('click', async function() {
        const ipInput = document.getElementById('ipInput').value;
        await lookupIp(ipInput);
    });
});

async function lookupIp(ip) {
    const ipAddressDisplay = document.getElementById('ipAddress');
    const locationDisplay = document.getElementById('location');
    
    try {
        // Fetching IP information from the IP Geolocation API
        const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`);
        
        if (!response.ok) throw new Error('IP not found');

        const data = await response.json();
        const { ip: ipAddress, city, region, country_name: country, latitude: lat, longitude: lon } = data;

        // Displaying results
        ipAddressDisplay.textContent = ipAddress;
        locationDisplay.textContent = `${city}, ${region}, ${country}`;
        
        // Initialize Leaflet map
        initMap(lat, lon);

    } catch (error) {
        alert(error.message);
    }
}

function initMap(lat, lon) {
    const map = L.map('map').setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup('Location')
        .openPopup();
}

// Function to display user's location
function displayLocation(lat, lon) {
    const ipAddressDisplay = document.getElementById('ipAddress');
    const locationDisplay = document.getElementById('location');

    ipAddressDisplay.textContent = 'Your IP address (not retrieved)';
    locationDisplay.textContent = `Latitude: ${lat}, Longitude: ${lon}`;
}
