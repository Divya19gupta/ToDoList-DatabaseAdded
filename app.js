/*
                                 EJS TEMPLATES (Embedded JS)
we need to learn about templates becuse take an exampe where we are continuouly sending data
through res.send() and then if we want more lines we use res.write() and then even more lines
then we pass on an entire html page, but now if there's more can we pass on hunderends of
html pages that's why we need to learn about templates. */

// <!-- markup for ejs => <%=EJS%> whatever inside of ejs will be replaced
// with whatever that we need  -->

// <!-- TAGS
// <% 'Scriptlet' tag, for control-flow, no output
// <%_ ‘Whitespace Slurping’ Scriptlet tag, strips all whitespace before it
// <%= Outputs the value into the template (HTML escaped)
// <%- Outputs the unescaped value into the template
// <%# Comment tag, no execution, no output
// <%% Outputs a literal '<%'
// %> Plain ending tag
// -%> Trim-mode ('newline slurp') tag, trims following newline
// _%> ‘Whitespace Slurping’ ending tag, removes all whitespace after it -->

// <!-- Scriplet tags works line by line as ejs is only content based and not logic based
// little logic is fine but for more is not advisable -->

const express = require("express");
const app = express();
const _ = require("lodash");

// Adding mongoose and mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-divya:test123@cluster0.6ygpb.mongodb.net/todolistDB");
const itemsSchema = new mongoose.Schema({
    name: String
})
const Item = mongoose.model("item",itemsSchema);
const one = new Item(
    {
        name: "Bring Food"
    }
)
// one.save();
const two = new Item(
    {
        name: "Cook Food"
    }
)
// two.save();
const three = new Item(
    {
        name: "Eat Food"
    }
)
// three.save();
const defaultItems = [one,two,three];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


const bodyParser = require("body-parser");
//app using express with ejs as view engine
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// const date = require(__dirname+"/date.js");
//Now the ques arises how can we push element sin const array?
//well we can push new items in const array but not assign to new array.
//ex a=[1,2,3,4];
//b[] = [6,7,8,9];
//a = b WRONG

//Same goes to objects but if we want to change inside key of objects we can change them
//but not entire object.

// console.log(date);
//getting exports here
app.get("/",function(req,res){
    //  let day=date.getDay();
    //  let day = date.getDate();
    Item.find({},function(err,items){ //it return entire array
        if(items.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err)
                {
                    console.log("Error");
                }
                else{
                    console.log("Inserted data in Items");
                }
            })
            res.redirect("/");
        }
        else{
        res.render("lists",{listTitle:"Today", listItems:items});
        }
    })
    //if we add new listitem and save everything we will get an error 
    //bec here we are rendering first time and value passed to newListItem
    //will be undefined that's why rendering in first time
    //we will have to pprovide all the values.
});

app.post("/",function(req,res){

    let item = req.body.listItem;
    let listName = req.body.list;

    const i = new Item({
        name: item
    })
    if(listName === "Today"){
        i.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(i);
            foundList.save();
            res.redirect("/"+listName);
        })
    }
    
})

app.post("/delete",function(req,res){
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today")
    {
        Item.findByIdAndRemove(checkedItemID,function(err){
            //inorder to actually delete the content we need a callback func
            //else it will only find it and not delte it.
            if(err)
            {
                console.log("Error in checkedId");
            }
            else{
                console.log("Deleted successfully");
                res.redirect("/");
            }
        })
    }
    else
    {
        //here we are deleting items from document of array
                //condition   updates to make    callback
                //$pull : {from where to pull : {what item to pull query}}
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemID}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }
})

app.get("/:customListName",function(req,res){
    const customListName= _.capitalize(req.params.customListName);
    
    List.findOne({name : customListName},function(err, foundList){ //it return one obj
        if(!err){
            if(!foundList)
            {
                //creating new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/"+customListName);
            }
            else
            {
                //showing new list
                res.render("lists",{listTitle:foundList.name, listItems:foundList.items});
            }
        }
    })
})
// app.post("/work",function(req,res){

//   let item = req.body.listItem;
//     workItems.push(item);
//     res.redirect("/work");
//     //problem that occurs here is that if we submit the button it gets redirect to root
//     //and we neeed to chnge that so that work items and main items remain seperate
// })
app.get("/about",function(req,res){
    res.render("about");
})

let port = process.env.PORT;
if(port == null || port =="")
{
    port = 3500;
}
app.listen(port,function(){
    console.log("Todo List server starting");
})

//SCOPING:-
/* 
CASE1:
    function() //FUNCTIONS
    {
       var x=2;
        SOP(x);
    }
    SOP(x) WRONG

CASE2:
    if(true) //CONDITIONAL
    {
       var x=2;
        SOP(x);
    }
    SOP(x) RIGHT

CASE3: DIFF BTW CONST LET VAR

    *CONST DOESNT CHANGE ANYWHERE AND WILL BE LOCAL ALWAYS IF NOT DECLARED GLOBAL
    *LET is like normal c programming variables which are local to only given blocks 
    and inside of those blocks not if declared global
    *VAR can be accessd incaase of blocks bu tnot for functions.


*/


// <% for(var i=0;i<listItems.length;i++){ %>
//     <div class="item">
//     <input type="checkbox">
//         <p> <%= listItems[i].name %></p>
//     </div>
// <% } %> 

//server vs workstation
//in server one can access anytime (24/7) and rules are maintined while in 
//workstation like noraml compu and we need to move it to server