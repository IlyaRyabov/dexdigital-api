const http = require('http');
const url = require('url');
const Pool = require('pg').Pool;
const pool = new Pool({
	user: 'dexdigital',
	host: 'localhost',
	database: 'api',
	password: 'password',
	port: 5432,
});

http.createServer((request, response) => {

	response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://test.com'});

	const requestUrl = url.parse(request.url, true);
	const requestUrlId = request.url;
	const id = requestUrlId.replace(/[^0-9]/g, '');

	if (requestUrl.pathname === `/users` && request.method === 'POST') {
		createUser(request, response)
	} else if (requestUrl.pathname === `/users` && request.method === 'GET') {
		getUsers(request, response);
	} else if (requestUrl.pathname === `/users/${id}` && request.method === 'GET') {
		getUserById(request, response, id)
	} else if (requestUrl.pathname === `/users/${id}` && request.method === 'DELETE') {
		deleteUser(request, response, id)
	} else {
		getUsers(request, response);
	}

}).listen(3000,() => {
	console.log("server start at port 3000");
});

const createUser = (request, response) => {
	const { email, password } = request.body;
	pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password], (error, results) => {
		if (error) {
			throw error
		}
		const json = JSON.stringify(results.insertId);
		response.end(json);
	})
};

const getUsers = (request, response) => {
	pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
		if (error) {
			throw error
		}
		const json = JSON.stringify(results.rows);
		response.end(json);
	})
};

const getUserById = (request, response, id) => {
	pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		const json = JSON.stringify(results.rows);
		response.end(json);
	})
};

const deleteUser = (request, response, id) => {
	pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		const json = JSON.stringify(results.rows);
		response.end(json);
	})
};
