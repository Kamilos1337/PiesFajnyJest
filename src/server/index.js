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
const path = require('path');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const proxy = require('http-proxy-middleware')
var expressStaticGzip = require('express-static-gzip');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const filePath = path.resolve(__dirname, '../../dist');

app.use('/', expressStaticGzip(filePath, {
    enableBrotli: true,
    customCompressions: [{
        encodingName: 'deflate',
        fileExtension: 'zz'
    }],
    orderPreference: ['br']
}));




var connection = mysql.createConnection({
  host     : 'localhost',
  //user     : 'root',
  user     : 'diego1799',
  //password : '',
  password : 'Asddsa121q2w3easdf1799#',
  database : 'pies'
});
var ProductionSrc = "../client/upload/";
//./src/client/upload/
connection.connect();


const WallAddLimiter = rateLimit({
  windowMs: 60 * 1000 * 10, // 10 minut
  max: 5, // start blocking after 5 requests
});

const resetPassLimiter = rateLimit({
  windowMs: 60 * 1000 * 10, // 10 minut
  max: 5, // start blocking after 5 requests
});

const ResetLinkLimiter = rateLimit({
  windowMs: 60 * 1000 * 30, // 10 minut
  max: 3, // start blocking after 5 requests
});

const ContactLimiter = rateLimit({
  windowMs: 60 * 1000 * 30, // 10 minut
  max: 5, // start blocking after 5 requests
});

const LimitValidateAcc = rateLimit({
  windowMs: 60 * 1000 * 30, // 10 minut
  max: 3, // start blocking after 5 requests
});

const LimitValidateReset = rateLimit({
  windowMs: 60 * 1000 * 30, // 10 minut
  max: 3, // start blocking after 5 requests
});

const AddPostLimit = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 5, // start blocking after 5 requests
});

const ChangePostLimit = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 10, // start blocking after 5 requests
});

const ChangePassword = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 5, // start blocking after 5 requests
});

const addNewsLimit = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 5, // start blocking after 5 requests
});

const addCommentLimit = rateLimit({
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

const RegisterLimit = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 5, // start blocking after 5 requests
});


const FinalResetLimiter = rateLimit({
  windowMs: 60 * 1000 * 30, // 30 minut
  max: 5, // start blocking after 5 requests
});



var Register = function(name, email, password, password2, dateTime, RegisterAds) {
  var token = randomstring.generate(35);
  var reset = randomstring.generate(35);
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/
    bcrypt.hash(password, 10, function(err, hash) {
      var sql = 'SELECT COUNT(*) AS checkEmail FROM users WHERE email = "'+email+'"'
      connection.query(sql, function (error, results, fields) {
        if (error) console.log(error);
        var checkEmail = results[0].checkEmail;
        if(checkEmail>0){
          resolve("Podany email jest zajęty!")
        }else{
          connection.query("INSERT INTO users(name,  password, email, created_at, ads, token, reset) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            name,
            hash,
            email,
            dateTime,
            RegisterAds,
            token,
            reset
          ],
          function (error, results, fields) {
            if (error) console.log(error);
            resolve("Rejestracja się udała!")

  		  async function mail() {


                let testAccount = await nodemailer.createTestAccount();


                let transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'piesfajnyjestapp@gmail.com', // generated ethereal user
                    pass: 'asddsa12#' // generated ethereal password
                  }
                });


                let info = await transporter.sendMail({
                  from: '"PiesFajnyJest" <pomoc@piesfajnyjest.com>', // sender address
                  to: email, // list of receivers
                  subject: "Potwierdź swój adres email", // Subject line
                  text: "", // plain text body
                  html: ` Witaj `+name+` <br>
  						Prosimy o zweryfikowanie konta klikając w poniższy przycisk: <br><br>
  						<a style="cursor: pointer !important;" href="https://piesfajnyjest.com?validate=`+token+`"><button style="cursor: pointer; background-color: coral; padding: 10px;  color: white;
  						font-weight: bold;
  						border: 1px solid gainsboro;">POTWIERDŹ ADRES EMAIL</button></a>
  						<br><br>
              Ewentualnie skopiuj ten link i wklej go do swojej przeglądarki:<br><br>
              https://piesfajnyjest.com?validate=`+token+` <br><br>
  						Znajdziesz nas również na:<br>
  						https://piesfajnyjest.com/ <br>
  						https://www.instagram.com/imeandog/ <br>
  						https://www.facebook.com/IPIESFAJNYJEST/ <br>
  						https://www.youtube.com/channel/UCtxw386WzCdHjVP2L5mTV1Q
  				` // html body
                });

              }

              mail().catch(console.error);
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
      if (error) console.log(error);
      if(results){
      if(results.length>0){
          var db_pass = results[0].password;
          bcrypt.compare(password, db_pass, function(err, res) {
            if(res) {
              if(results[0].confirm==1){
             resolve({Login:"Użytkownik zalogowany!", Password:results[0].password, Name:results[0].name, Email:results[0].email})
           }else{
             resolve({Error:"Potwierdz email"})
           }
            } else {
             resolve({Error:"Podane hasło jest niepoprawne!"})
            }
          });


      }else{
        resolve({Error:"Podany email nie istnieje!"})
      }
    }
    });
  });
}

