const userId = '698ef7026ff87b8fac9077dc'; // User ID from previous check
const url = `http://localhost:5000/api/users/${userId}`;

console.log(`Fetching from: ${url}`);

fetch(url)
    .then(res => {
        console.log(`Status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log('Response:', data);
    })
    .catch(err => console.error('Error:', err));
