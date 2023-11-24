const express = require("express");
const dotenv = require("dotenv");
const postsRouter = require("./routers/postsRouter");
const routeNotFound = require("./middlewares/routeNotFound");


const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());


app.use("/posts", postsRouter);

app.use(routeNotFound);

app.listen(port, () => {
    console.log(`App attiva su http://localhost:${port}`);
});