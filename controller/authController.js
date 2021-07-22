const express = require('express');
const mongoose = require('mongoose');

const Energia = require('../models/Energia');
const Agua = require('../models/Agua');
const Temperatura = require('../models/Temperatura');
const Dispositivos = require('../models/Dispositivos');
const Alarmes = require('../models/Alarmes');

const router = express.Router();

//REQUESTS
router.get('/sendEnergy', async (req, res) => {
    try {
        const user = await Energia.findOne().sort({DATETIME: 'desc'});
        //console.log(user);
        return res.send({user});
    }
    catch(err){
        return res.status(400).send({ error: 'Falhou'})
    }
});

router.get('/sendTemperature', async (req, res) => {
    try {
        const user = await Temperatura.findOne().sort({DATETIME: 'desc'});
        //console.log(user);
        return res.send({user});
    }
    catch(err){
        return res.status(400).send({ error: 'Falhou'})
    }
});

router.get('/sendAgua', async (req, res) => {
    try {
        const user = await Agua.findOne().sort({DATETIME: 'desc'});
        //console.log(user);
        return res.send({user});
    }
    catch(err){
        return res.status(400).send({ error: 'Falhou'})
    }
});

router.get('/sendDevices', async (req, res) => {
    try {
        const devices = await Dispositivos.find().sort({nome: 'desc'});
        //console.log(user);
        return res.send({devices});
    }
    catch(err){
        return res.status(400).send({ error: 'Falhou'})
    }
});

router.get('/sendAlarms', async (req, res) => {
    try {
        const alarmes = await Alarmes.find().sort({nome: 'desc'});
        console.log(alarmes);
        return res.send({alarmes});
    }
    catch(err){
        return res.status(400).send({ error: 'Falhou'})
    }
});

router.get('/sendComodos', async (req, res) => {
    try {
        const comodos = await Dispositivos.collection.distinct('comodo');
        console.log(comodos);
        return res.send({comodos});
    }
    catch(err){
        console.log(err)
        return res.status(402).send({ error: 'Falhou'})
    }
});

router.post('/addDevice', async (req, res) => {
    try {
        console.log(req.body.deviceName);
        Dispositivos.collection.insertOne({
            nome: req.body.deviceName,
            type: req.body.deviceType,
            comodo: req.body.deviceComodo,
            icon: req.body.deviceIcon,
            value: 0,
            flag: false
        })
        return res.send("recebido");
    }
    catch(err){
        console.log(err)
        return res.status(300).send({ error: 'Falhou'})
    }
});

router.post('/addAlarm', async (req, res) => {
    try {
        console.log(req.body);
        Alarmes.collection.insertOne({
            dispositivo: req.body.alarmDevice,
            type: req.body.alarmType,
            tempo: req.body.alarmTime,
            icon: req.body.alarmIcon,
            sensor: req.body.alarmSensor,
            onoff: req.body.alarmOnoff,
            sensor_value: req.body.alarmSensorValue,
            regra: req.body.alarmSensorRule
        })
        return res.send("recebido");
    }
    catch(err){
        console.log(err)
        return res.status(300).send({ error: 'Falhou'})
    }
});

router.post('/deleteDevice', async (req, res) => {
    try {
        console.log(req.body.deviceObjId);
        Dispositivos.collection.deleteOne({"_id" : mongoose.Types.ObjectId(req.body.deviceObjId)});
        /*console.log(success);*/
        return res.send(req.body);
    }
    catch(err){
        console.log(err)
        return res.status(300).send({ error: 'Falhou'})
    }
});

router.post('/deleteAlarm', async (req, res) => {
    try {
        console.log(req.body.alarmObjId);
        Alarmes.collection.deleteOne({"_id" : mongoose.Types.ObjectId(req.body.alarmObjId)});
        /*console.log(success);*/
        return res.send(req.body);
    }
    catch(err){
        console.log(err)
        return res.status(300).send({ error: 'Falhou'})
    }
});

router.post('/setDeviceState', async (req, res) => {
    try {
        console.log(req.body.deviceObjId);
        disp = await Dispositivos.collection.findOne({"_id" : mongoose.Types.ObjectId(req.body.deviceObjId)});
        Dispositivos.collection.updateOne({"_id" : mongoose.Types.ObjectId(req.body.deviceObjId)},{$set: {flag:!disp["flag"]}},{upsert: true})
        return res.send(req.body);
    }
    catch(err){
        console.log(err)
        return res.status(300).send({ error: 'Falhou'})
    }
});

module.exports = app => app.use('/auth', router);