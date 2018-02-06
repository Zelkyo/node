let connection = require('../config/database.js');
let md5 = require('md5');

class User{
    
    // User loging in
    static login(data,callback) {
        if(data.email && data.password){
            connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [data.email, md5(data.password)], (err,rows) => {
                if (err) throw err;
                if(rows.length > 0){
                    callback('connected', rows[0])
                }else{
                    callback('Identifiants incorrects');
                }
            })
        }else{
            callback('Merci de compléter tous les champs');
        }
    }

    // User registration
    static register(data, callback) {
        if(data.firstname && data.surname && data.pseudo.replace(/\s/g,'') && data.email && data.password && data.password2){
            if(data.cgu){
                    if(data.password == data.password2){
                        connection.query('SELECT * FROM users WHERE pseudo = ?', [data.pseudo.replace(/\s/g,'')], (err,rows) => {
                            if (err) throw err;
                            if(rows.length == 0){
                                connection.query('SELECT * FROM users WHERE email = ?', [data.email], (err,rows) => {
                                    if (err) throw err;
                                    if(rows.length == 0){
                                        connection.query('INSERT INTO users (pseudo,firstname,surname,email,password,category) VALUES (?,?,?,?,?,?)', [data.pseudo.replace(/\s/g, ''), data.firstname, data.surname, data.email, md5(data.password), data.category], (err, rows) => {
                                            if (err) throw err;
                                            callback('registered', rows);
                                        })
                                    }else{
                                        callback('Désolé, cette adresse e-mail est déjà utilisée');
                                    }
                                })
                            }else{
                                callback('Désolé, ce pseudonyme n\'est plus disponible');
                            }
                        })
                    }else{
                        callback('Les mots de passe ne correspondent pas');
                    }
            }else{
                callback('Vous devez accepter les Conditions Générales d\'Utilisation');
            }
        }else{
            callback('Merci de compléter tous les champs');
        }
    }

}

module.exports = User