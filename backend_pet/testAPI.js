const http = require('http');

http.get('http://127.0.0.1:5000/api/pets', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('API Response:', data.substring(0, 300) + '...'));
}).on('error', err => console.error(err.message));
