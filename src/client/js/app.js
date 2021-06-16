// Geonames + API keys
let geonamesUn = "lbartley";
let weatherbitAPI = "54e623975a2d4fed9ab8718c0d2a1776";
let pixabayAPI = "22082763-50f36d5fd38179c82a76e8b03";

//API calls
//Geonames
const getGeonames = async (city) => {
    const url = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${geonamesUn}`;
    const res = await fetch(url);
    try {
      const data = await res.json();
      return data;
    } catch (error) {
      alert("Error!", error);
    }
  };

  //Weatherbit
  const getWeatherBit = async (lat, lng) => {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${weatherbitAPI}`;
    const res = await fetch(url);
    try {
      const data = await res.json();
      return data;
    } catch (error) {
      alert("Error!", error);
    }
  };

  //Pixabay
  const getPixabay = async (city) => {
    const url = `https://pixabay.com/api/?key=${pixabayAPI}&q=${city}&image_type=photo`;
    const res = await fetch(url);
    try {
      const data = await res.json();
      return data;
    } catch (error) {
      alert("Error!", error);
    }
  };

//Gather the information
const performAction = async () => {
  let city = document.getElementById("city").value;
  let dateGoing = document.getElementsByClassName("datePicker")[0].value;
  let dateReturning = document.getElementsByClassName("datePicker")[1].value;

  //Dates


  //Function for dates of trip
  let d = new Date();
  const daysToGo = Math.floor(
    (new Date(dateGoing).getTime() - d.getTime()) / (1000 * 3600 * 24)
  );
  const tripLength = Math.ceil(
    (new Date(dateReturning).getTime() - new Date(dateGoing).getTime()) /
      (1000 * 3600 * 24)
  );

  // Display message
  document.getElementById(
    "details"
  ).innerHTML = `You leave in ${daysToGo} days <br> and will be away for ${tripLength} days`;

  // API information
  //Call for returning latitude and longitude
  getGeonames(city)
    .then((data) => {
      return postData("http://localhost:7071/geonames", {
        latitude: data.geonames[0].lat,
        longitude: data.geonames[0].lng,
      });
    })
    //Variables for holding the latitute and longitude coordinates
    .then((res) => {
      const lat = res[res.length - 1].latitude;
      const lng = res[res.length - 1].longitude;
      return { lat, lng };
    })
    //Watherbit call using the coordinates
    .then(({ lat, lng }) => {
      return getWeatherBit(lat, lng);
    })
    //Variables to hold data from Weatherbit by Pixabay
    .then((weatherData) => {
      return postData("http://localhost:7071/weatherbit", {
        high: weatherData.data[0].high_temp,
        low: weatherData.data[0].low_temp,
        description: weatherData.data[0].weather.description,
      });
    })
    //Get city image
    .then(() => {
      return getPixabay(city);
    })
    //Variables to hold the data returned from Pixabay
    .then((data) => {
      return postData("http://localhost:7071/pixabay", {
        image: data.hits[1].webformatURL,
      }).then(uiUpdate());
    });
};


//Updating the UI
const uiUpdate = async () => {
  const res = await fetch("http://localhost:7071/data");
  try {
    const dataPoints = await res.json();
    document.getElementById(
      "content"
      //Fill out UI information with the returned data from API calls
    ).innerHTML = `Max temp: ${
      dataPoints[dataPoints.length - 2].high
    }<br> Min temp: ${dataPoints[dataPoints.length - 2].low} <br>  ${
      dataPoints[dataPoints.length - 2].description
    }`;

    //Image from Pixabay and fill the "image" div in the HTML
    document.getElementById("image").src = dataPoints[dataPoints.length - 1].image;
  } catch (error) {
    console.log(error);
  }
};

//POST
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};


//Button
document.addEventListener("DOMContentLoaded", () => {
  const button_submit = document.getElementById("generate");
  button_submit.addEventListener("click", performAction);
});


//Export the functions
export {
    getGeonames,
    getWeatherBit,
    getPixabay,
    performAction,
    uiUpdate,
    postData,
};