var sendLink = function(email) {
    var token = randomstring.generate(35);
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/
    connection.query("SELECT confirm FROM users WHERE email = ?",
    [
      email
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
      if(results.length>0){
              if(results[0].confirm==1){
                 resolve({Error:"Potwierdzone jest"})
               }else{
             connection.query("UPDATE users SET token = ? WHERE email = ?",
             [
               token,
               email
             ],
             function (error, results, fields) {
               if (error) console.log(error);
               resolve({Success:"Zmieniony"})
               async function mail() {


                        let testAccount = await nodemailer.createTestAccount();


                        let transporter = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                            user: 'piesfajnyjestapp@gmail.com', // generated ethereal user
                            pass: 'asddsa12#' // generated ethereal password
                          }
                        });


                        let info = await transporter.sendMail({
                          from: '"PiesFajnyJest" <pomoc@piesfajnyjest.com>', // sender address
                          to: email, // list of receivers
                          subject: "Nowy link weryfikacyjny", // Subject line
                          text: "", // plain text body
                          html: ` Wysyłamy nowy link weryfikacyjny na twoją prośbę. <br>
                     Prosimy o zweryfikowanie konta klikając w poniższy przycisk: <br><br>
                     <a style="cursor: pointer !important;" href="https://piesfajnyjest.com?validate=`+token+`"><button style="cursor: pointer; background-color: coral; padding: 10px;  color: white;
                     font-weight: bold;
                     border: 1px solid gainsboro;">POTWIERDŹ ADRES EMAIL</button></a>
                     <br><br>

                     Znajdziesz nas również na:<br>
                     https://piesfajnyjest.com/ <br>
                     https://www.instagram.com/imeandog/ <br>
                     https://www.facebook.com/IPIESFAJNYJEST/ <br>
                     https://www.youtube.com/channel/UCtxw386WzCdHjVP2L5mTV1Q
                 ` // html body
                        });

                      }

                      mail().catch(console.error);
             });
           }
         }
       }else{
         console.log("problem w send link")
       }
    });
  });
}

var resetPass = function(email) {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/
    connection.query("SELECT reset FROM users WHERE email = ?",
    [
      email
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
      if(results.length>0){
        console.log(email);
               async function mail() {


                        let testAccount = await nodemailer.createTestAccount();


                        let transporter = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                            user: 'piesfajnyjestapp@gmail.com', // generated ethereal user
                            pass: 'asddsa12#' // generated ethereal password
                          }
                        });


                        let info = await transporter.sendMail({
                          from: '"PiesFajnyJest" <pomoc@piesfajnyjest.com>', // sender address
                          to: email, // list of receivers
                          subject: "Zresetuj swoje hasło", // Subject line
                          text: "", // plain text body
                          html: `Witaj, otrzymaliśmy od Ciebie nie dawno prośbę o zresetowanie hasła. <br>
                     Możesz to zrobić klikając w przycisk: <br><br>
                     <a style="cursor: pointer !important;" href="https://piesfajnyjest.com?reset=`+results[0].reset+`"><button style="cursor: pointer; background-color: coral; padding: 10px;  color: white;
                     font-weight: bold;
                     border: 1px solid gainsboro;">POTWIERDŹ ADRES EMAIL</button></a>
                     <br><br>
                     Lub klikając w poniższy link:<br><br>
                     https://piesfajnyjest.com?reset=`+results[0].reset+`<br><br>
                     Znajdziesz nas również na:<br>
                     https://piesfajnyjest.com/ <br>
                     https://www.instagram.com/imeandog/ <br>
                     https://www.facebook.com/IPIESFAJNYJEST/ <br>
                     https://www.youtube.com/channel/UCtxw386WzCdHjVP2L5mTV1Q
                 ` // html body
                        });

                      }
                      resolve({Success:"Wysłany kod na maila"})
                      mail().catch(console.error);
           }else{
             resolve({Error:"Brak maila"})
           }
         }else{
           resolve({Error:"Brak maila"})
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
      if (error) console.log(error);
      if(results){
      if(results.length>0){
           resolve({Info:"success", Name:results[0].name, Email:results[0].email, Created_At: results[0].created_at, ads:results[0].ads})
          } else {
           resolve({Info:"Zaloguj się!"})
          }
        }
    });
  });
}

