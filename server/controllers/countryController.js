const fetch = require("node-fetch");

// Fetch country data by name
exports.getCountryDataByName = async (req, res) => {
  try {
    const { name } = req.params;
    const restCountriesRes = await fetch(
      `https://restcountries.com/v3.1/name/${name}`
    );

    if (!restCountriesRes.ok) {
      throw new Error("Failed to fetch country data");
    }

    const [data] = await restCountriesRes.json();

    const flag = data.flags.svg;
    const countryName = data.name.common;
    const region = data.continents[0];
    const capital = data.capital[0];
    const language = Object.values(data.languages)[0];
    const population = data.population.toString().slice(0, 2);
    const currency = Object.values(data.currencies)[0].name;
    const [capLat, capLng] = data.capitalInfo.latlng;

    res.status(200).json({
      flag,
      countryName,
      region,
      capital,
      language,
      population,
      currency,
      capLat,
      capLng,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch country data by coordinates (reverse geocoding)
exports.getCountryByCoordinates = async (req, res) => {
  const { lat, lng } = req.params;

  try {
    const bdcRes = await fetch(
      `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${lng}&localityLanguage=en&key=${process.env.BIG_DATA_CLOUD_API_KEY}`
    );

    if (!bdcRes.ok) {
      throw new Error("Failed to reverse geocode location");
    }

    const countryNameData = await bdcRes.json();
    const countryName = countryNameData.countryName;

    // Fetch country data by country name
    const countryDataRes = await fetch(
      `${process.env.BASE_URL}/country/${countryName}`
    );

    if (!countryDataRes.ok) {
      throw new Error("Failed to fetch country data");
    }

    const countryData = await countryDataRes.json();
    res.status(200).json(countryData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
