const express = require('express');

const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");

const app = express();

let items = ["cook food", "eat food", "read book"];
let workItems = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.set("view engine","ejs");

app.get("/",function(req, res){

    let day = date.getDate();

    res.render('list', {listTitle: day, newListItems: items});
    // res.write("<h1>currentday</h1>");
    // res.send();
});

app.post("/",function(req, res){
    let item = req.body.newItem;
    if(req.body.list==="Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
   
});

app.get("/work", function(req, res){
    res.render('list', {listTitle: "Work", newListItems: workItems});
});


app.get("/about", function(req, res){
    res.render("about");
});

// app.post("/work",function(req, res){
//     let workItem = req.body.list;
//    items.push(workItem);
    
// });


app.listen(3000,function(){
    console.log("server is running at port 3000")
});