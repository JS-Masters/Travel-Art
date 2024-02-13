import { useEffect, useState } from "react";
import { useContext } from "react";
import { API_GOOGLE } from "../data/constants";
import { AppContext } from "../providers/AppContext";

// SEE HOW TO GET photo_ref IN ORDER TO LOAD PHOTOS !!!!
const HotelsByCity = () => {
  const { city, setContext } = useContext(AppContext);
  // const [imageURL, setImageURL] = useState('')
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const requestData = {
      textQuery: `Hotels in ${city}`, // Сменя се тук с какво да търси в АПИто (restaurants, hotels, etc.) !!!!
    };

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_GOOGLE,
      "X-Goog-FieldMask": "*",
    };

    fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setHotels(data.places);
        // const placeID = data.places[0].id;
        // fetch(`${proxyUrl}https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=photos&key=${API_GOOGLE}`)
        // .then(response => response.json())
        // .then(data => console.log(data.result.photos))
      })
      .catch((error) => {
        console.error("Error:", error); // Handle errors here
      });
  }, []);

  return (
    <div>
      <h2>HOTELS IN ROME:</h2>
      {hotels.length &&
        hotels.map((hotel) => (
          <div key={hotel.id}>
            <h1>{hotel.displayName.text}</h1>
            <br />
          </div>
        ))}
    </div>
  );
};

export default HotelsByCity;
