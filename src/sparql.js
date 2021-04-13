const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const db = require('./db')

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
    prefixes: DEFAULT_PREFIXES
});

graphDBEndpoint
    .login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });

//TODO
exports.getSongsFromPlaylist = function (playlistID, callback) {
    console.log("Get Playlist: " + playlistID)
    db.getSongsFromPlaylist(playlistID, function (error, songsListID) {
        if (error) {
            console.log(error)
        } else {
            const query = `select * 
    where {
        values ?id { "${songsListID.map(e => e.song_id).join('" "')}" }
        ?class a ont:Song ;
            sch:name ?name ;
            sch:identifier ?id;
            sch:byArtist ?artist ;
            sch:duration ?duration ;
            sch:inAlbum ?album ;
            sch:thumbnailUrl ?thumbnailUrl .
    }`

            graphDBEndpoint
                .query(query, { transform: 'toJSON' })
                .then((result) => {
                    result.records.forEach(element => {
                        var date = new Date(0);
                        date.setMilliseconds(element.duration);
                        element.duration = date.toISOString().substr(11, 8);
                    });
                    callback(null, result.records)
                })
                .catch((err) => {
                    console.log(err)
                    callback(err)
                });
        }
    })
}

exports.getSongs = function (callback) {
    const query = `select * 
    where {
        ?class a ont:Song ;
            sch:name ?name ;
            sch:identifier ?id;
            sch:byArtist ?artist ;
            sch:duration ?duration ;
            sch:inAlbum ?album ;
            sch:thumbnailUrl ?thumbnailUrl .
    }`

    graphDBEndpoint
        .query(query, { transform: 'toJSON' })
        .then((result) => {
            result.records.forEach(element => {
                var date = new Date(0);
                date.setMilliseconds(element.duration);
                element.duration = date.toISOString().substr(11, 8);
            });
            callback(null, result.records)
        })
        .catch((err) => {
            console.log(err)
            callback(err)
        });
}