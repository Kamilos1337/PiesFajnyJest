const express = require("express");
const os = require("os");
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var validator = require("email-validator");
var mysql = require('mysql');
var readBlob = require('read-blob');
var fs = require('fs');
const blobToBase64 = require('blob-to-base64')
var randomstring = require("randomstring");
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const rateLimit = require("express-rate-limit");

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const WallAddLimiter = rateLimit({
  windowMs: 60 * 1000 * 10, // 10 minut
  max: 5, // start blocking after 5 requests
});

const AddPostLimit = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 5, // start blocking after 5 requests
});

const ChangePassword = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 5, // start blocking after 5 requests
});

const RemovePassword = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 5, // start blocking after 5 requests
});

const ChangePreferences = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 5, // start blocking after 5 requests
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'pies'
});

connection.connect();

var Register = function(name, email, password, password2, dateTime) {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/
    bcrypt.hash(password, 10, function(err, hash) {
      var sql = 'SELECT COUNT(*) AS checkEmail FROM users WHERE email = "'+email+'"'
      connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        var checkEmail = results[0].checkEmail;
        if(checkEmail>0){
          resolve("Podany email jest zajęty!")
        }else{
          var sql = 'INSERT INTO users (name,  password, email, created_at) VALUES ("'+name+'", "'+hash+'", "'+email+'", "'+dateTime+'") '
          connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            resolve("Rejestracja się udała!")
          });
        }
      });
});



  });
}

var Login = function(email, password) {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/
    connection.query("SELECT * FROM users WHERE email = ?",
    [
      email
    ],
    function (error, results, fields) {
      if (error) throw error;

      if(results.length>0){
        var db_pass = results[0].password;
        bcrypt.compare(password, db_pass, function(err, res) {
          if(res) {
           resolve({Login:"Użytkownik zalogowany!", Password:results[0].password, Name:results[0].name, Email:results[0].email})
          } else {
           resolve("Podane hasło jest niepoprawne!")
          }
        });
      }else{
        resolve("Podany email nie istnieje!")
      }
    });
  });
}

var getProfile = function(email, passUSER) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM users WHERE email = ? and password = ?",
    [
      email,
      passUSER
    ],
    function (error, results, fields) {
      if (error) throw error;

      if(results.length>0){
           resolve({Info:"success", Name:results[0].name, Email:results[0].email, Created_At: results[0].created_at, ads:results[0].ads})
          } else {
           resolve({Info:"Zaloguj się!"})
          }
    });
  });
}

var savePreferences = function(email, passUSER, ads) {
  return new Promise(function(resolve, reject) {
    connection.query("UPDATE users SET ads=? WHERE email=? and password=?",
    [
      ads,
      email,
      passUSER
    ],
    function (error, results, fields) {
      if (error) throw error;
      if(results){
           resolve({Info:"success"})
          } else {
           resolve({Info:"error"})
          }
    });
  });
}

var changePassword = function(pass1New, pass2New, oldPass1, userEmail) {
    return new Promise(function(resolve, reject) {
      connection.query("SELECT * FROM users WHERE email = ?",
      [
        userEmail,
      ],
      function (error, results, fields) {
        if (error) throw error;
        if(results.length>0){
          var db_pass = results[0].password;
          bcrypt.compare(oldPass1, db_pass, function(err, res) {
            if(res) {
              bcrypt.hash(pass1New, 10, function(err, hash) {
                connection.query("UPDATE users SET password=? WHERE email = ?",
                [
                  hash,
                  userEmail
                ],
                function (error, results, fields) {
                  if (error) throw error;
                  console.log(results);
                  if(results){
                    resolve({Info:"Haslo zmienione!", Pass:hash})
                  }else{
                    resolve({Info:"Nie udalo sie zmienic hasla!"})
                  }
                });
                });
            } else {
             resolve({Info:"Podane hasło jest niepoprawne!"})
            }
          });
        }else{
          console.log("Problem here");
        }
      });
    });


}

