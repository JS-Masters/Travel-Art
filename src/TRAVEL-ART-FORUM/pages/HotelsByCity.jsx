
import { useEffect, useState } from "react";

import {API_GOOGLE} from "../data/constants"


// SEE HOW TO GET photo_ref IN ORDER TO LOAD PHOTOS !!!!
const HotelsByCity = () => {

// const [imageURL, setImageURL] = useState('')

  useEffect(() => {




const requestData = {
  textQuery: "Restaurants in Rome"
};

const headers = {
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': API_GOOGLE,
  'X-Goog-FieldMask': '*'
};

fetch('https://places.googleapis.com/v1/places:searchText', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(requestData)
})
.then(response => response.json())
.then(data => {
  console.log(data)
  // const placeID = data.places[0].id;
  // fetch(`${proxyUrl}https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=photos&key=${API_GOOGLE}`)
  // .then(response => response.json())
  // .then(data => console.log(data.result.photos))
}
  
).catch(error => {
  console.error('Error:', error); // Handle errors here
});

  },[])

    return (
      <div>
        <h2>HOTELS IN ROME:</h2>
      </div>
    )
  }


export default HotelsByCity;