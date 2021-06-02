const express = require('express')
const R = require('ramda')
const COVID_DB = require('../COVID/export_dataframe.json')
const path = require('path')
const cors = require('cors')


const infected = COVID_DB.map(d => {
    return {
        Contagiado: d.CLASIFICACION_FINAL,
        Estado: d.ENTIDAD_RES,
        Fecha: d.FECHA_SINTOMAS,
        Asma: d.ASMA,
        Edad: d.EDAD,
        Intubado: d.INTUBADO,
        Neumonia: d.NEUMONIA
    }
})

//INFECTED BY STATE
const infectedByState = infected.map(d => {
    return {
        Estado: d.Estado,
        Contagiado: d.Contagiado
    }
})

//INFECTED BY DATE
const infectedByDate = infected.map(d => {
    return {
        Fecha: d.Fecha,
        Contagiado: d.Contagiado
    }
})

//ASTHMATIC BY AGE
const asthmaByAge = infected.map(d => {
    return {
        Edad: d.Edad,
        Contagiado: d.Contagiado,
        Asma: d.Asma
    }
})

//NEUMONIA BY AGE
const neumoniaByAge = infected.map(d => {
    return {
        Edad: d.Edad,
        Neumonia: d.Neumonia,
        Contagiado: d.Contagiado
    }
})

//INTUBATED BY AGE
const intubatedByAge = infected.map(d => {
    return {
        Edad: d.Edad,
        Intubado: d.Intubado,
        Contagiado: d.Contagiado
    }
})

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
//app.use('/', express.static(path.join(__dirname,  '../public')))

app.get('', (req, res) => {
    res.json({
        'Infected by state': '/infectedByState',
        'Infected by date': '/infectedByDate',
        'Asthmatic by age': '/asthmaByAge',
        'Neumonia by age': '/neumoniaByAge',
        'Intubated by age': '/intubatedByAge'
    })
})

app.get('/infectedByState', (req, res) => {
    const getResult = R.countBy(R.prop('Estado'))

    const filteredResult = infectedByState.filter(d => d.Contagiado.toLowerCase().includes("confirmado"))

    var jsonResult = getResult(filteredResult)
    var result = [];

    for(var i in jsonResult)
        result.push({Estado: i, Cantidad: jsonResult[i]})
    
    res.send(result)
})

app.get('/infectedByDate', (req, res) => {
    const getResult = R.countBy(R.prop('Fecha'))

    infectedByDate.forEach(obj => {
        obj.Fecha = new Date(obj.Fecha).toLocaleDateString()
    })

    const filteredResult = infectedByDate.filter(d => d.Contagiado.toLowerCase().includes("confirmado"))
    
    var jsonResult = getResult(filteredResult)
    var result = [];

    for(var i in jsonResult)
        result.push({Fecha: i, Cantidad: jsonResult[i]})
    
    res.send(result)
})

app.get('/asthmaByAge', (req, res) => {
    const getResult = R.countBy(R.prop('Edad'))

    const filteredResult = asthmaByAge.filter(d => d.Asma.replace(' ', '') != 'SI')
    
    var jsonResult = getResult(filteredResult)
    var result = [];

    for(var i in jsonResult)
        result.push({Edad: i, Cantidad: jsonResult[i]})
    
    res.send(result)
})

app.get('/neumoniaByAge', (req, res) => {
    const getResult = R.countBy(R.prop('Edad'))

    const filteredResult = neumoniaByAge.filter(d => d.Neumonia.replace(' ', '') != 'SI')
    
    var jsonResult = getResult(filteredResult)
    var result = [];

    for(var i in jsonResult)
        result.push({Edad: i, Cantidad: jsonResult[i]})
    
    res.send(result)
})

app.get('/intubatedByAge', (req, res) => {
    const getResult = R.countBy(R.prop('Edad'))

    const filteredResult = intubatedByAge.filter(d => d.Intubado.replace(' ', '') != 'SI')
    
    var jsonResult = getResult(filteredResult)
    var result = [];

    for(var i in jsonResult)
        result.push({Edad: i, Cantidad: jsonResult[i]})
    
    res.send(result)
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})