var removeAccount = function(userEmail, oldPass) {
  console.log(oldPass);
    return new Promise(function(resolve, reject) {
      connection.query("SELECT * FROM users WHERE email = ?",
      [
        userEmail,
      ],
      function (error, results, fields) {
        if (error) throw error;
        if(results.length>0){
          var db_pass = results[0].password;
          bcrypt.compare(oldPass, db_pass, function(err, res) {
            if(res) {
                connection.query("DELETE FROM users WHERE email=?;",
                [
                  userEmail
                ],
                function (error, results, fields) {
                  if (error) throw error;
                  if(results){
                    resolve({Info:"Konto usunięte!"})
                  }else{
                    resolve({Info:"Nie udało się usunąć konta"})
                  }
                });
            } else {
             resolve({Info:"Podane hasło jest niepoprawne!"})
            }
          });
        }else{
          console.log("Problem here");
        }
      });
    });


}


var ShowPost = function(postPath) {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/

    var sql = 'SELECT * FROM posts WHERE link = "'+postPath+'"'
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;

      if(results.length==1){
        var postTitle = results[0].title;
        var postCategory = results[0].category;
        var postVoivodeship = results[0].voivodeship;
        var postEmail = results[0].email;
        var postPhoto =  Buffer.from( results[0].photo, 'binary' ).toString();
        var postDescription = Buffer.from( results[0].description, 'binary' ).toString();
        var postUserLogin = results[0].userLogin;
        var postUserEmail = results[0].userEmail;
        var postLink = results[0].link;
        var postCreatedAt = results[0].created_at;

        postTitle = entities.decode(postTitle)
        postUserEmail = entities.decode(postUserEmail)
        postDescription = entities.decode(postDescription)


        resolve({Error:"", postTitle:postTitle, postCategory:postCategory, postVoivodeship:postVoivodeship, postEmail:postEmail, postPhoto:postPhoto, postDescription:postDescription, postUserLogin:postUserLogin, postUserEmail:postUserEmail, postLink:postLink, postCreatedAt:postCreatedAt })

      }else{
        resolve({Error:"Post nie istnieje lub został usunięty."})
      }
    });
  });
}


var RandomPost = function() {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/

    var sql = 'SELECT title, link, photo FROM posts ORDER BY RAND() LIMIT 1'
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;

      if(results.length==1){
        var RandomTitle = results[0].title;
        var RandomLink = results[0].link;
        var RandomPhoto = results[0].photo;
        resolve({RandomTitle:RandomTitle, RandomLink: RandomLink, RandomPhoto:RandomPhoto})
      }else{
        resolve({Error:"Nie udało się znaleźć losowego posta."})
      }
    });
  });
}

var AddPost = function(title, category, email, photo, date, description, voivodeship, userLogin, userEmail, randomLink) {
  return new Promise(function(resolve, reject) {
    var sql = 'INSERT into posts (title, category, voivodeship, email, photo, description, userLogin, userEmail, link, created_at) VALUES ("'+title+'", "'+category+'", "'+voivodeship+'", "'+email+'", "'+photo+'", "'+description+'", "'+userLogin+'", "'+userEmail+'", "'+randomLink+'", "'+date+'")'
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;
    });
  });
}

var AddToWall = function(photo, userLogin, userEmail, Date) {
  return new Promise(function(resolve, reject) {
    var sql = 'INSERT into dogsphotos (photo, user_login, user_email, created_at) VALUES ("'+photo+'", "'+userLogin+'", "'+userEmail+'", "'+Date+'")'
    connection.query(sql, function (error, results, fields) {
      if(results) resolve({Error:"Wall photo added"});
      if (error) {
        throw error;
        resolve({Error:"Wall photo error"});
      }
    });
  });
}

var mainPosts = function() {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/

    var sql = 'SELECT * FROM posts'
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;

      if(results.length>0){
           resolve({Posts: results})
      }else{
        resolve("Brak postów")
      }
    });
  });
}

app.use(express.json());

