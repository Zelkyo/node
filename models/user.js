let connection = require('../config/database.js');
let moment = require('moment');
let md5 = require('md5');

class User{
    constructor (row){
        this.row = row
    }

    get id(){ return this.row.id }
    get creation(){ return moment(this.row.creation) }
    get username(){ return this.row.pseudo }
    get cover(){ return this.row.cover }
    get avatar(){ return this.row.avatar }
    get points(){ return this.row.points }
    get biography(){ return this.row.biography }

    // Find user and get infos
    static find(data, callback) {
        connection.query('SELECT * FROM users WHERE pseudo = ?', [data.replace('.', ' ')], (err, rows) => {
            if (err) throw err;
            if(rows.length > 0){
                callback(new User(rows[0]))
            }else{
                callback('unknown')
            }
        })
    }

    static countPublications(data, callback) {
        connection.query('SELECT * FROM users WHERE pseudo = ?', [data.replace('.', ' ')], (err, rows) => {
            if(err) throw err
            connection.query('SELECT * FROM publications WHERE author = ?', [rows[0].id], (err, rows) => {
                if (err) throw err;
                callback(rows.length)
            })
        })
    }

    static getSubscribers(data, callback) {
        connection.query('SELECT * FROM users WHERE pseudo = ?', [data.replace('.', ' ')], (err, rows) => {
            if(err) throw err
            connection.query('SELECT * FROM subs WHERE profile = ?', [rows[0].id], (err, rows) => {
                if (err) throw err;
                callback(rows.length)
            })
        })
    }

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