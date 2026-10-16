import dotenv from "dotenv";

dotenv.config();

import https from "https";
import fs from "fs";
import app from "./app.js";


const port = process.env.PORT || 3000;

const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server running on https://localhost:${port}`);
});
