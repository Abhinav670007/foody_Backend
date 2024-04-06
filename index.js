const express = require('express')
const cors = require("cors")

const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json({ limit: "10mb" }))

const PORT = process.env.PORT || 8080

//mongo db connection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('connect to database'))
    .catch((err) => console.log(err))

//scheme
const userSchema = mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    psswd: String
})

//model

const userModel = mongoose.model("lists", userSchema)

app.get("/", (req, res) => {
    res.send("server is running")
})


//signUP API
app.post("/signup", (req, res) => {
    const { email } = req.body


    userModel.findOne({ email: email })
        .then(result => {
            if (result) {
                res.send({ message: "email is already registered", alert: false })
            } else {
                const data = userModel(req.body)
                const save = data.save()
                res.send({ message: "successfully registered", alert: true })
            }
        })
        .catch(err => {
        });

})

//API login

app.post("/login", (req, res) => {
    const { email, psswd } = req.body
console.log( req.body);
    userModel.findOne({ email, psswd})
        .then(result => {
            console.log(result);
            if (result) {
                const dataSend = {
                    id: result._id,
                    username: result.username,
                    email: result.email
                }
                res.send({ message: "login successfull", alert: true, data: dataSend })
            }
            else {
                res.send({ message: "email  is not available", alert: true, data: dataSend })

            }
        })

        .catch(err => {
            res.send({ message: "email  is not avalable", alert: false })

        });
})

//product section

const schemaProduct = mongoose.Schema({
    name: String,
    category: String,
    image: String,
    price: String,
    description: String,
});
const productModel = mongoose.model("product", schemaProduct)

//save product in data 
//api
app.post("/uploadProduct", async (req, res) => {
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({ message: "upload succesfully" })
})

//api for fetching data from mongoDB

app.get("/product", async (req, res) => {
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})

app.listen(PORT, () => console.log("server is running at port: " + PORT))