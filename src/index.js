const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const db = require("../Database/models");


// app.use(cors())
const corsOptions = {
    origin: '*',
    // credentials: true,
};

// const corsOptions = {
//     origin: 'http://localhost:3000/',
//     credentials: true,
// };

// ROUTERS
const loginRouter = require("./routes/login");
const patientsRouter = require("./routes/patients");
const usersRouter = require("./routes/users");
const hospitalsRouter = require("./routes/hospitals");
const testsRouter = require("./routes/tests");



app.use(express.json())
app.use(cors());
// app.options('*', cors(corsOptions));


app.use("/login", loginRouter);
app.use("/tests", testsRouter);
app.use("/patients", patientsRouter);
app.use("/users", usersRouter);
app.use("/hospitals", hospitalsRouter);


db.sequelize.sync().then(() => {
    console.log(" ")
    console.log("Database is synced")
    app.listen(PORT, () => {
        
        console.log("AFYA MAMA Server Is Online");
    })
})

























