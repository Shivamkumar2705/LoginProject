const express = require("express");
const cors = require("cors");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

//cookie-parser - what is this and why we need this ?

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

require("./config/database").connect();

//route import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

//actuivate

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})