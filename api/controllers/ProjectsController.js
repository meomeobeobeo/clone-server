/**
 * ProjectsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createProject: async function (req, res) {
    try {
      const { name, url, description, category , userCreateId } = req.body;
      


      const data = await Projects.create({
        name: name,
        url: url,
        description: description,
        category: category,
        admins : [userCreateId]
      }).fetch();
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error......");
    }
  },
  getAllProjectsHaveAdminId:async function(req, res){
    /** if project have id of current user login , res.ok() */
    try {
      const currentUser = req.params.currentUser;
      
      console.log("current user id :  " , currentUser)
      const data = await Projects.find();
      const filter = data?.filter((project) => {
          // check admins list in project have current user login
          return project?.admins?.includes(currentUser)
        
      })
     
      const result = filter.map((project) => {
        return {
          name : project.name,
          id : project.id
        }
      })
      console.log(result)
      
      

      
      res.ok(result)
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
    const id = req.params.id;
    console.log('get detail project')
    try {
      const projects = await Projects.findOne({id : id});
      const listIssesId = projects.issues
      const issuesData = await Issues.find({id : {'in':listIssesId}});
      
      res.json({
        ...projects,
        issues:issuesData
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
