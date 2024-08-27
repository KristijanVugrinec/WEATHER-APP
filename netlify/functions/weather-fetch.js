const axios = require('axios')

exports.handler = async (event) => {
    const apiKey = process.env.VITE_API_KEY
    const city = event.queryStringParameters.city || 'London';


    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`
        );
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };

    }   catch (error){
        return {
            statusCode:error.response ? error.response.status : 500,
            body:JSON.stringify({message:error.message})
        };
    }

};