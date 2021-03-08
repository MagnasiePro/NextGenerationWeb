const express = require('express')
const db = require('./db')

const router = express.Router()

router.post('/add-song', (req, res) => {
    const data = req.body

    if (!data.name || !data.artist) {
        console.log("ERROR: Missing arguments")
    } else {
        db.addSong(data.name, data.artist, function (error, id) {
            res.redirect("/")
        })
    }
})

router.post('/add-song-to-playlist', (req, res) => {
    const data = req.body


})

router.get('/', (req, res) => {
    db.getSongs(function (error, songs) {
        db.getPlaylistsByOwnerId(req.session.userID, function (error, playlists) {
            const model = {
                songs: songs,
                playlists: playlists
            }
            res.render('songs.hbs', model)
        })
    })
})

module.exports = router