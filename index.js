const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(authRouter);

const DB ="mongodb+srv://evdk12gpass:j2VPxBlHG9ifSVIO@cluster0.ug8hjgq.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(DB).then(()=>{
    console.log("Database Connected");
}).catch((e)=>{
    console.log(e);
});

app.listen(PORT, "0.0.0.0",()=>{
    console.log(`connected at port ${PORT}`);
});