// import { useEffect, useState } from "react";
// import { useContext } from "react";
// import { GOOGLE_API } from "../../../data/constants";
// import { AppContext } from "../../providers/AppContext";
// import "./ResultsByCity.css";
// import { Link } from "react-router-dom";

// const ResultsByCity = ({ criteria }) => {
//   const { citySearch, cityClick } = useContext(AppContext);
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [hasPhotos, setHasPhotos] = useState(false);
//   useEffect(() => {
//     const requestData = {
//       textQuery: `${criteria} in ${citySearch || cityClick}`, 
//     };

//     const headers = {
//       "Content-Type": "application/json",
//       "X-Goog-Api-Key": GOOGLE_API,
//       "X-Goog-FieldMask": "*",
//     };

//     fetch("https://places.googleapis.com/v1/places:searchText", {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify(requestData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data.places);
//         setSearchResults(data.places);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }, []);

//   const renderPhoto = (nameString) => {
//     const slashIndex = nameString.lastIndexOf("/");
//     const imageRef = nameString.slice(slashIndex + 1);
//     const imageURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imageRef}&key=${GOOGLE_API}`;
//     return imageURL;
//   };

//   if (loading) {
//     return <h1>LOADING...</h1>;
//   }

//   return (
//     <div>
//       <h2>
//         {criteria.toUpperCase()} IN {(citySearch || cityClick).toUpperCase()}:
//       </h2>
//       <div className="all-results">
//         {searchResults.length &&
//           searchResults.map((result) => {
//             const URL = result.photos ? result.photos[0].name : 'https://as1.ftcdn.net/v2/jpg/03/24/73/92/1000_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg';
//             return (
//               <div key={result.id} className="signle-result-place">
//                 <h1>{result.displayName.text}</h1>
//                 <div className="image-by-result-div">
//                   {() => checkIfResultHasPhotos(result)}
//                   {<img
//                     className="image-by-result"
//                     src={renderPhoto(URL)}
//                     alt="Restaurant Image"
//                   />}
//                 </div>
//                 <br />
//                 <div className="website-link">
//                   <Link
//                     to={result.websiteUri}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     Official Website
//                   </Link>
//                 </div>
//                 <div className="google-maps-link">
//                   <Link
//                     to={result.googleMapsUri}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     See in Google Maps
//                   </Link>
//                 </div>
//                 <br />
//               </div>
//             )
//           }

//           )}
//       </div>
//     </div>
//   );
// };

// export default ResultsByCity;
