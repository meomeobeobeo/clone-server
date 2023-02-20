/**
 * IssuesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createNewIssue: async function (req, res) {
    try {
      const { title, type, priority , status , userCreateId , description , reporterId ,  assigneesId  } = req.body;

      const projectId = req.params.project_id;
      if (!projectId) {
        projectId = req.query.project_id;
      }
      const newIssue = await Issues.create({
        title: title,
        type: type,
        priority: priority,
        project_id: projectId,
        status : status,
        userCreateId : userCreateId,
        description : description,
        reporterId : reporterId,
        assigneesId : [...assigneesId]
      }).fetch();

      const currentProject = await Projects.findOne({ id: projectId });
      const listIssue = currentProject?.issues;
      listIssue.push(newIssue.id);
      console.log(listIssue);
      const updatedProject = await Projects.update({ id: projectId })
        .set({ issues: listIssue })
        .fetch();

      res.ok({
        message: "create new issue success ",
        newIssues: newIssue,
        updatedProject: updatedProject[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  deleteIssue: async function (req, res) {
    try {
      const issueId = req.query.issue_id;
      const project_id = req.query.project_id;
      let currentProject = await Projects.findOne({ id: project_id });

      const newListIssues = currentProject?.issues.filter(
        (issue) => issue !== issueId
      );
      const updatedProject = await Projects.update({ id: project_id })
        .set({ issues: newListIssues })
        .fetch();
      console.log("issuesID  : " + issueId);
      await Issues.destroy({ id: issueId });

      res.ok({
        message: "delete issue successfully",
        updatedProject: updatedProject,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("server error.");
    }
  },
  updateIssue: async function () {
    const { title, type, status, priority } = req.body;
    const issueId = req.query.id;
    if (!issueId) {
      issueId = req.params.id;
    }
    console.log(issueId);

    const data = await Issues.update({ id: issueId })
      .set({ title: title, type: type, status: status, priority: priority })
      .fetch();
    res.ok(data);
  },

  getOneIssues: async function (req, res) {
    try {
      const issueId = req.params.id;
      if (!issueId) {
        issueId = req.query.id;
      }
      console.log(issueId);

      const issue = await Issues.findOne({ id: issueId }).fetch();
      res.ok(
       
       issue,
      );
    } catch (error) {
      console.log(error);
      res.status(500).json("server error");
    }
  },
};
