const fetch = require('node-fetch')

fetch('https://covid2020-api.herokuapp.com/infectedByState', { mode: 'no-cors' }).then(result => {
    result.json().then(json => console.log(json))
})