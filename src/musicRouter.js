const express = require('express')
const db = require('./db')
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');

// connection data to the running GraphDB instance
const GRAPHDB_BASE_URL = 'http://localhost:7200',
    GRAPHDB_REPOSITORY = 'Postify',
    GRAPHDB_USERNAME = 'server',
    GRAPHDB_PASSWORD = 'test',

    DEFAULT_PREFIXES = [
        EnapsoGraphDBClient.PREFIX_OWL,
        EnapsoGraphDBClient.PREFIX_RDF,
        EnapsoGraphDBClient.PREFIX_RDFS,
        EnapsoGraphDBClient.PREFIX_XSD,
        EnapsoGraphDBClient.PREFIX_PROTONS,
        {
            prefix: 'ont',
            iri: "https://dbpedia.org/ontology/"
        },
        EnapsoGraphDBClient.PREFIX_PROTONS,
        {
            prefix: 'sch',
            iri: "https://schema.org/"
        }
    ];

let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
    baseURL: GRAPHDB_BASE_URL,
    repository: GRAPHDB_REPOSITORY,
    prefixes: DEFAULT_PREFIXES,
    transform: 'toCSV'
});

graphDBEndpoint
    .login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });

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
    graphDBEndpoint
        .query(
            `select *
        where {
            ?class a ont:Song ;
                sch:name ?name ;
                sch:byArtist ?artist ;
                sch:duration ?duration ;
                sch:inAlbum ?album ;
                sch:thumbnailUrl ?thumbnailUrl .
        }`,
            { transform: 'toJSON' }
        )
        .then((result) => {
            db.getPlaylistsByOwnerId(req.session.userID, function (error, playlists) {
                const model = {
                    songs: result.records,
                    playlists: playlists
                }
                res.render('songs.hbs', model)
            })
        })
    .catch((err) => {
        console.log(err);
    });
})

module.exports = router