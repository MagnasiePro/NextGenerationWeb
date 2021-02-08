const express = require('express')
const expressHandlebars = require('express-handlebars')

const app = express()

const accountsRouter = require('./src/accountsRouter')


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

app.use("/accounts", accountsRouter)

app.listen(8080)