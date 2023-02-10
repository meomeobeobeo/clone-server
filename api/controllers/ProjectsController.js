/**
 * ProjectsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createProject: async function (req, res) {
    try {
      const { name, url, description, category } = req.body;

      const data = await Projects.create({
        name: name,
        url: url,
        description: description,
        category: category,
      }).fetch();
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error......");
    }
  },
  getAllProjects:async function(req, res){
    try {
      const data = await Projects.find();
      console.log(data);
      res.ok(data)
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error});
    }
  },
  updateProject: async function (req, res) {
    
    try {
      const { name, url, description, category } = req.body;

      await Projects.update({ id: req.query.id }).set({
        name: name,
        url: url,
        description: description,
        category: category,
      });
      res.ok("update success.....");
    } catch (e) {
      res.status(500).json("Server error......");
    }
  },
  getProjectById: async function (req, res) {
    console.log("get all projects");
    try {
      const projects = await Projects.findOne({id : '63e39586d30e2018203f47ca'});
      console.log(projects)
      res.json(projects);
    } catch (error) {
      res.status(500).json("Server error");
    }
  },
};
