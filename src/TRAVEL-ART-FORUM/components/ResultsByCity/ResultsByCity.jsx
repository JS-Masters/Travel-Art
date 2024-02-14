import { useEffect, useState } from "react";
import { useContext } from "react";
import { API_GOOGLE } from "../../data/constants";
import { AppContext } from "../../providers/AppContext";
import "./ResultsByCity.css"


const ResultsByCity = ({ criteria }) => {
  const { city } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const requestData = {
      textQuery: `${criteria} in ${city}`, // Сменя се тук с какво да търси в АПИто (restaurants, hotels, etc.) !!!!
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
        setSearchResults(data.places);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const renderPhoto = (nameString) => {
    const slashIndex = nameString.lastIndexOf('/');
    const imageRef = nameString.slice(slashIndex + 1);
    const imageURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageRef}&key=${API_GOOGLE}`
    return imageURL;
  }

  if (loading) {
    return <h1>LOADING...</h1>
  }

  return (
    <div>
      <h2>{criteria.toUpperCase()} IN {city.toUpperCase()}:</h2>
      {searchResults.length &&
        searchResults.map((result) => (
          <div key={result.id}>
            <h1>{result.displayName.text}</h1>
            <img className="image-by-result" src={renderPhoto(result.photos[0].name)} alt="Image" />

            <br />
          </div>
        ))}
    </div>
  );
};

export default ResultsByCity;
