let connection = require('../config/database.js');

class User{
    
    static register(data, callback) {
        if(data.firstname && data.surname && data.pseudo && data.email && data.password && data.password2 && data.cgu){
            if(data.pseudo.indexOf(' ') !== -1){
                if(data.password == data.password2){
                    callback('ok');
                }else{
                    callback('Les mots de passe ne correspondent pas');
                }
            }else{
                callback('Votre pseudo ne peut pas contenir d\'espace');
            }
        }else{
            callback('Merci de compléter tous les champs');
        }
    }

}

module.exports = User