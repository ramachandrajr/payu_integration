const express = require("express"),
	  app = express(),
	  crypto = require("crypto"),
	  request = require("request"),
	  bodyParser = require("body-parser");

/**
 * APP SETTINGS
 * ==========
 */
app.use(bodyParser.urlencoded({ extended: false }));


/**
 * Data essentials.  
 * ==========
 */ 
var key = process.env.PAYU_KEY || "fB7m8s",
  	txnid = randString(32),
  	// Set the testing environment variable to false if you are not testing.
  	testEnv = process.env.TESTING || true;




/**
 * FUNCTIONS
 * ==========
 */

/**
 * Creates a random string of given length.
 * 
 * @params len {Number} Length of the resulting random string.
 * @returns r {String} A random string of given length.
 */
function randString(len) {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var r = "";
	for (var i = 0; i < (len + 1); i++) {
		r += chars[Math.floor(Math.random() * chars.length)];
	}
	return r;
};

/**
 * Creates a hash out of the data.
 *
 * @param key {String} Merchant key.
 * @param txn {String} Random Txn id generated by us.
 * @param a {String} Amount to bill.
 * @param fname {Sring} Firstname of the customer.
 * @param em {String} Email Address of the customer.
 * @param ph {String} Phone.
 * @returns {Promise} Internal promise.
 */
var createHash = (function(key, txn, a, fname, em, ph) {
    var hash = crypto.createHash("sha512");
	var promise = new Promise(function(resolve, reject) {
		hash.on("readable", function() {
			var createdHash = hash.read();
			if (createdHash !== "") resolve({
			 	key: key,
				hash: createdHash.toString("hex").toLowerCase(),			 	
			 	txnid: txn,
			 	amount: a,
			 	firstname: fname,
			 	email: em,
			 	phone: ph
			 });
		});			

		hash.write( key + "|" + txn + "|" + a + "|" + "None" + "|" + fname + "|" + em + "|||||||||||" + (process.env.PAYU_SALT || "eRis5Chv") );
		hash.end();
	});
	return promise;
}).bind(null, key, txnid);



/**
 * ROUTES
 * =========
 */

// CHECKOUT FORM ROUTE
app.post("/checkout", function(req, res) {
	app.locals.a = req.body.amount;
	res.render("form.ejs", {amount: app.locals.a});
});

// PAYMENTS ROUTE
app.post("/payment", function(req, res) {	
	// Get data from the body.
	var fname = req.body.firstname,
		em = req.body.email,
		ph = req.body.phone;

	// Pass hash a, fname, em, ph to create hash.
	createHash(app.locals.a, fname, em, ph).then(function(obj) {				
		console.log(JSON.stringify(obj));
		// Add to object.
		obj.productinfo = "None";
		obj.service_provider = "payu_paisa";
		obj.surl = "http://www.facebook.com/success.html";
		obj.furl = "http://www.facebook.com/failure.html";

		// Post to payment site.
		request.post({ url: (testEnv ? "https://test.payu.in/_payment" : "https://secure.payu.in/_payment"), form: obj }, function(err, httpRes, body) {
			if (err) res.send(err);
			if (httpRes.statusCode == 200) {
				res.send(body);
			} else if (httpRes.statusCode >= 300 && httpRes.statusCode <= 400) {
				// res.writeHead(302, httpRes.headers);
				// res.end();
				res.redirect(httpRes.headers.location.toString());
			}
		});

	});	
});

// CATCH ALL
app.get("*", function(req, res) {
	res.send("404 Not found!");
});

// Keep Listening.
app.listen(1337, function() {
	console.log("Listening at http://localhost:1337");
});