app.post('/api/addPost', AddPostLimit, function(req, res) {
  var title = req.body.title;
  var category = req.body.category;
  var email = req.body.email;
  var photo = req.body.photo;
  var date = req.body.dateTime
  var description = req.body.description;
  var voivodeship = req.body.voivodeship;
  var userLogin = req.body.userLogin;
  var userEmail = req.body.userEmail;
  var randomLink = randomstring.generate(7);
  var ValidateEmail = validator.validate(email); // true
  var Stop = 0;
  var CheckImages = description.indexOf("<img", +1);

  if(title.length<6){
    res.send({Error:"Za krótki tytuł"});
    Stop=1;
    return;
  }
  if(title.length>80){
    res.send({Error:"Za długi tytuł"});
    Stop=1;
    return;
  }
  if(title.length>120){
    res.send({Error:"Za długi tytuł"});
    Stop=1;
    return;
  }

  if(ValidateEmail===false){
    res.send({Error:"Nieprawidłowy email"})
    Stop=1;
    return;
  }

  console.log("DL "+description.length);
  if(description.length<100){
    res.send({Error:"Za krótki opis"})
    Stop=1;
    return;
  }


if(Stop==0){
  description = entities.encode(description)
  title = entities.encode(title)
  email = entities.encode(email)
  res.send({Error:"Post added!"})
  AddPost(title, category, email, photo, date, description, voivodeship, userLogin, userEmail, randomLink).then(function(data) {
    console.log("Trying to add post")

  })
}

});

app.post('/api/facebookCounts', function(req, res){
      axios.get('https://graph.facebook.com/v3.0/', {
        params: {
          fields: 'engagement', access_token: '2538790922867434|6de1a081df3c992e2c53a5c276f43f5e', id: req.Link
        }
      }).then((response) => {
        res.send({FacebookCounts:response.data.engagement.share_count})

      })
      .catch(error => {
      console.log("Nie można wyświetlić ilości udostępnień: "+req.body.Link)
      });
});

app.post('/api/changePassword', ChangePassword, function(req, res){
  changePassword(req.body.newPass1, req.body.newPass2, req.body.oldPass1, req.body.userEmail).then(function(data) {
    if(data.Info=="Haslo zmienione!"){
      res.send(data);
    }
    if(data.Info=="Podane hasło jest niepoprawne!"){
      res.send(data);
    }

  })
});

app.post('/api/removeAccount', RemovePassword, function(req, res){
  removeAccount(req.body.userEmail, req.body.removeAccount).then(function(data) {
    if(data.Info=="Konto usunięte!"){
      res.send(data);
    }
    if(data.Info=="Podane hasło jest niepoprawne!"){
      res.send(data);
    }
    if(data.Info=="Nie udało się usunąć konta!")
      res.send(data);
  })
});

app.post('/api/getProfile', function(req, res){
  getProfile(req.body.userEmail, req.body.userPass).then(function(data) {
    if(data.Info=="success"){
      res.send(data);
    }else{
      res.send({Info:"Zaloguj się!"});
    }
  })
});

app.post('/api/savePreferences', ChangePreferences, function(req, res){
  savePreferences(req.body.userEmail, req.body.userPass, req.body.userAds).then(function(data) {
    if(data.Info=="success"){
      res.send(data);
    }else{
      res.send({Info:"error"});
    }
  })
});

app.post('/api/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  Login(email, password).then(function(data) {

    if(data.Login=="Użytkownik zalogowany!"){
      res.send({Login:"Użytkownik zalogowany!", Password:data.Password, Name:data.Name, Email:data.Email});
    }else{
      res.send({Login:"Podane dane są nieprawidłowe!"});
      console.log("User created");
    }
  })
});




app.post('/api/AddToWall', WallAddLimiter, function(req, res) {
    console.log("ASD");
  var photo = req.body.photo;
  var userLogin = req.body.userLogin;
  var userEmail = req.body.userEmail;
  var Date = req.body.Date;
  AddToWall(photo, userLogin, userEmail, Date).then(function(data) {
    if(data.Error=="Wall photo added"){
      res.send({Error:"Wall photo added"})
    }else{
      res.send({Error:"Wall photo error"})
    }
  })
});

var displayWall = function() {
  return new Promise(function(resolve, reject) {
    var sql = 'SELECT * FROM dogsphotos ORDER BY id DESC LIMIT 20'
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;

      if(results.length>0){
        var MainPageImages = [];
        for (let pw=0; pw<results.length; pw++){
          var PhotoText =  Buffer.from( results[pw].photo, 'binary' ).toString();

          MainPageImages.push({src:PhotoText, user_login:results[pw].user_login, user_email:results[pw].user_email, created_at:results[pw].created_at})
        }
        resolve(MainPageImages)
      }else{
        resolve({Error:"Brak zdjęć"})
      }
    });
  });
}

app.post('/api/displayWall', function(req, res) {
  displayWall().then(function(data) {
    if(data.length>0){
      res.send(data)
    }else{
      res.send({Error:"Brak zdjęć"})
    }
  })
});



