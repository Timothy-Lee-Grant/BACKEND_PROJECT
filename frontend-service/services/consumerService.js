







const axios = require('axios'); 

exports.addItem = async (item)=>{
    try{
        const response = await axios.post('http://consumer-service/remove', {item});
        return response.data.message;
    } catch (error){
        return 'Error adding item';
    }
};