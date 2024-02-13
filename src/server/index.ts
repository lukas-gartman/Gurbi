import express from "express";
import {userRouter} from "./router/user";

export const app = express();

//Router setup
app.use(express.json());

//app.use("/task", taskRouter);

app.use("/user", userRouter);

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
