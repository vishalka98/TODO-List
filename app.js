const express = require('express');

const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");

const _ = require("lodash");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://admin-vishal:admin123@cluster0.gcvvu.mongodb.net/todolistDB",{useNewUrlParser:true});

const itemSchema = {
    name: String,
}

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
     name: "make food"
})

const item2 = new Item({
    name: "eat food"
})

const item3 = new Item({
    name: "read book"
})

let defaultitems = [item1, item2, item3];


const listSchema = {
    Name: String,
    listOfItem: [itemSchema]
}

const list = mongoose.model("list",listSchema);



app.get("/",function(req, res){

   Item.find({},function(err,result){
       
           if(result.length===0){
            Item.insertMany(defaultitems, function(err){
                if(err){
                    console.log("error");
                }
                else{
                    console.log("data added successfully");
                }
            });
            res.redirect("/");
           }
           else{
            res.render('list', {listTitle: "Today", newListItems: result});
           }
       
   })
});


app.get("/:customListName", function(req, res){
    const custom = _.capitalize(req.params.customListName);

    list.findOne({Name:custom}, function(err,foundList){
        if(!foundList){
            const List = new list({
                Name: custom,
                listOfItem:defaultitems
            })
        
            List.save();
            res.redirect("/"+ custom);
        }
        else
        {
            res.render('list', {listTitle: foundList.Name, newListItems: foundList.listOfItem});
        }
    })
})


app.post("/",function(req, res){
    const itemName = req.body.newItem;
    const listname = req.body.list;

    const item = new Item({
        name:itemName,
    });
    if(req.body.list==="Today"){
        item.save();
        res.redirect("/");
    }
    else{
      list.findOne({Name:listname}, function(err,foundList){
          foundList.listOfItem.push(item);
          foundList.save();
          res.redirect("/"+listname);
      })
    }
});


app.post("/delete",function(req, res){
    let itemtodelete = req.body.checkbox;
    let listName = req.body.List;

    if(listName==="Today"){
        Item.findByIdAndRemove(itemtodelete,function(err){
            if(!err){
                console.log("successfully deleted");
                res.redirect("/");
            }
        })
    }
    else{
        list.findOneAndUpdate({Name: listName}, {$pull: {listOfItem: {_id: itemtodelete}}}, function(err,foundList){
            if(!err)
            {
                res.redirect("/"+listName);
            }
        })
    }

   
});



app.listen(process.env.PORT || 3000,function(){
    console.log("server is running at port 3000")
});