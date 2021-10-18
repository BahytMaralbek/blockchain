const axios = require('axios').default;


async function getCategories(){
    try{
        const categories = await axios.get('https://fakestoreapi.com/products/categories')
        return categories.data
    }
    catch{
        console.log('Error is occured, getting categories')
        return []
    }
}

async function getProductsbyCategories(category){
    try{
        const categories = await axios.get(`https://fakestoreapi.com/products/category/${category}`)
        return categories.data
    }
    catch{
        console.log('Error is occured, getting products by cattegory')
        return []
    }
}

async function getProduct(id){
    try{
        const products = await axios.get(`https://fakestoreapi.com/products/${id}`)
        return products.data
    }
    catch{
        console.log('Error is occured, getting products by cattegory')
        return []
    }
}



module.exports = {
    getCategories,
    getProductsbyCategories,
    getProduct
}