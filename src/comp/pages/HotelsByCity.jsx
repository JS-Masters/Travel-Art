import { TOKEN } from "../data/constants";



const HotelsByCity = async () => {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  };
      const response = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=CIA&radius=50&radiusUnit=KM&hotelSource=ALL`, {
        method: 'GET',
        headers: headers
      })

      const result = await response.json();

      console.log(result.data);

    const hotels = result.data.map((h) => <li key={h.dupeId} style={{ color: 'white' }}>{h.name}</li>);

    return (
      <>
      <ul>
        {hotels}
      </ul>
      </>
    )
  }


export default HotelsByCity;