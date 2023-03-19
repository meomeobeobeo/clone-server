/**
 * ProjectsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createProject: async function (req, res) {
    try {
      const { name, url, description, category, userCreateId } = req.body;

      const data = await Projects.create({
        name: name,
        url: url,
        description: description,
        category: category,
        admins: [userCreateId],
        users:[userCreateId]
      }).fetch();
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error......");
    }
  },
  getAllProjectsHaveAdminId: async function (req, res) {
    /** if project have id of current user login , res.ok() */
    try {
      const currentUser = req.params.currentUser;

      console.log("current user id :  ", currentUser);
      const data = await Projects.find();
      const filter = data?.filter((project) => {
        // check admins list in project have current user login
        return project?.admins?.includes(currentUser);
      });

      const result = filter.map((project) => {
        return {
          name: project.name,
          id: project.id,
          url:project.url,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      });
      console.log(result);
      res.ok(result);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
  },
  getListProjectCurrentUserIsWorkIn: async function (req, res) {
    try {
      const currentUser = req.params.currentUser;
      const data = await Projects.find();
      const filter = data?.filter((project) => {
        const users = project.users;
        if (users.includes(currentUser)) {
          return true;
        }
        return false;
      });
      const result = filter.map((project) => {
        return {
          name: project.name,
          id: project.id,
          description: project.description,
          url:project.url,
          category:project.category,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      });
      res.ok(result)
    } catch (error) {}
  },

  updateProject: async function (req, res) {
    try {
      const { name, url, description, category } = req.body;

       const newProject = await Projects.update({ id: req.query.id }).set({
        name: name,
        url: url,
        description: description,
        category: category,
      }).fetch();
      
      res.ok(newProject[0]);
    } catch (e) {
      console.log(e);
      res.status(500).json("Server error......");
    }
  },

  getProjectById: async function (req, res) {
    const id = req.params.id;
    console.log("get detail project");
    try {
      const projects = await Projects.findOne({ id: id });
      const listIssesId = projects.issues;
      const listUserId = projects.users;
      const issuesData = await Issues.find({ id: { in: listIssesId } }).sort('createdAt DESC');;

      const userListInfor = await Users.find({ id: { in: listUserId } });
      const userListResult = userListInfor.map((user) => {
        return {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        };
      });

      res.json({
        ...projects,
        issues: issuesData,
        users: userListResult,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  addUserToProject: async function (req, res) {
    const { userId, projectId } = req.body;
    console.log("userId ", userId, "\n", "projectId ", projectId);

    try {
      const projectNeedUpdate = await Projects.findOne({ id: projectId });

      const listUserId = projectNeedUpdate?.users;

      if (!listUserId.includes(userId)) {
        listUserId.push(userId);
      } else {
        console.log("user was added in project.");
      }
      const updatedProject = await Projects.update({ id: projectId })
        .set({ users: listUserId })
        .fetch();
      console.log("updated project");

      const userListInfor = await Users.find({ id: { in: listUserId } });
      const userListResult = userListInfor.map((user) => {
        return {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        };
      });
      const resultSendToClient = {
        ...projectNeedUpdate,
        users: userListResult,
      };
      console.log(resultSendToClient);

      res.ok(resultSendToClient);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
