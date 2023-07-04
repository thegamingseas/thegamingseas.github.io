// Function to log the data to PHP database
function logDataToDatabase(data) {
    // Send the data to the PHP script using a POST request
    fetch('save_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.text())
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log('Failed to log data:', error);
      });
  }
  
  // Function to log the data and initiate the database logging
  function logAndSaveData() {
    // Create an object to store the logged data
    const loggedData = {};
  
    // Log the browser information
    loggedData.browserInfo = {
      userAgent: navigator.userAgent,
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      platform: navigator.platform,
      vendor: navigator.vendor
    };
  
    // Log the device information
    loggedData.deviceInfo = {
      deviceType: /Mobile|Tablet|iPad|iPhone|Android/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      deviceModel: navigator.userAgent
    };
  
    // Log the geolocation
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        loggedData.geolocation = {
          latitude: latitude,
          longitude: longitude
        };
  
        // Get the IP address using a third-party API
        fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(ipData => {
            const ipAddress = ipData.ip;
            loggedData.ipAddress = ipAddress;
            console.log('IP Address:', ipAddress);
  
            // Get the battery level
            const batteryPromise = navigator.getBattery ? navigator.getBattery() : Promise.resolve({ level: 'N/A' });
            batteryPromise
              .then(batteryData => {
                const batteryLevel = batteryData.level;
                loggedData.batteryLevel = batteryLevel;
                console.log('Battery Level:', batteryLevel);
  
                // Log the data to the PHP database
                logDataToDatabase(loggedData);
              })
              .catch(error => {
                console.log('Failed to retrieve battery level:', error);
              });
          })
          .catch(error => {
            console.log('Failed to retrieve IP Address:', error);
          });
      },
      error => {
        console.log('Geolocation error:', error);
      }
    );
  }
  
  // Add an event listener to the download button
  const downloadButton = document.getElementById('downloadButton');
  downloadButton.addEventListener('click', logAndSaveData);
  