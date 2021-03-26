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

    db.getPlaylistsById(id, req.session.userID, function (error, playlist) {
        if (typeof playlist === 'undefined' || (playlist.private == 1 && playlist.ownerID != req.session.userID)) {
            res.redirect("/playlists")
            return
        } else {
            db.getSongsFromPlaylist(id, function (error, songs) {
                if (error) {
                    console.log(error)
                    res.send(error)
                } else {
                    const model = {
                        playlist: playlist,
                        songs: songs,
                        connected: req.session.userID === playlist.ownerID
                    }
                    res.render("songsPlaylist.hbs", model)
                }
            })
        }
    })
})

router.get('/newPlaylist', (req, res) => {
    res.render("newPlaylist.hbs")
})

router.post('/updatePlaylist', (req, res) => {
    const {idPlaylist, newStatus} = req.body

    db.updatePlaylistStatus(idPlaylist, newStatus, function (error) {
        if (error) {
            console.log(error)
        } else {
            res.redirect(req.get('referer'));
        }
    })
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

router.post("/remove-playlist", (req, res) => {
    const data = req.body

    db.removePlaylist(data.idPlaylist, function(error) {
        if (error) {
            res.send(error)
            console.log(error)
        } else {
            res.redirect("/playlists")
        }
    })
})

module.exports = router