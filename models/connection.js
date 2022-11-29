
var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
   }
   mongoose.connect('mongodb+srv://bertin:96321478a@cluster0.yuajqkj.mongodb.net/meteo?retryWrites=true&w=majority', options,        
    function(err) {
      console.log(err);
    }
   );

   module.exports = mongoose