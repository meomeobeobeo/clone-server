/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    policies:[
        'authorization',
    ],
     changePassword: async function(req, res){
        console.log(req.userType);
       console.log('change password')
       res.json("hello you change pass word.")
        
    }
    
  

};

