const sqlite = require('sqlite3')

const db = new sqlite.Database("database.db")

db.run(`CREATE TABLE IF NOT EXISTS accounts(id INTEGER PRIMARY KEY, username TEXT, password INTEGER)`)

db.run(`CREATE TABLE IF NOT EXISTS playlists(id INTEGER PRIMARY KEY, ownerID TEXT, name TEXT, private INTEGER)`)

db.run(`CREATE TABLE IF NOT EXISTS songs(id INTEGER PRIMARY KEY, name TEXT, artist TEXT)`)

db.run(`CREATE TABLE IF NOT EXISTS playlist_songs(playlist_id INTEGER, song_id INTEGER)`)

exports.addMusic = function (name, artist, callback) {
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

exports.addSongToPlaylist = function (idPlaylist, idSong) {
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

exports.createPlaylist = function (ownerID, name, private, callback) {
	const query = "INSERT INTO playlists (owner, name, private) VALUES (?, ?, ?)"
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

exports.getPlaylists = function (callback) {
	const query = "SELECT * FROM playlists"

	db.all(query, function (error, playlists) {
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

exports.deleteAccountById = function (accountId, callback) {

	const query = "DELETE FROM accounts WHERE id = ?"
	const values = [accountId]

	db.run(query, values, function (error) {

		if (error) {
			callback("Database error.")
		} else {
			// Can use this.changes to see how many rows that were deleted.
			callback(null)
		}
	})

}

exports.updateAccountById = function (newUsername, newPassword, accountId, callback) {

	const query = "UPDATE accounts SET username = ?, password = ? WHERE id = ?"
	const values = [newUsername, newPassword, accountId]

	db.run(query, values, function (error) {

		if (error) {
			callback("Database error.")
		} else {
			// Can use this.changes to see how many rows that were updated.
			callback(null)
		}

	})
}