var validateAcc = function(token) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT confirm FROM users WHERE token = ?",
    [
      token
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
      if(results.length>0){
        if(results[0].confirm==0){
          connection.query("UPDATE users SET confirm=1 WHERE token=?",
          [
            token
          ],
          function (error, results, fields) {
            if (error) console.log(error);
            resolve({Success:"Potwierdzone konto"})
          });
        }else{
          resolve({Error:"Link użyty"})
        }
      }else{
        resolve({Error:"Niepoprawny link"})
      }
    }else{
      resolve({Error:"Niepoprawny link"})
    }
    });
  });
}

var validateReset = function(token) {
    var token2 = randomstring.generate(35);
  return new Promise(function(resolve, reject) {
    connection.query("SELECT email FROM users WHERE reset = ?",
    [
      token
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
      if(results.length>0){
          connection.query("UPDATE users SET reset=? WHERE email=?",
          [
            token2,
            results[0].email
          ],
          function (error, results, fields) {
            if (error) console.log(error);
            resolve({Success:"Zmiana hasla", Code:token2})
          });
      }else{
        resolve({Error:"Niepoprawny link"})
      }
    }else{
      resolve({Error:"Niepoprawny link"})
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
      if (error) console.log(error);
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
        if (error) console.log(error);
        if(results){
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
                  if (error) console.log(error);
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
      }
      });
    });


}

var finalReset = function(pass1New, code) {
  var token = randomstring.generate(35);
    return new Promise(function(resolve, reject) {
      connection.query("SELECT reset FROM users WHERE reset = ?",
      [
        code,
      ],
      function (error, results, fields) {
        if (error) console.log(error);
        if(results){
        if(results.length>0){

              bcrypt.hash(pass1New, 10, function(err, hash) {
                connection.query("UPDATE users SET password=?, reset=? WHERE reset = ?",
                [
                  hash,
                  token,
                  code
                ],
                function (error, results, fields) {
                  if (error) console.log(error);
                  console.log(results);
                  if(results){
                    resolve({Success:"Haslo zmienione!", Pass:hash})
                  }else{
                    resolve({Error:"Nie udalo sie zmienic hasla!"})
                  }
                });
                });
        }else{
          console.log("Problem here");
        }
      }
      });
    });


}

