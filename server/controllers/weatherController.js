const fetch = require("node-fetch");

// Fetch weather data by coordinates
exports.getWeatherByCoordinates = async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&units=metric`
    );

    if (!weatherRes.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const weatherData = await weatherRes.json();

    if (weatherData.name === "") {
      throw new Error("🔍 Not a valid place. Click elsewhere!");
    }

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Fetch time data by coordinates
exports.getTimeByCoordinates = async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const timeRes = await fetch(
      `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lng}`,
      {
        headers: {
          "X-Api-Key": process.env.API_NINJAS_API_KEY,
        },
      }
    );

    if (!timeRes.ok) {
      throw new Error("Failed to fetch time data");
    }

    const timeData = await timeRes.json();
    res.status(200).json(timeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch image data from unsplash
exports.getImageData = async (req, res) => {
  const { place, city } = req.query;

  try {
    const imageRes = await fetch(
      `https://api.unsplash.com/search/photos?client_id=${
        process.env.UNSPLASH_API_KEY
      }&query=${`${city}, ${place}`}`
    );

    if (!imageRes.ok) {
      throw new Error("Failed to fetch image data");
    }

    const imageData = await imageRes.json();

    // Image selection
    const randomIndex = Math.floor(Math.random() * imageData.results.length);
    const weatherImageUrl = imageData.results[randomIndex].urls.regular;

    // Get a different image for formImageUrl
    const formImageIndex = randomIndex === 0 ? 1 : randomIndex - 1;
    const formImageUrl = imageData.results[formImageIndex].urls.regular;

    const imageObj = { weatherImageUrl, formImageUrl };

    res.status(200).json(imageObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
