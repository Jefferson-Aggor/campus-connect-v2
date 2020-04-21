const express = require("express");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const bodyParser = require("body-parser");
const session = require("express-session");
const socket = require("socket.io");
const http = require("http");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
const app = express();

// socket io
const server = http.createServer(app);
const io = socket(server);

// use public file
app.use(express.static(path.join(__dirname, "Public")));
const {} = require("./helpers/hbs");

// middlewares
app.engine(
    "handlebars",
    exphbs({
        handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
);
app.set("view engine", "handlebars");

// passport
require("./config/passport")(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express sessions
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })
);
// connect flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");

    next();
});

// init passport
app.use(passport.initialize());
app.use(passport.session());

// require files
const user = require("./Routes/user");
const index = require("./Routes/index");
const chatRoom = require("./Routes/chat")(io);
const api = require("./Routes/api");
const { mongURI } = require("./config/keys");

// connect mongoDB
mongoose
    .connect(mongURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(`MongDB not connected because of ${err}`);
    });

app.use("/", index);
app.use("/user", user);
app.use("/chat-room", chatRoom);
app.use("/api", api);

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));