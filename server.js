const express = require("express");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const server = express();

server.use(cors());

server.use(express.json());

PORT = process.env.PORT;

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/flowers", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dataSchema = new mongoose.Schema({
  name: String,
  photo: String,
  instructions: String,
});

const dataModel = new mongoose.model("data", dataSchema);

const ownerSchema = new mongoose.Schema({
  ownerEmail: String,
  ownerArr: [dataSchema],
});

const ownerModel = new mongoose.model("owner", ownerSchema);

function ownerSeeding() {
  const Ghadeer = new ownerModel({
    ownerEmail: "ghadeerkhasawneh91@gmail.com",
    ownerArr: [
      {
        name: "Lily",
        photo:
          "https://media.self.com/photos/5ea9f52ea469834e6f5489e6/1:1/w_3204,h_3204,c_limit/peony_flowers_bouquet.jpg",
        instructions: "the most beloved bulbs for the summer garden",
      },
    ],
  });

  const Roaa = new ownerModel({
    ownerEmail: "roaa.abualeeqa@gmail.com",
    ownerArr: [
      {
        name: "Rose",
        photo:
          "https://www.ikea.com/jo/en/images/products/smycka-artificial-flower-rose-red__0903311_pe596728_s5.jpg?f=s",
        instructions: "fresh-looking and beautiful",
      },
    ],
  });

  Ghadeer.save();
  Roaa.save();
}
// ownerSeeding();

server.get("/getData", getDataHandler);

function getDataHandler(req, res) {
  axios
    .get(`https://flowers-api-13.herokuapp.com/getFlowers`)
    .then((result) => {
      res.send(result.data.flowerslist);
    });
}

server.post("/postData", postDataHandler);

function postDataHandler(req, res) {
  const { ownerEmail, name, photo, instructions } = req.body;

  ownerModel.find({ ownerEmail: ownerEmail }, (err, results) => {
    results[0].ownerArr.push({
      name: name,
      photo: photo,
      instructions: instructions,
    });
    results[0].save();
    res.send(results[0].ownerArr);
  });
}

server.get("/getFromDataBase", getFromDataBaseHandler);

function getFromDataBaseHandler(req, res) {
  const { ownerEmail } = req.query;
  ownerModel.find({ ownerEmail: ownerEmail }, (err, results) => {
    res.send(results[0].ownerArr);
  });
}

server.delete("/deleteData/:idx", deleteDataHndler);

function deleteDataHndler(req, res) {
  const { ownerEmail } = req.query;
  const { idx } = req.params;

  ownerModel.find({ ownerEmail: ownerEmail }, (err, results) => {
    const newarr = results[0].ownerArr.filter((item, index) => {
      if (index != idx) {
        return true;
      }
    });

    results[0].ownerArr = newArr;
    results[0].save();
    res.send(results[0].ownerArr);
  });
}

server.update("/updateData/:index", updateDataHandler);

function updateDataHandler(req, res) {
  const { ownerEmail, name, photo, instructions } = req.body;

  const { index } = req.params;

  ownerModel.findOne({ ownerEmail: ownerEmail }, (err, results) => {
    results.ownerArr.splice(index, 1, {
      name: name,
      photo: photo,
      instructions: instructions,
    });

    results.save();
    res.send(results.ownerArr);
  });
}

server.listen(PORT, () => {
  console.log("listenning");
});
