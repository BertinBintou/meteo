var express = require('express');
var router = express.Router();
var request = require('sync-request');

var cityModel =  require('../models/cities');

var userModel =  require('../models/users');


const citylist = [
  // {name:"Paris", desc:"couvert",temp_min:10, temp_max:20},
  // {name:"Lyon", desc:"enseoleillé",temp_min:20, temp_max:30},
  // {name:"Angers", desc:"mi-couvert",temp_min:15, temp_max:20},
  // {name:"Nantes", desc:"pluie",temp_min:10, temp_max:20},
]

/* GET home page. */
router.get('/',  async function(req, res, next) {




var citylist = await cityModel.find();


  res.render('carte',{  citylist});
});

/* deconnection */
router.get('/login', function(req, res, next) {
  res.render('login');
});


/* add city */
router.post('/add-city', async function(req, res, next){


  const name =req.body.newcity; 
  var data = request("GET",`https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&units=metric&lang=fr&appid=d7bd66655db9ce3167bc0a6199c9b539`);
  var dataAPI = JSON.parse(data.body);
  
  // var citylist = await cityModel.find();

  var alreadyExist = await cityModel.findOne({
    name:req.body.newcity.toLowerCase()
  });

if(alreadyExist == null &&  dataAPI.name ) {
  var newCity = new cityModel({  name:req.body.newcity,
    desc: dataAPI.weather[0].description,
    temp_min: dataAPI.main.temp_min,
    temp_max: dataAPI.main.temp_max
  })
            
    await newCity.save();
  }

  var citylist = await cityModel.find();



  res.render('carte', {citylist});
});





/* supprimer */
router.get('/delet-city', async function(req, res, next) {

  await cityModel.deleteOne({_id : req.query.id})

  var citylist = await cityModel.find();

  res.render('carte',{ citylist: citylist });
});


/* inscription sign-up */

router.post('/sign-up', async function(req, res, next){

  var newUser = new userModel({
    username : req.body.usernameFront,
    email : req.body.emailFront,
    password : req.body.passwordFront,
  })
console.log(newUser)
  await newUser.save();

res.redirect('/')
});


router.post('/sign-in', async function(req, res, next){

  var searchUser = await userModel.findOne({
    email : req.body.emailFront,
    password : req.body.passwordFront,
})

if (searchUser!= null){
  res.redirect('/')
} else {
  res.render('login')
}



});


router.get('/reset', async function(req, res, next) {

  var deletall =  await cityModel.deleteMany();
console.log(deletall)
res.render('carte',{ citylist: citylist });

});



module.exports = router;
