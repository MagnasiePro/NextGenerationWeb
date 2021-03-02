const express = require('express')
const expressHandlebars = require('express-handlebars')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const bodyParser = require('body-parser')

const app = express()

const accountsRouter = require('./src/accountsRouter')
const signRouter = require('./src/signRouter')
const playlistRouter = require('./src/playlistRouter')
const musicRouter = require('./src/musicRouter')

app.use(expressSession({
    secret: "ThisIsMySuperSecretPassword", //Promise you that it will not be this password for production
    resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 86400000 }
}))

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(
	express.static("public")
)

app.use(bodyParser.urlencoded({extended: false}))

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main.hbs',
}))

app.get('/', function (request, response) {
    response.render("home.hbs")
})

app.get('/contact', function (request, response) {
    response.render("contact.hbs")
})

app.get('/about', function (request, response) {
    response.render("about.hbs")
})

app.get('/login', function (request, response) {
    response.render("./login/login.hbs")
})

app.get('/signup', function (request, response) {
    response.render("./login/signUp.hbs")
})

app.get('/logout', function (request, response) {
    request.session.userID = undefined
    response.redirect('/')
})

app.use("/playlists", playlistRouter)
app.use("/login", signRouter)
app.use("/accounts", accountsRouter)
app.use("/songs", musicRouter)

app.listen(8080)