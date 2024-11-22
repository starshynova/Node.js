/**
 * Exercise 3: Create an HTTP web server
 */

import http from 'http';
import fs from 'fs';
import path from 'path';

let server = http.createServer(function (req, res) {
	
	if (req.url === '/') {
		const filePath = path.join(process.cwd(), 'index.html');
		fs.readFile(filePath, 'utf-8', (err, data) => {
			if (err) {
				throw err
			} else {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(data);
		}
	});
} else if (req.url === '/index.js') {
		const filePath = path.join(process.cwd(), 'index.js');
		fs.readFile(filePath, 'utf-8', (err, data) => {
			if (err) {
				throw err 
			} else {
			res.writeHead(200, { 'Content-Type': 'application/javascript' });
			res.end(data);
	}
	});	

	};
	
});

server.listen(3000); 