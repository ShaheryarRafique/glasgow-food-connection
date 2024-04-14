//Required Packages
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require('body-parser');
const cors = require("cors");
const mustacheExpress = require('mustache-express');
const cookieParser = require('cookie-parser');

// Define routes
const pageRouter = require('./routes/index');
const foodRoutes = require('./routes/food');
const authRoutes = require('./routes/auth_routes');
const contactRoutes = require('./routes/contact_routes');

//Env Variables
dotenv.config({
    path: path.join(__dirname, ".env"),
});

//Express APP
const app = express();

// Configure Mustache template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Disable app cache for views
if (app.get('env') === 'development') {
    app.disable('view cache');
}

app.use(express.json());

// Enable CORS for all routes
const corsOption = {
    origin: true,
    credentials: true,
};
app.use(cors(corsOption));

//view the request url
app.use(morgan("dev"));


// cookie parser
app.use(cookieParser());

//Routes Middleware
// index route file
app.use('/', pageRouter);

// API Routes
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/food', foodRoutes);
app.use('/api/v1/user', authRoutes);

//Unknown API endpoint
app.use((req, res, next) => {
    res.status(404).render('layouts/404', { title: "404 Not Found" });
});


//Export File
module.exports = app;