import express from "express";
import bodyParser from "body-parser";
import favicon from "serve-favicon";
import path from "path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";

// const todoList = ["Welcome to my Todo List App!", "Add new items at the bottom", "<< Click here to check off items"];
const completedList = [];

const app = express();

//_dirname stuff
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.set('view engine', 'ejs');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://admin-aaron:DRVzW5bhN6UbN87q@cluster0.vjl4y.mongodb.net/todolistDB');
}

const itemSchema = new mongoose.Schema({
    name: String
})

const completedItemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model('Item', itemSchema);

const CompletedItem = mongoose.model("CompletedItem", completedItemSchema);

const item1 = new Item({ name: "Welcome to my Todo List App!" });
const item2 = new Item({ name: "Add new items at the bottom" });
const item3 = new Item({ name: "<< Click here to check off items" });

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
    // Note: For more complicated scenarios, async control flow library 
    //       would help instead of nested callbacks.

    // Add default items if TodoList is empty
    Item.find({}, (err, todoItemsFound) => {
        if (todoItemsFound.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Default items saved");
                }
            });
            res.redirect("/");
        } else {
            CompletedItem.find({}, (err, completedItemsFound) => {
                res.render("list", { todoList: todoItemsFound, completedList: completedItemsFound });
            })
        }
    });

})

app.post("/", (req, res) => {
    console.log(req.body.newItem);

    const newItem = new Item({ name: req.body.newItem });
    const emptyInput = newItem.name.trim().length === 0;

    if (!emptyInput) {
        newItem.save();
    }

    res.redirect("/");
})

app.post("/checked", (req, res) => {
    const checkedItem = new CompletedItem({ name: req.body.item });

    checkedItem.save();
    Item.deleteOne({name: req.body.item}, (err) => {
        if (err) {
            console.log(err);
        } 
    });

    res.redirect("/");
})

app.post("/unchecked", (req, res) => {
    const uncheckedItem = new Item({name: req.body.item});

    uncheckedItem.save()
    CompletedItem.deleteOne({name: req.body.item}, (err) => {
        if (err) {
            console.log(err);
        } 
    })

    res.redirect("/");
})

app.post("/clearItems", (req, res) => {
    CompletedItem.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        } 
    })

    res.redirect("/");
})

app.listen("3000", () => {
    console.log("Server now running on port 3000");
})

