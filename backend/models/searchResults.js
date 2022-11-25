import mongoose, { Schema, model } from "mongoose";

// validation
const schema = Schema({
  query: String,
  result: [{ foodName: String, calories: Number }],
});

export default model("search_results", schema);
