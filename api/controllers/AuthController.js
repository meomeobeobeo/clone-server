/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { generatePassword, sendEmail } = require("../services/HelpService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
module.exports = {
  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      
  
      const findUser = await Users.findOne({ email:email  });
      if (!findUser) {
        res.status(403).json("email not exist......");
      }  
      
     
      const isCorrectPassword = await bcrypt.compare(
        password,
        findUser.password
      );
      console.log(findUser.id)
      console.log(isCorrectPassword);
     if (!isCorrectPassword) {
       res.status(401).json("password is incorrect"); 
     }
     // tạo token 
     const token = jwt.sign({email : findUser.email , id : findUser.id },"meomeomeo",{expiresIn:'10h'})

     res.status(200).json({
        token : token,
        user : {...findUser , password :"hihi xin chao day khong phai password dau"}
     })


    } catch (error) {
      console.error(error);
      res.status(500);
    }
  },
  async signUp(req, res) {
    try {
      const { email, name } = req.body;
      const existingEmail = await Users.findOne({ email: email });
      if (!existingEmail) {
        const password = generatePassword();
        const hashPassword = await bcrypt.hash(password, 12);
        await Users.create({
          email: email,
          password: hashPassword,
          name: name,
        });
        sendEmail(
          email,
          "SIGN UP SUCCESS.",
          `your account is now active\nemail : ${email} \npassword:${password}`
        );

        res.json("user create success.");
      } else {
        res.json("user created...");
      }
    } catch (error) {
      res.json(error);
    }
  },
};
