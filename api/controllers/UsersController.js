/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");
module.exports = {
  policies: ["authorization"],
  async changePassword(req, res) {
    console.log(req.body);
    console.log("change password");
    try {
      const { email, password , newPassword } = req.body;
  
      const findUser = await Users.findOne({ email: email });
      if (!findUser) {
        return res.status(403).json("Email does not exist.");
      }
  
      const isCorrectPassword = await bcrypt.compare(
        password,
        findUser.password
      );
  
      console.log(findUser.id);
      console.log(isCorrectPassword);
      if (!isCorrectPassword) {
        return res.status(401).json({
          errorCode: 0,
          message: 'Password is incorrect.'
        });
      }
  
      const hashPassword = await bcrypt.hash(newPassword, 12);
  
      // Update the user's password
      await Users.updateOne({ email: email })
        .set({
          password: hashPassword
        });
  
      // You can optionally fetch the updated user data after the password update
      const updatedUser = await Users.findOne({ email: email });
  
      return res.status(200).json({
        errorCode: 0,
        message: 'Password changed successfully.',
        updatedUser: updatedUser // Include updated user data if needed
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        errorCode: 1,
        message: 'An error occurred while changing the password.'
      });
    }
  }
,  
  
  userSearchByName: async function (req, res) {
    try {
      const searchText = req.params.searchText;

      const userSearch = await Users.find();
      const filterUser = userSearch.filter((user) => {
        return user.name.toLowerCase().includes(searchText.toLowerCase());
      });
      const result = filterUser.map((user) => {
        return {
          name: user.name,
          id: user.id,
          avatarUrl: user.avatarUrl,
        };
      });
      console.log(result);
      res.ok(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  createNewUser: async function (req, res) {
 
    try {
      const { name, email, password } = req.body;
      const existingEmail = await Users.findOne({ email: email });
      if (!existingEmail) {
       
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser =  await Users.create({
          email: email,
          password: password,
          name: name,
        }).fetch();
       
        console.log("user create success.");
        res.json({
          id : newUser.id,
          email : newUser.email,
          password : password,
          name : newUser.name
        });
      } else {
        console.log("user create success.");
        res.json("user created...");
      }
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
};
