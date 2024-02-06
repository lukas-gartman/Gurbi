
import express from "express";
import { taskRouter } from "./router/task";

export const app = express();

app.use(express.json());
//app.use("/task", taskRouter);

/**
* App Variables
*/


const PORT : number = 8080;


/**
* Server Activation
*/


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});