var removeAccount = function(userEmail, oldPass) {
    return new Promise(function(resolve, reject) {
      connection.query("SELECT * FROM users WHERE email = ?",
      [
        userEmail,
      ],
      function (error, results, fields) {
        if (error) console.log(error);
        if(results){
        if(results.length>0){
          var db_pass = results[0].password;
          bcrypt.compare(oldPass, db_pass, function(err, res) {
            if(res) {
                connection.query("DELETE FROM users WHERE email=?;",
                [
                  userEmail
                ],
                function (error, results, fields) {
                  if (error) console.log(error);
                  if(results){
                    connection.query("SELECT photo FROM posts WHERE userEmail=?;",
                    [
                      userEmail
                    ],
                    function (error, results, fields) {
                      if (error) console.log(error);
                      for(var pp =0; pp<results.length; pp++){
                        try {
                            fs.unlinkSync("./src/client/upload/"+results[pp].photo)
                          //file removed
                        } catch(err) {
                          console.error(err)
                        }
                      }
                    });
                    connection.query("DELETE FROM posts WHERE userEmail=?;",
                    [
                      userEmail
                    ],
                    function (error, results, fields) { });
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
      }
      });
    });


}


var ShowPost = function(postPath) {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/
    connection.query("SELECT * FROM posts WHERE link = ?",
    [
      postPath
    ],
    function (error, results, fields) {
      if (error) console.log(error);

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

var ShowNews = function(postPath) {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/

    connection.query("SELECT * FROM postnews WHERE postLink = ? ORDER BY id DESC",
    [
      postPath
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
      if(results.length>0){
        var AllNews = [];
        for(var newsL=0; newsL<results.length; newsL++){
          AllNews.push({newsText:results[newsL].text, newsUserEmail:results[newsL].userEmail, newsUserName:results[newsL].userName, created_at:results[newsL].created_at})
        }
        resolve(AllNews)
      }else{
        resolve({Error:"Brak newsów"})
      }
    }else{
      resolve({Error:"Brak newsów"})
    }
    });
  });
}

var ShowComments = function(postPath) {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/

    connection.query("SELECT * FROM postcomments WHERE postLink = ? ORDER BY id DESC",
    [
      postPath
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
      if(results.length>0){
        var AllComments = [];
        for(var newsL=0; newsL<results.length; newsL++){
          AllComments.push({commentsText:results[newsL].text, commentsUserEmail:results[newsL].userEmail, commentsUserName:results[newsL].userName, created_at:results[newsL].created_at})
        }
        resolve(AllComments)
      }else{
        resolve({Error:"Brak komentarzy"})
      }
    }else{
      resolve({Error:"Brak komentarzy"})
    }
    });
  });
}


var RandomPost = function() {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password*/

    var sql = 'SELECT title, link, photo FROM posts ORDER BY RAND() LIMIT 1'
    connection.query(sql, function (error, results, fields) {
      if (error) console.log(error);

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

  var RandomName = "PiesFajnyJest_" + randomstring.generate(15) +".jpg";
  if(photo){
    var imageBuffer = decodeBase64Image(photo);
    fs.writeFile(ProductionSrc+RandomName, imageBuffer.data, function(err) {

    });
  }else{
    RandomName="dog.png"
  }


  return new Promise(function(resolve, reject) {
    connection.query("INSERT INTO posts (title, category, voivodeship, email, photo, description, userLogin, userEmail, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      category,
      voivodeship,
      email,
      RandomName,
      description,
      userLogin,
      userEmail,
      randomLink,
      date
    ],
    function (error, results, fields) {
      if (error) console.log(error);
    });
  });
}

var AddArticle = function(title, editorHtml, tags, date) {
  return new Promise(function(resolve, reject) {
    connection.query("INSERT INTO article (title, html, tags, date) VALUES (?, ?, ?, ?)",
    [
      title,
      editorHtml,
      tags,
      date
    ],
    function (error, results, fields) {
      if (error) console.log(error);
    });
  });
}

var ShowArticle = function() {
  return new Promise(function(resolve, reject) {
          connection.query("SELECT * FROM article WHERE id=3",
          [

          ],
          function (error, results, fields) {
            if (error) console.log(error);
            resolve(results)
        });

      });

}

var ChangePost = function(title, category, email, photo, description, voivodeship, link, emailUser, passUser, photoChanged, newPhoto) {
  var dont = true;
  if(photoChanged){
    if(photoChanged==true){
      var RandomName = "PiesFajnyJest_" + randomstring.generate(15) +".jpg";
      dont = false;
    }else{
      var RandomName = photo;
    }
  }else{
    var RandomName = photo;
  }

  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM users WHERE email=? AND password=?",
    [
      emailUser,
      passUser
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
        if(results.length>0){
          connection.query("UPDATE posts SET title=?, category=?, voivodeship=?, email=?, photo=?, description=? WHERE userEmail=? AND link=?",
          [
            title,
            category,
            voivodeship,
            email,
            RandomName,
            description,
            emailUser,
            link
          ],
          function (error, results, fields) {
            if (error) console.log(error);
            console.log(results.changedRows);
            if(results.changedRows){
              if(results.changedRows>0){
                if(dont==false){
                  try {
                  fs.unlinkSync(ProductionSrc+photo)
                  var imageBuffer = decodeBase64Image(newPhoto);
                  fs.writeFile(ProductionSrc+RandomName, imageBuffer.data, function(err) {

                  });
                  } catch(err) {
                    console.error(err)
                  }

                }else{
                  console.log("Edycja postu bez zmiany zdjecia")
                }
                resolve({Error:"Udało się zmienić post!", NewRandomPhoto:RandomName})
              }
            }else{

              resolve({Error:"Nie udało się zmienić posta!"})
            }
          });
        }
      }

    });

  });
}

var addNews = function(text, emailUser, passUser, nameUser, linkPost, date) {

  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM users WHERE email=? AND password=?",
    [
      emailUser,
      passUser
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
        if(results.length>0){
          connection.query("SELECT * FROM posts WHERE userEmail=? AND link=?",
          [
            emailUser,
            linkPost
          ],
          function (error, results, fields) {
            if (error) console.log(error);
            if(results){
              if(results.length>0){

                connection.query("INSERT INTO postnews (text, userEmail, userName, postLink, created_at) VALUES (?, ?, ?, ?, ?)",
                [
                  text,
                  emailUser,
                  nameUser,
                  linkPost,
                  date
                ],
                function (error, results, fields) {
                  if (error) console.log(error);
                  resolve({Success:"Udało się dodać newsa!"})
                  });
            }else{
              resolve({Error:"Nie udało się dodać newsa!"})
            }
          }else{
            resolve({Error:"Nie udało się dodać newsa!"})
          }
        });
        }
      }//tu

    });

  });
}

