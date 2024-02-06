
import express from "express";
import {UserRegistartionRouter} from "./router/registartionRouter";

//import { taskRouter } from "./router/task";

export const app = express();

app.use(express.json());

//app.use("/task", taskRouter);

app.use("/user", UserRegistartionRouter);

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