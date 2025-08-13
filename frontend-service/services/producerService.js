







const axios = require('axios'); //what is this?

exports.addItem = async (item)=>{
    try{
        const response = await axios.post('http://producer-service/add', {item});
        return response.data.message;
    } catch (error){
        return 'Error adding item';
    }
};