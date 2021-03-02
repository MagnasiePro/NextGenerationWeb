const { request } = require('express')
const express = require('express')
const db = require('./db')

const router = express.Router()

router.get("/", (req, res) => {
    db.getPlaylists(req.session.userID, function (error, playlists) {
        if (error) {
            console.log(error)
        } else {
            const model = {
                playlists: playlists
            }
            res.render("playlists.hbs", model)
        }
    })
})

router.get('/:id/songs', (req, res) => {
    const id = req.params.id

    db.getPlaylistsById(id, function (error, playlist) {
        if (playlist.private == 1 && playlist.ownerID != req.session.userID) {
            res.render("/playlists")
            return
        } else {
            db.getSongsFromPlaylist(id, function (error, songsID) {
                if (error) {
                    callback(error)
                } else {
                    console.log("Songs in playlists n°" + id + ": " + songsID)
        
                    const model = {
                        playlist: playlist,
                        songsID: songsID
                    }
                    res.render("songs.hbs", model)
                }
            })
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