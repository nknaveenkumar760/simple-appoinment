const express = require("express");
const admin = require('firebase-admin');
// const { keys } = require("lodash");
var bodyParser = require('body-parser');
var moment = require('moment'); // require
var momentTimezone = require('moment-timezone')
const serviceAccount = require('./keyfile.json');

//initialize admin SDK using serciceAcountKey

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const port = process.env.PORT || 3200;
const appointment = [];
const Start_Hour = '10:00 AM'; 
const End_Hour = '5:00 PM';
const Duration = 30;
const Timezone = 'Asia/Calcutta';

// create
app.post('/api/create_event', (req, res) => {
    (async () => {
        try {
            var d = new Date(req.body.Datetime);
            console.log(d)
            var timeStamp = d.getTime();
            console.log(timeStamp)
            var duration = req.body.Duration;
            console.log(timeStamp, 'timestamp..', duration)
            // get document
            const ref = db.collection('events').where("Datetime", "==", timeStamp).where("Duration", "==", duration);
            ref.get().then(doc => {
            console.log(doc.size, 'size of doc')
            if (doc.size == 0) {
                db.collection('events').doc().create({Datetime: timeStamp, Duration: duration})
                return res.status(200).send("Event created");
                
            }else{
                return res.status(422).send("Slot not available please choose another slot")
            }
            }) 
          
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });


  // read event according to start date and end date
app.get('/api/get_event', (req, res) => {
    (async () => {
        try {
            console.log(req.query.StartDate, req.query.EndDate)
            var start = new Date(req.query.StartDate);
            var end = new Date(req.query.EndDate);
            console.log(start, end)
            var start_timeStamp = start.getTime();
            var end_timestamp = end.getTime();
            console.log(start_timeStamp, end_timestamp)

            let query = db.collection('events').where("Datetime", ">=", start_timeStamp).where("Datetime", "<=", end_timestamp);
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    console.log(doc.data())
                    // console.log(Object.keys(doc).forEach(key=>{console.log(key)}))
                    const selectedItem = {
                        id: doc.id,
                        Datetime: doc.data().Datetime,
                        Duration: doc.data().Duration
                    };
                    response.push(selectedItem);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

  // get free slot according to date and timezone
app.get('/api/get_free_slot', (req, res) => {
(async () => {
    try {
        console.log(req.query.Date, req.query.Timezone)
        var start = new Date(req.query.Date);
        var start_timeStamp = start.getTime();
        console.log(start_timeStamp)
        
        var secnodStartTimezone = changeTimezone(start, req.query.Timezone)
        console.log(secnodStartTimezone)
        if (Timezone == req.query.Timezone){
            secondEndTimezone = End_Hour
        }else{
            var secondEndTimezone = moment().add(7, 'hours').format('hh:mm A');
        }
       
        var timeSlot = getTimeStops(secnodStartTimezone, secondEndTimezone);
        console.log(timeSlot, 'timestops..')
       

        let result = db.collection('events').where("Datetime", "==", start_timeStamp);
        let response = [];
        console.log(Object.entries(result).length)
        if (Object.keys(result).length === 0 && result.constructor === Object){
            console.log(timeSlot, 'else part')

        }else{
            await result.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    console.log(doc.data())
                    var freeSlot = timeSlot.filter((item) => item!==doc.data().Duration)
                    console.log(freeSlot, 'slot time deleted..', doc.data().Duration)
                    timeSlot = freeSlot
                }
                
                return timeSlot;
            });
        }
            
        return res.status(200).send(timeSlot);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});


function getTimeStops(Start_Hour, End_Hour){
    var startTime = moment(Start_Hour, 'hh:mm A');
    var endTime = moment(End_Hour, 'hh:mm A');
    if (endTime .isBefore(startTime)){
        endTime.add(1, 'day');
      }
    
     var timeStops = [];

    while(startTime <= endTime){
        timeStops.push(new moment(startTime).format('hh:mm A'));
        startTime.add(Duration, 'minutes');
    }
    console.log(timeStops)
    return timeStops;
    }


function changeTimezone(start_time, newTimezone) { 
    var india = momentTimezone.tz("2020-12-15 10:00", Timezone);
    var america = india.clone().tz(newTimezone)  
    newTime = america.format("HH:mm");
    return newTime
} 


var server = app.listen(8081, function () {
var host = server.address().address
var port = server.address().port
console.log("Project listening at http://%s:%s", host, port)
})

