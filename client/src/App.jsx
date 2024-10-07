import { useEffect, useState } from "react";

function App() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      const res = await fetch("http://localhost:8080/api");
      const data = await res.json();
      const places = data.places;
      setPlaces(places);
    };
    fetchAPI();
  }, []);

  return (
    <div>
      <h1>PLACES</h1>
      {places.map((place, index) => (
        <div key={index}>{place}</div>
      ))}
    </div>
  );
}

export default App;
