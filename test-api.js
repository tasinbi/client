// Simple test to check API connection
const axios = require('axios');

async function testAPI() {
    try {
        console.log('Testing API connection...');
        
        // Test blogs endpoint
        const blogsResponse = await axios.get('http://localhost:5000/api/blogs');
        console.log('Blogs Response Status:', blogsResponse.status);
        console.log('Blogs Response Data:', blogsResponse.data);
        
        // Test categories endpoint
        const categoriesResponse = await axios.get('http://localhost:5000/api/categories');
        console.log('Categories Response Status:', categoriesResponse.status);
        console.log('Categories Response Data:', categoriesResponse.data);
        
    } catch (error) {
        console.error('API Test Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

testAPI();
