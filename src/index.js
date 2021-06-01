const excelToJson = require('convert-excel-to-json')
const fs = require('fs')
const path = require('path')
const express = require('express')
const R = require('ramda')

sourceFile = './COVID/export_dataframe_medium.xlsx'

// INFECTED
const infected = excelToJson({
    sourceFile: sourceFile,
    header: {
        rows: 1
    },
    sheets: ['Sheet1'],
    columnToKey: {
        AI: 'Contagiado',
        G: 'Estado',
        K: 'Fecha',
        V: 'Asma',
        O: 'Edad',
        M: 'Intubado',
        N: 'Neumonia'
    }
})

fs.writeFileSync("src/data/infected.json", JSON.stringify(infected, null, 2), (err) => {
    if (err) {
        console.log(err)
    }
})

//INFECTED BY STATE
const infectedByState = infected.Sheet1.map(d => {
    return {
        Estado: d.Estado,
        Contagiado: d.Contagiado
    }
})

//INFECTED BY DATE
const infectedByDate = infected.Sheet1.map(d => {
    return {
        Fecha: d.Fecha,
        Contagiado: d.Contagiado
    }
})

//ASTHMATIC BY AGE
const asthmaByAge = infected.Sheet1.map(d => {
    return {
        Edad: d.Edad,
        Contagiado: d.Contagiado,
        Asma: d.Asma
    }
})

//NEUMONIA BY AGE
const neumoniaByAge = infected.Sheet1.map(d => {
    return {
        Edad: d.Edad,
        Neumonia: d.Neumonia,
        Contagiado: d.Contagiado
    }
})

//INTUBATED BY AGE
const intubatedByAge = infected.Sheet1.map(d => {
    return {
        Edad: d.Edad,
        Intubado: d.Intubado,
        Contagiado: d.Contagiado
    }
})

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
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
    
    res.json(getResult(filteredResult))
})

app.get('/infectedByDate', (req, res) => {
    const getResult = R.countBy(R.prop('Fecha'))

    infectedByDate.forEach(obj => {
        obj.Fecha = new Date(obj.Fecha).toLocaleDateString()
    })

    const filteredResult = infectedByDate.filter(d => d.Contagiado.toLowerCase().includes("confirmado"))
    
    res.json(getResult(filteredResult))
})

app.get('/asthmaByAge', (req, res) => {
    const getResult = R.countBy(R.prop('Edad'))

    const filteredResult = asthmaByAge.filter(d => {
        var filtered = true
        if(!d.Contagiado.toLowerCase().includes("confirmado")) filtered = false
        if(d.Asma != 'SI') filtered = false

        return filtered
    })
    
    res.json(getResult(filteredResult))
})

app.get('/neumoniaByAge', (req, res) => {
    const getResult = R.countBy(R.prop('Edad'))

    const filteredResult = neumoniaByAge.filter(d => {
        var filtered = true
        if(!d.Contagiado.toLowerCase().includes("confirmado")) filtered = false
        if(d.Neumonia != 'SI') filtered = false

        return filtered
    })
    
    res.json(getResult(filteredResult))
})

app.get('/intubatedByAge', (req, res) => {
    const getResult = R.countBy(R.prop('Edad'))

    const filteredResult = intubatedByAge.filter(d => {
        var filtered = true
        if(!d.Contagiado.toLowerCase().includes("confirmado")) filtered = false
        if(d.Intubado != 'SI') filtered = false

        return filtered
    })
    
    res.json(getResult(filteredResult))
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})
