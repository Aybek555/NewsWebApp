const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
const mongoose = require('mongoose')
const port = 7000;


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'))
app.set('view engine', 'ejs')


mongoose.connect("mongodb://localhost:27017/news", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//structure
const newsSchema = new mongoose.Schema({
  title: String,
  description: String,
  urlToImage: String,
  publishedAt: String
})
const News = mongoose.model('News', newsSchema);


app.get("/", async (req, res) => {
  const api = "92fe5aacbf094d75a7e76da14082e17c";
  const url = "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=" + api;
  const weatherapi = "f4055eb5314a89d4200624e663b91c0d";
  const weatherurl = "https://api.openweathermap.org/data/2.5/weather?q=Nur-Sultan&appid=" + weatherapi + "&units=metric";
  try {
    const news = await axios.get(url);
    var articles = news.data.articles;
    const weather = await axios.get(weatherurl);
    var weatherData = weather.data;
    var weatherSRC = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    News.find({}, function(err, news) {
      res.render("index", {
        city: weatherData.name,
        country: weatherData.sys.country,
        desc: weatherData.weather[0].description,
        temp: weatherData.main.temp,
        mintemp: weatherData.main.temp_min,
        maxtemp: weatherData.main.temp_max,
        wind: weatherData.wind.speed,
        weatherpng: weatherSRC,
        articles: articles,
        mongoarticles: news
      })
    })
  } catch (e) {
    if (e.response) {
      console.log(e.response.data)
      console.log(e.response.status)
      console.log(e.response.headers)
    } else if (e.reqiuest) {
      console.log(e.reqiuest)
    } else {
      console.error('Error', e.message);
    }
  }
})



app.post("/", async (req, res) => {
  const api = "92fe5aacbf094d75a7e76da14082e17c";
  var search = req.body.searchbox;
  var url;
  if (search == null) {
    url = "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=" + api;
  } else {
    url = 'https://newsapi.org/v2/everything?q=' + search + '&from=2021-06-20&sortBy=popularity&apiKey=' + api;
  }
  var city = req.body.citySearch;
  if (city == null) {
    city = "Nur-Sultan";
  } else {
    city = req.body.citySearch;
  }
  const weatherapi = "f4055eb5314a89d4200624e663b91c0d";
  const weatherurl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + weatherapi + "&units=metric";
  try {
    const news = await axios.get(url);
    var articles = news.data.articles;
    const weather = await axios.get(weatherurl);
    var weatherData = weather.data;
    var weatherSRC = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    if (search == null) {
      News.find({}, function(err, news) {
        res.render("index", {
          city: city,
          country: weatherData.sys.country,
          desc: weatherData.weather[0].description,
          temp: weatherData.main.temp,
          mintemp: weatherData.main.temp_min,
          maxtemp: weatherData.main.temp_max,
          wind: weatherData.wind.speed,
          weatherpng: weatherSRC,
          articles: articles,
          mongoarticles: news
        })
      })
    } else {
      News.find({
        title: search
      }, function(err, news) {
        res.render("index", {
          city: city,
          country: weatherData.sys.country,
          desc: weatherData.weather[0].description,
          temp: weatherData.main.temp,
          mintemp: weatherData.main.temp_min,
          maxtemp: weatherData.main.temp_max,
          wind: weatherData.wind.speed,
          weatherpng: weatherSRC,
          articles: articles,
          mongoarticles: news
        })
      })
    }
  } catch (e) {
    if (e.response) {
      console.log(e.response.data)
      console.log(e.response.status)
      console.log(e.response.headers)
    } else if (e.reqiuest) {
      console.log(e.reqiuest)
    } else {
      console.error('Error', e.message);
    }
  }
})


app.get("/addnews", async (req, res) => {
  res.render("addnews")
})
app.post("/addnews", function(req, res) {
  const newNews = new News({
    title: req.body.title,
    description: req.body.description,
    urlToImage: req.body.image,
    publishedAt: Date.now()
  })
  newNews.save();
  res.redirect("addnews")
})


app.post("/article", async (req, res) => {
  var info = req.body.button;
  News.find({
    _id: info
  }, function(err, foundItem) {
    res.render("article", {
      news: foundItem[0]
    })
  })
})

app.post("/delete", function(req, res) {
  var id = req.body.delete_article;
  News.deleteOne({
    _id: id
  }, function() {
    res.redirect("/")
  })

})

app.post("/update", async (req, res) => {
  await News.updateOne({
    _id: req.body.save_changes
  }, {
    title: req.body.title,
    urlToImage: req.body.imgLink,
    description: req.body.description,
    publishedAt: Date.now()
  })
  res.redirect("/")
})




//Listening port
app.listen(port, function() {
  console.log("Go to localhost:" + port);
})
