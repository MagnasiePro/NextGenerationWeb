const express = require('express')
const db = require('./db')
const sparql = require('./sparql')

const router = express.Router()

router.post('/add-song-to-playlist', (req, res) => {
    const data = req.body

    console.log("Add song: " + data.idSong + " to playlist: " + data.idPlaylist)

    db.addSongToPlaylist(data.idPlaylist, data.idSong, function (error) {
        if (error) {
            console.log(error)
            return
        } else {
            res.redirect("/songs")
        }
    })

})

router.post('/remove-song-to-playlist', (req, res) => {
    const data = req.body

    console.log("Remove song: " + data.idSong + " to playlist: " + data.idPlaylist)

    db.removeSongToPlaylist(data.idPlaylist, data.idSong, function (error) {
        if (error) {
            console.log(error)
            return
        } else {
            res.redirect(req.get('referer'));
        }
    })
})

router.get('/', (req, res) => {
    sparql.getSongs(function (error, songs) {
        if (error) {
            console.log(error)
        } else {
            db.getPlaylistsByOwnerId(req.session.userID, function (error, playlists) {
                if (error) {
                    console.log(error)
                } else {
                    const model = {
                        songs: songs,
                        playlists: playlists
                    }
                    res.render('songs.hbs', model)
                }
            })
        }
    })
})

router.get('/track', (req, res) => {

    sparql.getMoreTrackInfo(req.query.name, req.query.artist, function (songInfo, error) {
        const model = {
            name: req.query.name,
            songInfo: songInfo[0]
        }
        res.render('track.hbs', model)
    })
})

module.exports = router