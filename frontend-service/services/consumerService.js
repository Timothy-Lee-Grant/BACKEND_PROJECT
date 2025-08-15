







const axios = require('axios'); 

exports.addItem = async (item)=>{
    try{
        const response = await axios.post('http://localhost:4000/inventory/add', { item });
        return response.data.message;
    } catch (error){
        return 'Error adding item';
    }
};