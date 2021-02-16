const express = require('express')
const db = require('./db')

const router = express.Router()

router.get("/", (req, res) => {
    db.getPlaylists(function (error, playlists) {
        if (error) {
            console.log(error)
        } else {
            const model = {
                playlists: playlists
            }
            res.render("playlist.hbs", model)
        }
    })
})

router.get('/newPlaylist', (req, res) => {
    res.render("newPlaylist.hbs")
})

router.post("/submit-playlist", (req, res) => {
    const { name, isPrivate } = req.body

    if (!name || !isPrivate) {
        console.log("ERROR: Missing fields: " + name + " " + isPrivate)
    } else {
        db.createPlaylist(req.session.userID, name, isPrivate, function (error) {
            if (error) {
                console.log(error)
            } else {
                res.redirect("/playlists")
            }
        })
    }
})

module.exports = router