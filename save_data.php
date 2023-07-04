<?php
// Retrieve the raw JSON data from the request body
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Connect to the database
$servername = '23.88.73.88:3306';
$username = 'u1726224_beSvMMmF2I';
$password = '64G+=^1f7Q0hA031.Mn71Z@n';
$dbname = 's1726224_logged-data';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}

// Prepare and execute the SQL query to insert the data into the table
$stmt = $conn->prepare('INSERT INTO logged_data (user_agent, app_name, app_version, platform, vendor, device_type, device_model, latitude, longitude, ip_address, battery_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->bind_param('ssssssddsss', $data['browserInfo']['userAgent'], $data['browserInfo']['appName'], $data['browserInfo']['appVersion'], $data['browserInfo']['platform'], $data['browserInfo']['vendor'], $data['deviceInfo']['deviceType'], $data['deviceInfo']['deviceModel'], $data['geolocation']['latitude'], $data['geolocation']['longitude'], $data['ipAddress'], $data['batteryLevel']);
$stmt->execute();

if ($stmt->affected_rows > 0) {
  echo 'Data logged successfully';
} else {
  echo 'Failed to log data';
}

// Close the statement and database connection
$stmt->close();
$conn->close();
?>