app.post('/api/showPost', function(req, res) {
  var postPath = req.body.postPath;
  ShowPost(postPath).then(function(data) {
    if(data.Error!=="Post nie istnieje lub został usunięty."){
      res.send({Error:"", postTitle:data.postTitle, postCategory:data.postCategory, postVoivodeship:data.postVoivodeship, postEmail:data.postEmail, postPhoto:data.postPhoto, postDescription:data.postDescription, postUserLogin:data.postUserLogin, postUserEmail:data.postUserEmail, postLink:data.postLink, postCreatedAt:data.postCreatedAt})
    }else{
      res.send({Error:"Post nie istnieje lub został usunięty."})
    }
  })
});



app.post('/api/randomPost', function(req, res) {
  RandomPost().then(function(data) {
    if(data.Error!=="Nie udało się znaleźć losowego posta."){
      var Photo =  Buffer.from( data.RandomPhoto, 'binary' ).toString();
      var RandomTitle = entities.decode(data.RandomTitle)
      res.send({Error:'', RandomTitle: RandomTitle, RandomLink: data.RandomLink, RandomPhoto:Photo})
    }else{
      res.send({Error:"Nie udało się znaleźć losowego posta."})
    }
  })
});


var displayPostsSlider = function() {
  return new Promise(function(resolve, reject) {
    var sql = 'SELECT * FROM posts ORDER BY id DESC LIMIT 10'
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;

      if(results.length>0){
        var MainPagePosts = [];


        for (let pw=0; pw<results.length; pw++){
          var DescirptionText =  Buffer.from( results[pw].description, 'binary' ).toString();
          DescirptionText = entities.decode(DescirptionText);
          results[pw].email = entities.decode(results[pw].email)
          results[pw].title = entities.decode(results[pw].title)
          var PhotoText =  Buffer.from( results[pw].photo, 'binary' ).toString();
          MainPagePosts.push({PostID:pw, Error:'', title:results[pw].title, category: results[pw].category, voivodeship:results[pw].voivodeship, email:results[pw].email, photo:PhotoText, description:DescirptionText, created_at:results[pw].created_at, link:results[pw].link})
        }
        resolve(MainPagePosts)
      }else{
        resolve({Error:"Brak postów"})
      }
    });
  });
}

