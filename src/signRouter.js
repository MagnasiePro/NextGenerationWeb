const express = require('express')
const db = require('./db')
const bcrypt = require("bcryptjs");

const router = express.Router()

router.post('/submit-registration', (req, res) => {
    const data = req.body

    if (!data.username || !data.password) {
        console.log("ERROR: Missing field")
        res.redirect("/signup")
    } else if (data.password != data.passwordVerif) {
        console.log("ERROR: invalid password verification")
        res.redirect("/signup")
    } else {
        bcrypt.hash(req.body.password, 10).then((hash) => {
            db.createAccount(data.username, hash, function (error, id) {
                if (error) {
                    // TODO: Handle error.
                    console.log("ERROR: " + error)
                } else {
                    req.session.userID = id
                    res.redirect("/")
                }
            })
        });
    }
})

router.post('/submit-login', (req, res) => {
    const data = req.body

    if (!data.username || !data.password) {
        console.log("ERROR: Missing field")
        res.redirect("/login")
    } else {
        db.loginAccount(data.username, function (error, account) {
            bcrypt.compare(data.password, account.password, function (err, response) {
                if (res) {
                    req.session.userID = account.id
                    res.redirect("/")
                } else {
                    res.redirect("/login")
                }
            });
        })
    }
})

module.exports = router