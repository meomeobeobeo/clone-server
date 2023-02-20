/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  policies: ["authorization"],
  changePassword: async function (req, res) {
    console.log(req.userType);
    console.log("change password");
    res.json("hello you change pass word.");
  },
  userSearchByName: async function (req, res) {
    try {
      const searchText = req.params.searchText;

      const userSearch = await Users.find();
      const filterUser = userSearch.filter((user) => {
        return user.name.toLowerCase().includes(searchText.toLowerCase());
      });
      const result = filterUser.map((user) => {
        return{
            name : user.name,
            id : user.id,
            avatarUrl : user.avatarUrl

        }

      });
      console.log(result);
      res.ok(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};
