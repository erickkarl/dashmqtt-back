const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { setIntervalAsync } = require('set-interval-async/dynamic')
var request = require("request")
var mqtt = require('mqtt')
var client  = mqtt.connect('http://broker.mqttdashboard.com')
const app = express()
const port = 5000

//dispositivos
const Energia = require('./models/Energia');
const Agua = require('./models/Agua');
const Temperatura = require('./models/Temperatura');
const Dispositivos = require('./models/Dispositivos');
const Alarmes = require('./models/Alarmes')

//Setup
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
     next();
});

require('./controller/authController')(app);

console.log(client.options.clientId + ' ' + client.options.port)

//Habilitando tópicos do HiveMQ
client.on('connect', function () {
  client.subscribe('topic_casa/temperatura/habilitar', function (err) {
    if (!err) {
      console.log('cadastrado com sucesso!')
    }
  })
  client.subscribe('topic_casa/temperatura/medicao', function (err) {
    if (!err) {
      console.log('cadastrado com sucesso!')
    }
  })
  client.subscribe('topic_casa/energia/medicao', function (err) {
    if (!err) {
      console.log('cadastrado com sucesso!')
    }
  })
  client.subscribe('topic_casa/vazao/medicao', function (err) {
    if (!err) {
      console.log('cadastrado com sucesso!')
    }
  })
  client.subscribe('topic_casa/lampada1', function (err) {
    if (!err) {
      console.log('cadastrado com sucesso!')
    }
  })
  client.subscribe('topic_casa/ar', function (err) {
    if (!err) {
      console.log('cadastrado com sucesso!')
    }
  })
})

//Enviar dados dos sensores a cada 1 minuto, com base nos dados mais recentes das tabelas de cada sensor
const timer = setIntervalAsync(
  async () => {
    const alarmes = await Alarmes.find().sort({nome: 'desc'});
    alarmes.forEach(async function (alarme) {
      if(alarme.type === 'time'){
        const at = new Date(Date.now())
        if(at.getHours().toString().padStart(2,"0")+':'+at.getMinutes().toString().padStart(2,"0") === alarme.tempo) {
          Dispositivos.collection.updateOne({"nome" : alarme.dispositivo},{$set: {flag:((alarme.onoff === 'on')?true:false)}},{upsert: true})
          console.log('sucesso');
        }
      }
      else{
        var db = await Temperatura.findOne().sort({"DATETIME": 'desc'});
        if(alarme.sensor === 'vazao'){
          db = await Agua.findOne().sort({DATETIME: 'desc'});
        }
        else if(alarme.sensor === 'potencia'){
          db = await Energia.findOne().sort({DATETIME: 'desc'});
        }

        if(alarme.regra === "maior"){
          if(db.value >= alarme.sensor_value){
            Dispositivos.collection.updateOne({"nome" : alarme.dispositivo},{$set: {flag:((alarme.onoff === 'on')?true:false)}},{upsert: true});
          }
        }
        else if(alarme.regra === "menor"){
          if(db.value < alarme.sensor_value){
            Dispositivos.collection.updateOne({"nome" : alarme.dispositivo},{$set: {flag:((alarme.onoff === 'on')?true:false)}},{upsert: true});
          }
        }
        else{
          if(db.value === alarme.sensor_value){
            Dispositivos.collection.updateOne({"nome" : alarme.dispositivo},{$set: {flag:((alarme.onoff === 'on')?true:false)}},{upsert: true});
          }
        }
      }
    });
  },
  1000*60
)

//Tratando mensagens recebidas pelo MQTT
client.on('message', async function (topic, message) {
  console.log('No topico' + topic)
  console.log('Foi recebido: ' + message.toString())
  if(topic === "topic_casa/energia/medicao"){
    const energia = new Energia({
      DATETIME: Date.now(),
      value: parseFloat(message.toString())
    });
    energia.save();
  }
  else if(topic === "topic_casa/temperatura/medicao"){
    const temperatura = new Temperatura({
      DATETIME: Date.now(),
      value: parseFloat(message.toString())
    });
    temperatura.save();
  }
  else if(topic === "topic_casa/vazao/medicao"){
    const agua = new Agua({
      DATETIME: Date.now(),
      value: parseFloat(message.toString())
    });
    agua.save();
  }
  //Para fins de teste, foram escolhidos esses dispositivos como padrão.
  else if(topic === "topic_casa/ar"){
    disp = await Dispositivos.collection.findOne({"nome" : 'Ar Quarto 2'});
    Dispositivos.collection.updateOne({"nome" : 'Ar Quarto 2'},{$set: {flag:!disp["flag"]}},{upsert: true});
  }
  else if(topic === "topic_casa/lampada1"){
    disp = await Dispositivos.collection.findOne({"nome" : 'Luz Teste'});
    Dispositivos.collection.updateOne({"nome" : 'Luz Teste'},{$set: {flag:!disp["flag"]}},{upsert: true});
  }
})

//--------------------------TESTES E DEPURAÇÂO---------------------------------
//-----------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('Hello World!')
  client.publish('topic_casa/temperatura/medicao', '26')
})

app.get('/31', (req, res) => {
  res.send('Hello World!')
  client.publish('topic_casa/temperatura/medicao', '31')
})

app.get('/teste', (req, res) => {
  res.send('Hello World!')
  client.publish('topic_casa/temperatura/medicao', '29')
  client.publish('topic_casa/energia/medicao', '540')
  client.publish('topic_casa/vazao/medicao', '0')
})
//-----------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})