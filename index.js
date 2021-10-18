require('dotenv').config();
const express = require('express')
const path  = require('path')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { getRows, writeRows } = require('./util/db');
const { getCategories, getProductsbyCategories, getProduct } = require('./util/api');

// const __dirname = path.resolve()
const app = express()
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'ejs'));

app.use(express.static(path.resolve(__dirname, 'ejs/static')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.get('/', async function(req,res) {
    const categories = await getCategories() || []
    console.log('Here', categories)
    res.render('index', {categories: categories})
});

app.get('/order', async function(req,res) {
    const categories = await getCategories() || []
    res.render('view', {categories: categories, data: req.body})
});

app.post('/order', async function(req,res) {
    console.log(req.body)
    let phone = req.cookies.PHONE ? req.body.phone = req.cookies.PHONE : undefined
    console.log(phone)
    const categories = await getCategories() || []
    res.render('order', {categories: categories, data: req.body})
});

app.post('/status', async function(req,res) {
    const {id, box, range, weight, start, end, user, phone, image, title} = req.body
    let timestamp = new Date().valueOf()
    let array = [timestamp, id, box, range, weight, start, end, user, phone, image, title]
    await writeRows(array)
    const categories = await getCategories() || []
    res.cookie('PHONE', phone)
    let data = {'phone': phone, 'timestamp': timestamp, 'user': user}
    res.render('status', {categories: categories, data: data})
});

app.get('/category', async function(req,res) {
    const category = req.query.category
    const categories = await getCategories() || []
    const data = await getProductsbyCategories(category)
    res.render('category', {data: data, categories: categories})
});

app.get('/orders', async function(req,res) {
    const categories = await getCategories() || []
    const ordersSheet = await getRows()
    let phone = req.cookies.PHONE ? req.cookies.PHONE.slice(1) : undefined
    console.log(phone)
    // console.log(ordersSheet.data.values)
    const orders = ordersSheet.data.values.filter(obj => obj[8] === phone)
    console.log('Filtered orders: ', orders)
    const object = orders.map(obj => { return {
        id: obj[1],
        box: obj[2],
        weight: obj[4],
        start: obj[5],
        end: obj[6],
        title: obj[7],
        phone: obj[8],
        image: obj[9],
        title: obj[10],
        timestamp: obj[0]
    } })
    console.log(object)
    res.render('orders', {data: object, categories: categories})
});

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
})