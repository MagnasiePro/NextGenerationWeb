const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()

const accountsRouter = require('./src/accountsRouter')

app.use(
	express.static("public")
)

app.use(bodyParser.urlencoded({extended: false}))

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main.hbs',
}))

app.get('/', function (request, response) {
    // Render /views/home.hbs
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

app.use("/accounts", accountsRouter)

app.listen(8080)