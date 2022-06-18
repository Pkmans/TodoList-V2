import express from "express";
import bodyParser from "body-parser";
import favicon from "serve-favicon";
import path from "path";
import { fileURLToPath } from 'url';

const todoList = ["Welcome to my Todo List App!", "Add new items at the bottom", "<< Click here to check off items"];
const completedList = [];

const app = express();

// dirname stuff
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    
    res.render("list", {todoList: todoList, completedList: completedList});
})

app.post("/", (req, res) => {
    const newItem = req.body.newItem;
    const emptyInput = newItem.trim().length === 0;

    if (!emptyInput) {
        todoList.push(newItem);
    }

    res.redirect("/");
})

app.post("/checked", (req, res) => {
    const checkedItem = req.body.item;

    completedList.push(checkedItem);

    //moves checkedItem to end of array and pops it out
    todoList.push(todoList.splice(todoList.findIndex(item => item === checkedItem), 1)[0]);
    todoList.pop();

    res.redirect("/");
})

app.post("/unchecked", (req, res) => {
    const uncheckedItem = req.body.item;

    todoList.push(uncheckedItem);

    //moves uncheckedItem to end of array and pops it out
    completedList.push(completedList.splice(completedList.findIndex(item => item === uncheckedItem), 1)[0]);
    completedList.pop();

    res.redirect("/");
})

app.post("/clearItems", (req, res) => {
    completedList.length = 0; // chose this over completedList = [] in order to keep array as a constant;
    
    res.redirect("/");
})

app.listen("3000", () => {
    console.log("Server now running on port 3000");
})

