const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/hello", async (req, res) => {
  const visitorsName = req.query.visitor_name || "Guest";
  const clientIP =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const ipAddress = clientIP.split(",")[0];

  try {
    const location = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const city = location.data.city || "New York";

    const weatherApiKey = process.env.OPEN_WEATHER_API_KEY;
    const weather = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`
    );
    const temp = weather.data.main.temp;

    res.json({
      client_ip: ipAddress,
      location: city,
      greeting: `Hello, ${visitorsName}!, the temperature is ${temp} degrees Celsius in ${city}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("I AM WORKING BUT YOUVE GOTTA WORK TOO!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
