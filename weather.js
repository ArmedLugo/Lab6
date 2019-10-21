const credentials = require('./credentials.js')
const request = require('request')

const Location = function(place) {
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + place + '.json?access_token=' + credentials.MAPBOX_TOKEN
  request({ url, json: true }, function(error, response) {
    require('dns').resolve('www.google.com', function(err) {
      if (err) {
         console.log("No hay conexion a internet");
      } else {
        if (error) {
        } else {
          const data = response.body
          console.log(response.statusCode)
          if ( data.Response == 'False' ) {
            console.log('Error: ' + data.Error)
          } else {
    
            if(response.statusCode == "401"){
              console.log("Auth Key Incorrecta")
            }
            else if(response.statusCode == "404"){
              console.log("Not Found")
            }
            else if(response.statusCode == "400"){
              console.log("Bad Request")
            }
            else{
            const info = {
              x: data.features[1].geometry.coordinates[0],
              y: data.features[1].geometry.coordinates[1]
            }
    
            Resumen(info.x, info.y)
          }
          }
        }
      }
    });

  })
}


const Resumen = function(x, y) {
  const url = 'https://api.darksky.net/forecast/' + credentials.DARK_SKY_SECRET_KEY +
              '/' + x + ',' + y
  request({ url, json: true }, function(error, response) {
    const data = response.body
    if(response.statusCode == "401"){
      console.log("Auth Key Incorrecta")
    }
    else if(response.statusCode == "404"){
      console.log("Not Found")
    }
    else if(response.statusCode == "400"){
      console.log("Bad Request")
    }
    else{
    const info = {
      temperatura : data.currently.temperature,
      humedad : data.currently.humidity,
      condicion : data.currently.summary
    }

    return info
    console.log('Temperatura Actual ' + info.temperatura + ' Grados, con humedad de ' + info.humedad + 
    ' y un día ' + info.condicion)
  }
  })
}

module.exports = {
  Location : Location,
  Resumen : Resumen
}
