function handleSubmit(event) {
    event.preventDefault()
    let formText = document.getElementById('place').value;
    let departureDate = document.getElementById('date').value;
    if ((formText === "") | (departureDate === "")) {
      alert("Fill the Location or Date appropriately");
    } else {
      let baseURL = 'http://api.geonames.org/searchJSON?style=full&maxRows=12&name_startsWith=';
      let location = formText;
      let theDepartureDate = departureDate;
      const username1 = `${process.env.Username}`
      const username ='&username=username1'
      let reqBody = {
          theText: formText
      };
      const getCoordinates = async (baseURL, location, username)=>{
          const res = await fetch(baseURL+location+username)
          try {
            const data = await res.json(); 
            let coord = {
                lat: data.geonames[0].lat,
                long: data.geonames[0].lng
            }
            return coord;
          }  catch(error) {
          }
      }
      getCoordinates(baseURL, location, username)
      .then(function(data) {
          const latitude = data.lat;
          const longitude = data.long;
          const reqBody = {
              lat: latitude,
              lng: longitude,
              location: formText,
              date: departureDate
          }
          const theReturnedWeatherData = postData('http://localhost:8080/getWeather', reqBody);
      }).then(function(mainResponse){
      });
      const postData = async(url = '', data = {})=>{
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      
        try {
          const newData = await response.json();
          let cityImage = document.getElementById('cityImg');
          cityImage.src = newData[newData.length-1].theImage;

          let high = document.getElementById('high');
          high.textContent = newData[newData.length-1].theHigh;

          let low = document.getElementById('low');
          low.textContent = newData[newData.length-1].theLow;

          let summary = document.getElementById('summary');
          summary.textContent = newData[newData.length-1].theSummary;

          let theDepartingDate = document.getElementById('departingDate');
          theDepartingDate.textContent = departureDate;

          let theLocation = document.getElementById('departingLocation');
          theLocation.textContent = formText;

          return newData;

        } catch(error) {
          console.log("error", error);
        }
      }
    }
  }


export { handleSubmit }
