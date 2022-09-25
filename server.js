const express = require('express');
const app = express();
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortner', {
   useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}))

app.get('/', async (req, res) => {
   const shortUrls = await ShortUrl.find()
   res.render('index', {shortUrls: shortUrls}) 
})

app.post('/shortUrls', async (req, res) => {
   await ShortUrl.create({
      full: req.body.fullUrl,
      short: generateUrl()
   })

   res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
   const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

   if (shortUrl == null) return res.sendStatus(404)
   
   shortUrl.clicks++;
   shortUrl.save();

   res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);

function generateUrl() {
   var rndResult = "";
   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_?";
   var charactersLength = characters.length;

   for (var i = 0; i < 5; i++) {
       rndResult += characters.charAt(
           Math.floor(Math.random() * charactersLength)
       );
   }
   return rndResult
}
