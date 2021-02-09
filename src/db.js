const sqlite = require('sqlite3')

const db = new sqlite.Database("database.db")

db.run(`CREATE TABLE IF NOT EXISTS accounts(
	id INTEGER PRIMARY KEY,
	username TEXT,
	password INTEGER
)`)

exports.createAccount = function(username, password, callback){
	
	const query = "INSERT INTO accounts (username, password) VALUES (?, ?)"
	const values = [username, password]
	
	db.run(query, values, function(error){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, this.lastID)
			console.log("Create new user with:" + username + " " + password + " " + this.lastID)
		}
		
	})
	
}

exports.getAccountById = function(accountId, callback){
	
	const query = "SELECT * FROM accounts WHERE id = ?"
	const values = [accountId]
	
	db.get(query, values, function(error, account){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, account)
		}
		
	})
	
}

exports.getAllAccounts = function(callback){
	
	const query = "SELECT * FROM accounts ORDER BY username"
	const values = []
	
	db.all(query, values, function(error, accounts){
		if(error){
			callback("Database error.")
		}else{
			callback(null, accounts)
		}
	})
	
}

exports.deleteAccountById = function(accountId, callback){
	
	const query = "DELETE FROM accounts WHERE id = ?"
	const values = [accountId]
	
	db.run(query, values, function(error){
		
		if(error){
			callback("Database error.")
		}else{
			// Can use this.changes to see how many rows that were deleted.
			callback(null)
		}
	})
	
}

exports.updateAccountById = function(newUsername, newPassword, accountId, callback){
	
	const query = "UPDATE accounts SET username = ?, password = ? WHERE id = ?"
	const values = [newUsername, newPassword, accountId]
	
	db.run(query, values, function(error){
		
		if(error){
			callback("Database error.")
		}else{
			// Can use this.changes to see how many rows that were updated.
			callback(null)
		}
		
	})
	
}