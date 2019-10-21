const express = require("express");
const app = express();
const PORT = process.env.PORT = 3000;
const credentials = require('./credentials.js')
const request = require('request')
let router = express.Router();
const path = require('path');




router.get('/pais/:pais',function(req,res){

const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + req.params.pais + '.json?access_token=' + credentials.MAPBOX_TOKEN
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
                res.json({  'error': "401",
                'message': "Auth Key Incorrecta" });
            }
            else if(response.statusCode == "404"){
                res.json({  'error': "401",
                'message': "Not Found" });
            }
            else if(response.statusCode == "400"){
                res.json({  'error': "400",
                'message': "Bad Request" });
            }
            else{
            const cords = {
              x: data.features[1].geometry.coordinates[0],
              y: data.features[1].geometry.coordinates[1]
            }
            
            const url = 'https://api.darksky.net/forecast/' + credentials.DARK_SKY_SECRET_KEY +
              '/' + cords.x + ',' + cords.y
                    request({ url, json: true }, function(error, response) {
                        const data = response.body
                        if(response.statusCode == "401"){
                            res.json({  'error': "401",
                                        'message': "Auth Key Incorrecta" });
                        }
                        else if(response.statusCode == "404"){
                            res.json({  'error': "401",
                            'message': "Not Found" });
                        }
                        else if(response.statusCode == "400"){
                            res.json({  'error': "400",
                            'message': "Bad Request" });
                        }
                        else{
                        const info = {
                        temperatura : data.currently.temperature,
                        humedad : data.currently.humidity,
                        condicion : data.currently.summary
                        }

                        res.json({  'temperatura': info.temperatura,
                                    'humedad': info.humedad ,
                                    'condicion': info.condicion});

                        }
                        })
          }
          }
        }
      }
    });

  })

    
});

app.use('/api',router);

app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running on port ' + PORT);
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

