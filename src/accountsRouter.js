const express = require('express')

const router = express.Router()

router.get('/', function (request, response) {
    const data = require('../scripts/dummy-data')

    response.render("accounts.hbs", data)
})

router.get('/:id', function (request, response) {
    const id = request.params.id
    const data = require('../scripts/dummy-data')

    console.log(data.accounts[id].username)
    response.render("account.hbs", {account: data.accounts[id]})
})

module.exports = router