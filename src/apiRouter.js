const express = require('express')
const db = require('./db')
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const router = express.Router()

router.post('/tokens', (req, res) => {
    console.log("API: Trying to generate tokens...")
    const data = req.body

    if (req.body.grant_type == "password") {
        db.loginAccount(data.username, function (error, account) {
            bcrypt.compare(data.password, account.password, function (err, response) {
                if (response) {
                    const payloadsTokenID = {
                        "sub": account.id,
                        "preferred_username": data.username,
                    }
                    const payloadsAccessToken = {
                        "userID": account.id
                    }
                    const accessToken = jwt.sign(payloadsAccessToken, "VerySecretKeyAccessToken")
                    const tokenID = jwt.sign(payloadsTokenID, "VerySecretKeyTokenID")
                    console.log("API: Successfully generate tokens !")
                    res.status(200).json({ "access_token": accessToken, "token_type": "Bearer", "id_token": tokenID })

                } else {
                    res.status(400).json({ "error": "invalid_information" })
                    console.log("API: Bad user information")
                }
            })
        })
    } else {
        res.status(400).json({ "error": "invalid_grant" })
        console.log("API: Bad grant_type")
    }
})

router.get('/songs', (req, res) => {
    db.getSongs(function (error, songs) {
        if (error) {
            res.status(500).json({ "error": "internal_server_error" })
            console.log(error)
        } else {
            res.status(200).json(songs)
            console.log("API: Requesting songs list")
        }
    })
})

router.get('/playlists', (req, res) => {
    const data = req.headers
    const [type, token] = data.authorization.split(' ')

    if (type != "Bearer") {
        res.status(400).json({ "error": "bad_type" })
        console.log("API: Bad type send")
    } else {
        jwt.verify(token, "VerySecretKeyAccessToken", function (error, tokenContent) {
            db.getPlaylists(tokenContent.userID, function (error, playlists) {
                if (error) {
                    console.log(error)
                } else {
                    console.log("API: Requesting playlists")
                    res.status(200).json(playlists)
                }
            })
        })
    }
})

router.get('/playlists/:id/songs', (req, res) => {
    const id = req.params.id
    const data = req.headers
    const [type, token] = data.authorization.split(' ')

    if (type != "Bearer") {
        res.status(400).json({ "error": "bad_type" })
        console.log("API: Bad type send")
    } else {
        db.getPlaylistsById(id, function (error, playlist) {
            jwt.verify(token, "VerySecretKeyAccessToken", function (error, tokenContent) {
                if (error || typeof playlist === 'undefined' || (playlist.private == 1 && playlist.ownerID != tokenContent.userID)) {
                    res.status(400).json({"error": "bad_token_or_playlist_doesnt_exist"})
                    return
                } else {
                    db.getSongsFromPlaylist(id, function (error, songs) {
                        if (error) {
                            console.log(error)
                            res.status(500).json(error)
                        } else {
                            console.log("API: Request songs from playlist " + id)
                            res.status(200).json(songs)
                        }
                    })
                }
            })
        })
    }
})

module.exports = router