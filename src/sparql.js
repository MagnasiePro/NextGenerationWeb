const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const db = require('./db')
const ParsingClient = require('sparql-http-client/ParsingClient')
const endpointUrl = 'http://dbtune.org/magnatune/sparql/'
const client = new ParsingClient({ endpointUrl })


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

exports.getSongsFromPlaylist = function (playlistID, callback) {
    console.log("Get Playlist: " + playlistID)
    db.getSongsFromPlaylist(playlistID, function (error, songsListID) {
        if (error) {
            console.log(error)
        } else {
            var query = `select * 
    where {
        values ?id {"${songsListID.length == 1 ? songsListID[0].song_id : songsListID.map(e => e.song_id).join('" "')}"}
        ?class a ont:Song ;
            sch:name ?name ;
            sch:identifier ?id;
            sch:byArtist ?artist ;
            sch:datePublished ?date ;
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
            sch:datePublished ?date ;
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

exports.getMoreTrackInfo = async function (title, artist, callback) {
    const query = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dbpedia2: <http://dbpedia.org/property/>
PREFIX dbpedia: <http://dbpedia.org/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX ns1: <http://purl.org/ontology/mo/>
    
SELECT DISTINCT ?instance ?title ?artistName ?date ?sound
WHERE {
    values ?title {"${title}"}
    values ?artistName {"${artist}"}
    ?instance a <http://purl.org/ontology/mo/Track> ;
        dc:title ?title ;
        foaf:maker ?artist ;
        dc:created ?date ;
        ns1:available_as ?sound .
    ?artist foaf:name ?artistName
}
`

    client.query.select(query).then(bindings => {
        callback(bindings, null)
    })
}