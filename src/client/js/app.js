// API keys
let apiPixabay = "22082763-50f36d5fd38179c82a76e8b03";
let idGeonames = "lbartley";
let apiWeatherbit = "54e623975a2d4fed9ab8718c0d2a1776";




// APIs

// Pixabay
const infoFromPixabay = async (city) => {
  const url = `https://pixabay.com/api/?key=${apiPixabay}&q=${city}&image_type=photo`;
  const res = await fetch(url);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    alert("There is something wrong with Pixabay", error);
  }
};


// Geonames
const infoFromGeonames = async (city) => {
    const url = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${idGeonames}`;
    const res = await fetch(url);
    try {
      const data = await res.json();
      return data;
    } catch (error) {
      alert("There is something wrony with Geonames", error);
    }
  };



  // Weatherbit
  const infoFromWeatherbit = async (lat, lng) => {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${apiWeatherbit}`;
    const res = await fetch(url);
    try {
      const data = await res.json();
      return data;
    } catch (error) {
      alert("There is something wrong with Weatherbit", error);
    }
  };


  // Get trip details
  // Function grabs city, date of departure and
  // date of return data
  const tripDetails = async () => {
    let city = document.getElementById("city").value;
    let dateOfDeparture = document.getElementsByClassName("datePicker")[0].value;
    let dateOfReturn = document.getElementsByClassName("datePicker")[1].value;


  // Dates


  // Function for dates of trip
  let d = new Date();
  const countdownDays = Math.floor(
    (new Date(dateOfDeparture).getTime() - d.getTime()) / (1000 * 3600 * 24)
  );
  const totalTrip = Math.ceil(
    (new Date(dateOfReturn).getTime() - new Date(dateOfDeparture).getTime()) /
      (1000 * 3600 * 24)
  );

  // Display details of the trip
  document.getElementById(
    "details"
  ).innerHTML = `You leave in ${countdownDays} days <br> and will be away for ${totalTrip} days`;




  // Call for coordinates
  infoFromGeonames(city)
    .then((data) => {
      return postData("http://localhost:7070/geonames", {
        latitude: data.geonames[0].lat,
        longitude: data.geonames[0].lng,
      });
    })

    // Variables for holding the coordinates
    .then((res) => {
      const lat = res[res.length - 1].latitude;
      const lng = res[res.length - 1].longitude;
      return { lat, lng };
    })

    // Weatherbit call using the coordinates
    .then(({ lat, lng }) => {
      return infoFromWeatherbit(lat, lng);
    })

    // Variables to hold data from Weatherbit by Pixabay
    .then((weatherData) => {
      return postData("http://localhost:7070/weatherbit", {
        high: weatherData.data[0].high_temp,
        low: weatherData.data[0].low_temp,
        description: weatherData.data[0].weather.description,
      });
    })

    // Get city image
    .then(() => {
      return infoFromPixabay(city);
    })

    // Variables to hold Pixabay data
    .then((data) => {
      return postData("http://localhost:7070/pixabay", {
        image: data.hits[1].webformatURL,
      }).then(updateDisplayInfo());
    });
};



// Update the info displayed to the user
const updateDisplayInfo = async () => {
  const res = await fetch("http://localhost:7070/data");
  try {
    const dataPoints = await res.json();
    document.getElementById(
      "content"
    ).innerHTML = `Max temp will be ${
      dataPoints[dataPoints.length - 2].high
    }<br> Min temp will be ${dataPoints[dataPoints.length - 2].low} with a chance of ${
      dataPoints[dataPoints.length - 2].description
    }`;



    document.getElementById("image").src = dataPoints[dataPoints.length - 1].image;
  } catch (error) {
    console.log(error);
  }
};



// POST
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



// Event listener on submit button
document.addEventListener("DOMContentLoaded", () => {
  const button_submit = document.getElementById("generate");
  button_submit.addEventListener("click", tripDetails);
});


// Export functions
export {
    infoFromGeonames,
    infoFromPixabay,
    infoFromWeatherbit,
    updateDisplayInfo,
    tripDetails,
    postData,
};