var addComment = function(text, emailUser, passUser, nameUser, linkPost, date) {

  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM users WHERE email=? AND password=?",
    [
      emailUser,
      passUser
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
        if(results.length>0){
          connection.query("SELECT * FROM posts WHERE userEmail=? AND link=?",
          [
            emailUser,
            linkPost
          ],
          function (error, results, fields) {
            if (error) console.log(error);
            if(results){
              if(results.length>0){

                connection.query("INSERT INTO postcomments (text, userEmail, userName, postLink, created_at) VALUES (?, ?, ?, ?, ?)",
                [
                  text,
                  emailUser,
                  nameUser,
                  linkPost,
                  date
                ],
                function (error, results, fields) {
                  if (error) console.log(error);
                  resolve({Success:"Udało się dodać newsa!"})
                  });
            }else{
              resolve({Error:"Nie udało się dodać newsa!"})
            }
          }else{
            resolve({Error:"Nie udało się dodać newsa!"})
          }
        });
        }
      }//tu

    });

  });
}


var AddToWall = function(photo, userLogin, userEmail, Date) {
  var RandomName = "PiesFajnyJestWall_" + randomstring.generate(15) +".jpg";

  var imageBuffer = decodeBase64Image(photo);
  fs.writeFile(ProductionSrc+RandomName, imageBuffer.data, function(err) {

  });
  return new Promise(function(resolve, reject) {
    connection.query("INSERT into dogsphotos (photo, user_login, user_email, created_at) VALUES (?, ?, ?, ?)",
    [
      RandomName,
      userLogin,
      userEmail,
      Date
    ],
    function (error, results, fields) {
      if(results) resolve({Error:"Wall photo added"});
      if (error) {
        console.log(error);
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
      if (error) console.log(error);
      if(results){
      if(results.length>0){
           resolve({Posts: results})
      }else{
        resolve("Brak postów")
      }
    }
    });
  });
}



function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = Buffer.from(matches[2], 'base64');

  return response;
}


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

  if(description.length<100){
    res.send({Error:"Za krótki opis"})
    Stop=1;
    return;
  }

  if(description.length>100000){
    console.log("za dlugi opis!");
    Stop=0;
    return;
  }

  if(email.length>30){
    res.send({Error:"Za długi email"});
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

app.post('/api/ChangePost', ChangePostLimit, function(req, res) {
  var newPhoto = req.body.newPhoto;
  var photoChanged = req.body.photoChanged;
  var pass_user = req.body.passUser;
  var email_user = req.body.emailUser;
  var link = req.body.link
  var title = req.body.title;
  var category = req.body.category;
  var email = req.body.email;
  var photo = req.body.photo;
  var description = req.body.description;
  var voivodeship = req.body.voivodeship;
  var ValidateEmail = validator.validate(email); // true
  var Stop = 0;

  if(title.length<6){
    res.send({Error:"Za krótki tytuł"});
    Stop=1;
    return;
  }

  if(email.length>30){
    res.send({Error:"Za długi email"});
    Stop=1;
    return;
  }

  if(description.length>100000){
    console.log("za dlugi opis!");
    Stop=0;
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

  if(description.length<100){
    res.send({Error:"Za krótki opis"})
    Stop=1;
    return;
  }


if(Stop==0){
  description = entities.encode(description)
  title = entities.encode(title)
  email = entities.encode(email)
  ChangePost(title, category, email, photo, description, voivodeship, link, email_user, pass_user, photoChanged, newPhoto).then(function(data) {
    res.send(data);

  })
}

});

app.post('/api/facebookCounts', function(req, res){
      axios.get('https://graph.facebook.com/v3.0/', {
        params: {
          fields: 'engagement', access_token: '2538790922867434|6de1a081df3c992e2c53a5c276f43f5e', id: "https://piesfajnyjest.com/"+req.body.Link
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

app.post('/api/finalReset', FinalResetLimiter, function(req, res){
  console.log(req);
  console.log(req.body.pass1)
  if(req.body.pass1==req.body.pass2){
    if(req.body.pass1.length>5){
      if(req.body.resetPassToken.length>10){
        finalReset(req.body.pass1, req.body.resetPassToken).then(function(data) {
              res.send(data);
          })
      }else{
        res.send({Error:"Zly kod"})
      }
    }else{
      res.send({Error:"Za krotkie hasla"});
    }
  }else{
    res.send({Error:"Zle hasla"});
  }


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

app.post('/api/addArticle', function(req, res){
  console.log('ell')
  AddArticle(req.body.title, req.body.editorHtml, req.body.tags, req.body.date).then(function(data) {
    res.send({Done:"poszlo"})
  })
});

app.post('/api/showArticle', function(req, res){
  ShowArticle().then(function(data) {
    res.send(data)
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
      res.send(data);
      console.log("User created");
    }
  })
});

app.post('/api/sendLink', ResetLinkLimiter, function(req, res) {
  var email = req.body.email;
  sendLink(email).then(function(data) {
    res.send(data);
  })
});

app.post('/api/resetPass', resetPassLimiter, function(req, res) {
  var ValidateEmail = validator.validate(req.body.email); // true
  if(ValidateEmail==true){
    resetPass(req.body.email).then(function(data) {
      res.send(data);
    })
  }else{
    res.send({Error:"Zły email"})
  }

});




app.post('/api/AddToWall', WallAddLimiter, function(req, res) {
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
      if (error) console.log(error);
      if(results){
      if(results.length>0){
        var MainPageImages = [];
        for (let pw=0; pw<results.length; pw++){
          var PhotoText = ProductionSrc+results[pw].photo
          MainPageImages.push({src:PhotoText, user_login:results[pw].user_login, user_email:results[pw].user_email, created_at:results[pw].created_at})
        }
        resolve(MainPageImages)
      }else{
        resolve({Error:"Brak zdjęć"})
      }
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

app.post('/api/showNews', function(req, res) {
  var postPath = req.body.postPath;
  ShowNews(postPath).then(function(data) {
    res.send(data);
  })
});

app.post('/api/showComments', function(req, res) {
  var postPath = req.body.postPath;
  ShowComments(postPath).then(function(data) {
    res.send(data);
  })
});

app.post('/api/addNews', addNewsLimit, function(req, res) {
  req.body.addNewsText = entities.encode(req.body.addNewsText)
  if(req.body.addNewsText.length<5){
    res.send({Error:"Za krótki text"})
  }else if(req.body.addNewsText.length>1000){
    res.send({Error:"Za długi text"})
  }else{
    addNews(req.body.addNewsText, req.body.emailUser, req.body.passUser, req.body.nameUser, req.body.link, req.body.created_at).then(function(data) {
      res.send(data);
    })
  }
});

app.post('/api/addComment', addCommentLimit, function(req, res) {
  req.body.addCommentText = entities.encode(req.body.addCommentText)
  if(req.body.addCommentText.length<5){
    res.send({Error:"Za krótki text"})
  }else if(req.body.addCommentText.length>1000){
    res.send({Error:"Za długi text"})
  }else{
    addComment(req.body.addCommentText, req.body.emailUser, req.body.passUser, req.body.nameUser, req.body.link, req.body.created_at).then(function(data) {
      res.send(data);
    })
  }
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
      if (error) console.log(error);
      if(results){
      if(results.length>0){
        var MainPagePosts = [];


        for (let pw=0; pw<results.length; pw++){
          var DescirptionText =  Buffer.from( results[pw].description, 'binary' ).toString();
          DescirptionText = entities.decode(DescirptionText);
          results[pw].email = entities.decode(results[pw].email)
          results[pw].title = entities.decode(results[pw].title)
          MainPagePosts.push({PostID:pw, Error:'', title:results[pw].title, category: results[pw].category, voivodeship:results[pw].voivodeship, email:results[pw].email, photo:results[pw].photo, description:DescirptionText, created_at:results[pw].created_at, link:results[pw].link})
        }
        resolve(MainPagePosts)
      }else{
        resolve({Error:"Brak postów"})
      }
    }
    });
  });
}

var SearchPosts = function(CategoryFind, VoivodeshipFind, NewOld, StartPost, HowManyPosts) {

  return new Promise(function(resolve, reject) {
    connection.query("SELECT COUNT(id) as count FROM posts WHERE category IN (?) AND voivodeship IN (?)",
    [
      CategoryFind,
      VoivodeshipFind,
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      var count = results[0].count;
      connection.query("SELECT * FROM posts WHERE category IN (?) AND voivodeship IN (?) ORDER BY id "+NewOld+" LIMIT ?, ?",
      [
        CategoryFind,
        VoivodeshipFind,
        StartPost,
        HowManyPosts
      ],
      function (error, results, fields) {
        if (error) console.log(error);
        if(results){
        if(results.length>0){
          var MainPagePosts = [];
          for (let pw=0; pw<results.length; pw++){
            var DescirptionText =  Buffer.from( results[pw].description, 'binary' ).toString();
            DescirptionText = entities.decode(DescirptionText);
            results[pw].email = entities.decode(results[pw].email)
            results[pw].title = entities.decode(results[pw].title)
            results[pw].link = results[pw].link.replace(results[pw].link, "/"+results[pw].link)
            MainPagePosts.push({PostID:pw, Error:'', title:results[pw].title, category: results[pw].category, voivodeship:results[pw].voivodeship, email:results[pw].email, photo:results[pw].photo, description:DescirptionText, created_at:results[pw].created_at, link:results[pw].link, count:count})
          }
          resolve(MainPagePosts)
        }else{
          resolve({Error:"Brak postów"})
        }
      }
      });
    });
  });
}

app.post('/api/SearchPosts', function(req, res) {
  var PageNum = req.body.pageNum;
  if(PageNum==1){
    var StartPost = 0
  }else{
    var StartPost = (PageNum*20)-20;
  }

  var HowManyPosts = 20;

  if(req.body.NewOld=="Najnowsze"){
    req.body.NewOld="DESC";
  }
  if(req.body.NewOld=="Najstarsze"){
    req.body.NewOld="ASC";
  }

  SearchPosts(req.body.Category, req.body.Voivodeship, req.body.NewOld, StartPost, HowManyPosts).then(function(data) {
    res.send(data);
  })
});


var displayPostsSliderProfile = function(email) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM posts WHERE userEmail=? ORDER BY id DESC",
    [
      email
    ],
    function (error, results, fields) {
      if (error) console.log(error);
      if(results){
      if(results.length>0){
        var MainPagePosts = [];
        if(results.length==1){
          for (let pw=0; pw<results.length; pw++){
            var DescirptionText =  Buffer.from( results[pw].description, 'binary' ).toString();
            DescirptionText = entities.decode(DescirptionText);
            results[pw].email = entities.decode(results[pw].email)
            results[pw].title = entities.decode(results[pw].title)
            var PhotoText = results[pw].photo;
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
            var PhotoText = results[pw].photo;
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
              var PhotoText = results[pw].photo;
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

app.post('/api/contactMail', ContactLimiter, function(req, res) {
  var ValidateEmail = validator.validate(req.body.ctEmail); // true
  if(ValidateEmail==true){
    if(req.body.ctTitle){
      if(req.body.ctTitle.length<50){
        if(req.body.ctDesc){
          if(req.body.ctDesc.length<10000){
            if(req.body.ctName){
              if(req.body.ctName.length<20){
                var title = entities.decode(req.body.ctTitle)
                var name = entities.decode(req.body.ctName)
                var desc  = entities.decode(req.body.ctDesc)
                async function mail() {


                        let testAccount = await nodemailer.createTestAccount();


                        let transporter = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                            user: 'piesfajnyjestapp@gmail.com', // generated ethereal user
                            pass: 'asddsa12#' // generated ethereal password
                          }
                        });


                        let info = await transporter.sendMail({
                          from: '"PiesFajnyJest" <pomoc@piesfajnyjest.com>', // sender address
                          to: "kamilzachradnik1337@gmail.com", // list of receivers
                          subject: title, // Subject line
                          text: "", // plain text body
                          html: `Imie: `+name+` <br>
                          Nazwisko: `+req.body.ctEmail+`<br> <br>
                          `+desc+`  `
                        });

                      }

                      mail().catch(console.error);
                      res.send({Success:"Mail wyslany", mail:req.body.ctEmail})
              }else{
                res.send({Error:"dlugie imie"})
              }
            }else{
              res.send({Error:"brak imienia"})
            }
          }else{
            res.send({Error:"dlugi opis"})
          }
        }else{
          res.send({Error:"brak opisu"})
        }
      }else{
        res.send({Error:"dlugi tytul"})
      }
    }else{
      res.send({Error:"brak tytulu"})
    }

  }else{
    res.send({Error:"Zly email"})
  }

});

app.post('/api/validateAcc', LimitValidateAcc, function(req, res) {
  validateAcc(req.body.token).then(function(data) {
    res.send(data);
  })
});

app.post('/api/validateReset', LimitValidateReset, function(req, res) {
  validateReset(req.body.token).then(function(data) {
    res.send(data);
  })
});



app.post('/api/register', RegisterLimit, function(req, res) {
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
      Register(name, email, password, password2, dateTime, req.body.RegisterAds, req.body.RegisterRules).then(function(data) {

        if(data=="Podany email jest zajęty!"){
          res.send({RegisterSuccess:"Podany email jest zajęty!", infoLogin:infoLogin, infoEmail:infoEmail, infoPassword:infoPassword, infoPasswords:infoPasswords});
        }else{
          res.send({RegisterSuccess:true, Name:name, Email:email});
          console.log("User created");
        }
      })
    }else{
      res.send({RegisterSuccess:false, infoLogin:infoLogin, infoEmail:infoEmail, infoPassword:infoPassword, infoPasswords:infoPasswords});
    }





});

String.prototype.replaceAll = function (stringToFind, stringToReplace) {
    if (stringToFind === stringToReplace) return this;
    var temp = this;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};


app.get('/ads.txt', function(request, response) {
  const filePath = path.resolve(__dirname, '../../public', 'ads.txt');
  response.sendFile(filePath);
});

app.get('/robots.txt', function(request, response) {
  const filePath = path.resolve(__dirname, '../../public', 'robots.txt');
  response.sendFile(filePath);
});

app.get('/favicon.ico', function(request, response) {
  const filePath = path.resolve(__dirname, '../../public', 'favicon.ico');
  response.sendFile(filePath);
});

app.get('/:postPath', function(request, response) {
  ShowPost(request.params.postPath).then(function(data2) {
    if(data2.Error!=="Post nie istnieje lub został usunięty."){
      console.log("Sprawdzam posta")
      const filePath = path.resolve(__dirname, '../../dist', 'index.html');

      // read in the index.html file
      fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        var newOpis = data2.postDescription.replaceAll(">", "")
        var newTitle = data2.postTitle.replaceAll(">", "")
        newOpis = newOpis.replaceAll("<", "");
        newOpis = newOpis.replaceAll(";", "");
        newOpis = newOpis.replaceAll("[", "");
        newOpis = newOpis.replaceAll("]", "");
        newOpis = newOpis.replaceAll("'", "");
        newOpis = newOpis.replaceAll("\"", "");
        newOpis = newOpis.replaceAll("`", "");

        newTitle = newTitle.replaceAll("<", "");
        newTitle = newTitle.replaceAll(";", "");
        newTitle = newTitle.replaceAll("[", "");
        newTitle = newTitle.replaceAll("]", "");
        newTitle = newTitle.replaceAll("'", "");
        newTitle = newTitle.replaceAll("\"", "");
        newTitle = newTitle.replaceAll("`", "");

        // replace the special strings with server generated strings
        data = data.replaceAll("Pies Fajny Jest | Nie bójmy się pomagać!", newTitle);
        data = data.replace("Jesteśmy serwisem którego głównym celem jest pomoc potrzebującym psom. Chcesz adoptować psa? A może potrzebujesz pomocy dal swoich zwierzaków? Dodaj ogłoszenie!", newOpis);
        result = data.replace("https://i.imgur.com/m1PEDc7.jpg", "https://piesfajnyjest.com/src/client/upload/"+data2.postPhoto);
        response.send(result);
      });
    }else{

    }
  })
});

app.get('*', function(request, response) {
  const filePath = path.resolve(__dirname, '../../dist', 'index.html');
  response.sendFile(filePath);
});

process.env.NODE_ENV = 'production';
app.listen(8080, () => console.log("Listening on port 8080!"));