var displayPostsSliderProfile = function(email) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM posts WHERE userEmail=? ORDER BY id DESC",
    [
      email
    ],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results.length);
      if(results.length>0){
        var MainPagePosts = [];
        if(results.length==1){
          for (let pw=0; pw<results.length; pw++){
            var DescirptionText =  Buffer.from( results[pw].description, 'binary' ).toString();
            DescirptionText = entities.decode(DescirptionText);
            results[pw].email = entities.decode(results[pw].email)
            results[pw].title = entities.decode(results[pw].title)
            var PhotoText =  Buffer.from( results[pw].photo, 'binary' ).toString();
            MainPagePosts.push({PostID:pw, Error:'', title:'Miejsce na twój przyszły post!', category: 'Twoja kategoria', voivodeship:"Twoje województwo", email:'', photo:'/src/client/dog.png', description:'Zachęcamy do pomagania psiakom. Twórz oraz udostępniaj posty, nie bój się działać!', created_at:'', link:''})
            MainPagePosts.push({PostID:pw, Error:'', title:results[pw].title, category: results[pw].category, voivodeship:results[pw].voivodeship, email:results[pw].email, photo:PhotoText, description:DescirptionText, created_at:results[pw].created_at, link:results[pw].link})
            MainPagePosts.push({PostID:pw, Error:'', title:'Miejsce na twój przyszły post!', category: 'Twoja kategoria', voivodeship:"Twoje województwo", email:'', photo:'/src/client/dog.png', description:'Zachęcamy do pomagania psiakom. Twórz oraz udostępniaj posty, nie bój się działać!', created_at:'', link:''})
          }
          resolve(MainPagePosts)
        }else if(results.length==2){
          for (let pw=0; pw<results.length; pw++){
            var DescirptionText =  Buffer.from( results[pw].description, 'binary' ).toString();
            DescirptionText = entities.decode(DescirptionText);
            results[pw].email = entities.decode(results[pw].email)
            results[pw].title = entities.decode(results[pw].title)
            var PhotoText =  Buffer.from( results[pw].photo, 'binary' ).toString();
            MainPagePosts.push({PostID:pw, Error:'', title:results[pw].title, category: results[pw].category, voivodeship:results[pw].voivodeship, email:results[pw].email, photo:PhotoText, description:DescirptionText, created_at:results[pw].created_at, link:results[pw].link})
          }
          MainPagePosts.push({PostID:2, Error:'', title:'Miejsce na twój przyszły post!', category: 'Twoja kategoria', voivodeship:"Twoje województwo", email:'', photo:'/src/client/dog.png', description:'Zachęcamy do pomagania psiakom. Twórz oraz udostępniaj posty, nie bój się działać!', created_at:'', link:''})
          resolve(MainPagePosts)
        }else{
          for (let pw=0; pw<results.length; pw++){
            var DescirptionText =  Buffer.from( results[pw].description, 'binary' ).toString();
            DescirptionText = entities.decode(DescirptionText);
            results[pw].email = entities.decode(results[pw].email)
            results[pw].title = entities.decode(results[pw].title)
            var PhotoText =  Buffer.from( results[pw].photo, 'binary' ).toString();
            MainPagePosts.push({PostID:pw, Error:'', title:results[pw].title, category: results[pw].category, voivodeship:results[pw].voivodeship, email:results[pw].email, photo:PhotoText, description:DescirptionText, created_at:results[pw].created_at, link:results[pw].link})
          }
          resolve(MainPagePosts)
        }
      }else{
        var MainPagePosts = [];
        MainPagePosts.push({PostID:0, Error:'', title:'Miejsce na twój przyszły post!', category: 'Twoja kategoria', voivodeship:"Twoje województwo", email:'', photo:'/src/client/dog.png', description:'Zachęcamy do pomagania psiakom. Twórz oraz udostępniaj posty, nie bój się działać!', created_at:'', link:''})
        MainPagePosts.push({PostID:1, Error:'', title:'Miejsce na twój przyszły post!', category: 'Twoja kategoria', voivodeship:"Twoje województwo", email:'', photo:'/src/client/dog.png', description:'Zachęcamy do pomagania psiakom. Twórz oraz udostępniaj posty, nie bój się działać!', created_at:'', link:''})
        MainPagePosts.push({PostID:2, Error:'', title:'Miejsce na twój przyszły post!', category: 'Twoja kategoria', voivodeship:"Twoje województwo", email:'', photo:'/src/client/dog.png', description:'Zachęcamy do pomagania psiakom. Twórz oraz udostępniaj posty, nie bój się działać!', created_at:'', link:''})
        resolve(MainPagePosts)
      }
    });
  });
}

app.post('/api/displayPostsSlider', function(req, res) {
  displayPostsSlider().then(function(data) {
    res.send(data);

  })
});

app.post('/api/displayPostsSliderProfile', function(req, res) {
  displayPostsSliderProfile(req.body.userEmail).then(function(data) {
    res.send(data);
  })
});



app.post('/api/register', function(req, res) {
    var infoLogin="";
    var infoEmail="";
    var infoPassword="";
    var infoPasswords="";
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var dateTime = req.body.dateTime;
    var ValidateEmail = validator.validate(email); // true


    if(name.length<3){
      infoLogin="Podane imię jest za krótkie!";
    }

    if(password.length<5){
      infoPassword="Podane hasło jest za krótkie!";
    }

    if(password!==password2){
      infoPasswords="Podane hasła się różnią!";
    }

    if(ValidateEmail===false){
      infoEmail="Podany email jest nieprawidłowy!";
    }

    if(infoLogin.length==0 && infoEmail.length==0 && infoPassword.length==0 && infoPasswords.length==0){
      Register(name, email, password, password2, dateTime).then(function(data) {

        if(data=="Podany email jest zajęty!"){
          res.send({RegisterSuccess:"Podany email jest zajęty!", infoLogin:infoLogin, infoEmail:infoEmail, infoPassword:infoPassword, infoPasswords:infoPasswords});
        }else{
          res.send({RegisterSuccess:true, Name:name});
          console.log("User created");
        }
      })
    }else{
      res.send({RegisterSuccess:false, infoLogin:infoLogin, infoEmail:infoEmail, infoPassword:infoPassword, infoPasswords:infoPasswords});
    }





});





app.listen(8080, () => console.log("Listening on port 8080!"));
