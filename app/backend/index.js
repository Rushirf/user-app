const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(
  "/users",
  require("./routes/userRoute")
);

(async () => {
  try {
    console.log("[+] Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[+] Connection Successful");

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log("[+] Server running on port " + port);
    });
  } catch (e) {
    console.log("[-] Connection Failed");
  }
})();
