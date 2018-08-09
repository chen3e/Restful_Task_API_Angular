var express = require('express');
var app = express();
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/dist/public'));
mongoose.connect('mongodb://localhost/persons');

var TaskSchema = new mongoose.Schema({
    title: String,
    desc: {type: String, default: ""},
    completed: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
})
var Task = mongoose.model('Task', TaskSchema)

app.get('/tasks', function(req, res){
    console.log("In main tasks!")
    var tasks = Task.find({}, function(err, tasks){
        if(err){
            console.log("Returned error", err);
            res.json({message: "Error", error: err})
        }
        else {
           res.json({message: "Success", data: tasks})
        }
     })
})    

app.post('/tasks', function(req, res){
    var task = new Task({title: req.body.title, desc: req.body.desc})
    task.save(function(err){
        if (err){
            console.log("Failure!")
        }
        else{
            console.log("Success!")
        }
        res.redirect("/tasks")
    })
})

app.delete('/tasks/:id', function(req, res){
    Task.remove({_id: req.params.id}, function(err){
        if (err){
            console.log("Failure!")
        }
        else{
            console.log("Success!")
        }
        res.redirect("/tasks")
    })
})

app.get('/tasks/:id', function(req, res){
    task = Task.findOne({_id: req.params.id}, function(err, task){
        if (err){
            console.log("Failure!")
        }
        else{
            console.log("Success!")
        }
        res.json({message: 'Success', data: task})
    })
})

app.put('/tasks/:id', function(req, res){
    Task.update({_id: req.params.id}, {title: req.body.title, desc: req.body.desc, updatedAt: Date.now()}, function(err, task){
        if (err){
            console.log("Failure!")
        }
        else{
            console.log("Successfully updated!")
        }
        res.redirect("/")
    })
})

app.delete('/deleteall', function(req, res){
    console.log("Trying to delete all")
    Task.remove({}, function(err){
        if (err){
            console.log("What?!?!")
        }
        else{
            console.log("Clean slate now")
        }
        res.redirect("/tasks")
    })
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})