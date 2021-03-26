const sqlite = require('sqlite3')

const db = new sqlite.Database("database.db")

db.run(`CREATE TABLE IF NOT EXISTS accounts(id INTEGER PRIMARY KEY, username TEXT, password TEXT)`)

db.run(`CREATE TABLE IF NOT EXISTS playlists(id INTEGER PRIMARY KEY, ownerID INTEGER, name TEXT, private INTEGER)`)

db.run(`CREATE TABLE IF NOT EXISTS songs(id INTEGER PRIMARY KEY, Arists_Name VARCHAR(56) NOT NULL, Track_Name VARCHAR(55) NOT NULL, Album_Name VARCHAR(86) NOT NULL, Length VARCHAR(16) NOT NULL)`)

db.run(`CREATE TABLE IF NOT EXISTS playlist_songs(playlist_id INTEGER, song_id INTEGER)`)

exports.addSong = function (name, artist, callback) {
	const query = "INSERT INTO songs (name, artist) VALUES (?, ?)"
	const values = [name, artist]

	db.run(query, values, function (error) {
		if (error) {
			callback(error)
		} else {
			console.log("Add new song: " + name + " - " + artist + " | id: " + this.lastID)
			callback(null, this.lastID)
		}
	})
}

exports.addSongToPlaylist = function (idPlaylist, idSong, callback) {
	const query = "INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)"
	const values = [idPlaylist, idSong]

	db.run(query, values, function (error) {
		if (error) {
			callback(error)
		} else {
			callback(null)
		}
	})
}

exports.removeSongToPlaylist = function (idPlaylist, idSong, callback) {
	const query = "DELETE FROM playlist_songs WHERE (playlist_id, song_id) = (?, ?)"
	const values = [idPlaylist, idSong]

	db.run(query, values, function (error) {
		if (error) {
			callback(error)
		} else {
			callback(null)
		}
	})
}

exports.getPlaylistsById = function (idPlaylist, callback) {
	const query = "SELECT * FROM playlists WHERE id = ?"

	db.get(query, idPlaylist, function (error, playlist) {
		if (error) {
			console.log(error)
		} else {
			callback(null, playlist)
		}
	})
}

exports.getPlaylistsByOwnerId = function (OwnerID, callback) {
	const query = "SELECT playlists.id, playlists.ownerID, playlists.name, playlists.private, accounts.username FROM playlists INNER JOIN accounts ON playlists.ownerID = accounts.id WHERE playlists.ownerID = ?"

	db.all(query, OwnerID, function (error, playlists) {
		if (error) {
			console.log(error)
		} else {
			callback(null, playlists)
		}
	})
}

exports.getPublicPlaylistsByOwnerId = function (OwnerID, callback) {
	const query = "SELECT * FROM playlists WHERE ownerID = ? AND private = 0"

	db.all(query, OwnerID, function (error, playlists) {
		if (error) {
			console.log(error)
		} else {
			callback(null, playlists)
		}
	})
}

exports.getSongsFromPlaylist = function (idPlaylist, callback) {
	const query = "SELECT * FROM songs INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_id = ?"

	db.all(query, idPlaylist, function (error, songsList) {
		if (error) {
			callback(error)
		} else {
			callback(null, songsList)
		}
	})
}

exports.createPlaylist = function (ownerID, name, private, callback) {
	const query = "INSERT INTO playlists (ownerID, name, private) VALUES (?, ?, ?)"
	const values = [ownerID, name, private]

	db.run(query, values, function (error) {
		if (error) {
			callback(error)
		} else {
			console.log("Create new playlist: " + name + " " + ownerID + " " + private + " " + this.lastID)
			callback(null, this.lastID)
		}
	})
}

exports.removePlaylist = function (id, callback) {
	const queryPlaylist = "DELETE FROM playlists WHERE id = ?"
	const querySongsPlaylist = "DELETE FROM playlist_songs WHERE playlist_id = ?"
	const value = id

	db.all(queryPlaylist, value, function(error) {
		if (error) {
			callback(error)
		} else {
			db.all(querySongsPlaylist, value, function(error) {
				if (error) {
					callback(error)
				} else {
					callback(null)
				}
			})
		}
	})
}

exports.updatePlaylistStatus = function (id, newStatus, callback) {
	const query = "UPDATE playlists SET private = ? WHERE id = ?"
	const values = [newStatus, id]

	db.run(query, values,function (error) {
		if (error) {
			callback(error)
		} else {
			callback(null)
		}
	})
}

exports.getSongs = function (callback) {
	const query = "SELECT * FROM songs"

	db.all(query, function (error, songs) {
		if (error) {
			callback(error)
		} else {
			callback(null, songs)
		}
	})
}

exports.getPlaylists = function (userID, callback) {
	const query = "SELECT playlists.id, playlists.ownerID, playlists.name, playlists.private, accounts.username FROM playlists INNER JOIN accounts ON playlists.ownerID = accounts.id WHERE private = 0 OR ownerID = ?"
	const value = userID

	db.all(query, value, function (error, playlists) {
		if (error) {
			callback(error)
		} else {
			callback(null, playlists)
		}
	})
}

exports.createAccount = function (username, password, callback) {
	const query = "INSERT INTO accounts (username, password) VALUES (?, ?)"
	const values = [username, password]

	db.run(query, values, function (error) {
		if (error) {
			callback(error)
		} else {
			console.log("Create new user with:" + username + " " + password + " " + this.lastID)
			callback(null, this.lastID)
		}
	})
}

exports.loginAccount = function (username, callback) {

	const query = "SELECT * FROM accounts WHERE username = ?"
	const values = [username]

	db.get(query, values, function (error, account) {
		if (error) {
			callback("Database error.")
		} else {
			callback(null, account)
		}
	})
}

exports.getAccountById = function (accountId, callback) {

	const query = "SELECT * FROM accounts WHERE id = ?"
	const values = [accountId]

	db.get(query, values, function (error, account) {

		if (error) {
			callback("Database error.")
		} else {
			callback(null, account)
		}

	})
}

exports.checkAccountByUsername = function (username, callback) {
	const query = "SELECT * FROM accounts WHERE username = ? LIMIT 1"
	const values = [username]

	db.get(query, values, function (error, account) {

		if (error) {
			callback("Database error.")
		} else {
			callback(null, account)
		}
	})
}

exports.getAllAccounts = function (callback) {

	const query = "SELECT * FROM accounts ORDER BY username"
	const values = []

	db.all(query, values, function (error, accounts) {
		if (error) {
			callback("Database error.")
		} else {
			callback(null, accounts)
		}
	})

}
