import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import cors from "cors";
import { config } from "dotenv";

// Import Model
import searchResultModel from "./models/searchResults.js";

// Load .env File
config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ message: "Make a POST Request to / with query as a body" });
});

const getFoodCalories = async (foodData) => {
  const a_req = await axios.post(
    `https://trackapi.nutritionix.com/v2/natural/nutrients`,
    { query: foodData.food_name },
    {
      headers: {
        "x-app-id": process.env.NUTRONIX_APP_ID,
        "x-app-key": process.env.NUTRONIX_API_KEY,
      },
    }
  );

  const foodName = foodData.food_name;
  return { foodName, calories: a_req.data.foods[0].nf_calories };
};

// accepts name of food as string param
app.post("/", async (req, res) => {
  const { query } = req.body;
  console.log(`Queried for: ${query}`);
  const resp = [];

  //   Check in DB
  try {
    const chk = await searchResultModel.findOne({ query }).exec();
    if (chk) {
      console.log("Present in DB, Fetching from DB...");
      return res.status(200).send({ data: chk.result });
    }
  } catch (error) {
    console.log("Error while reading DB", error);
  }

  // If not found in db, call external API
  console.log("Fetching from API...");
  let api_req;
  try {
    api_req = await axios.get(
      `https://trackapi.nutritionix.com/v2/search/instant?query=${query}`,
      {
        headers: {
          "x-app-id": process.env.NUTRONIX_APP_ID,
          "x-app-key": process.env.NUTRONIX_API_KEY,
        },
      }
    );
  } catch (error) {
    console.log("error while fetch nutri api", error);
  }

  const top5 = api_req.data.common.slice(0, 5);
  for (const index in top5) {
    const data = await getFoodCalories(top5[index]);
    resp.push(data);
  }

  //  Add to DB
  try {
    const record = new searchResultModel({
      query,
      result: resp,
    });
    await record.save();
  } catch (error) {
    console.log("failed to add to db", error);
  }
  return res.status(200).send({ data: resp });
});

mongoose.connect(process.env.DB_URI, {}, (error) => {
  if (error) {
    console.error("db error is", error);
  } else {
    console.log("Database Connected");
    app.listen(3000, () => {
      console.log("Server Listening on Port 3000");
    });
    console.log("app started");
  }
});
