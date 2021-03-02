const express = require('express')
const db = require('./db')

const router = express.Router()

router.post('/add-music', (req, res) => {
    const data = req.body

    if (!data.name || !data.artist) {
        console.log("ERROR: Missing arguments")
    } else {
        db.addSong(data.name, data.artist, function (error, id) {
            res.redirect("/")
        })
    }
})

router.get('/', (req, res) => {
    db.getSongs(function (error, songs) {
        const model = {
            songs: songs
        } 
        res.render('songs.hbs', model)
    })
})

module.exports = router