
//import
import express from "express";
import {UserRouter} from "./router/userRouter";


export const app = express();

//Router setup
app.use(express.json());
app.use("/user", UserRouter);

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