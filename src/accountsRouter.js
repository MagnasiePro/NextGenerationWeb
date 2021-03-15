const express = require('express')
const db = require('./db')

const router = express.Router()

router.get('/', function (request, response) {

    db.getAllAccounts(function(error, accounts){
		
		if(error){
            console.log("ERROR: " + error)
		} else {
			const model = {
				accounts: accounts
			}
			response.render("accounts.hbs", model)
		}
	})

})

router.get('/:id', function (request, response) {
     const id = request.params.id

    db.getAccountById(id, function(error, account){
		
		if(error){
            console.log("ERROR: " + error)
		}else{
			const model = {
				account: account
			}
			response.render("account.hbs", model)
		}
	})

})

module.exports = router