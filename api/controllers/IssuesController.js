/**
 * IssuesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createNewIssue: async function (req, res) {
    try {
      const {
        title,
        type,
        priority,
        status,
        userCreateId,
        description,
        reporterId,
        assigneesId,
        expireTime,
      } = req.body;

      const projectId = req.params.project_id;
      if (!projectId) {
        projectId = req.query.project_id;
      }
      const newIssue = await Issues.create({
        title: title,
        type: type,
        priority: priority,
        project_id: projectId,
        status: status,
        userCreateId: userCreateId,
        description: description,
        reporterId: reporterId,
        assigneesId: [...assigneesId],
        expireTime: expireTime,
      }).fetch();

      const currentProject = await Projects.findOne({ id: projectId });
      const listIssue = currentProject?.issues;
      listIssue.push(newIssue.id);
      console.log(listIssue);
      const updatedProject = await Projects.update({ id: projectId })
        .set({ issues: listIssue })
        .fetch();

      const listIssesId = updatedProject[0].issues;
      const listUserId = updatedProject[0].users;

      // get issue infor
      const issuesData = await Issues.find({ id: { in: listIssesId } });
      // get list user infor
      const userListInfor = await Users.find({ id: { in: listUserId } });
      const userListResult = userListInfor.map((user) => {
        return {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        };
      });

      const projectReturn = {
        ...updatedProject[0],
        issues: issuesData,
        users: userListResult,
      };
      console.log(projectReturn);

      res.ok({
        message: "create new issue success ",
        newIssues: newIssue,
        updatedProject: projectReturn,
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

      const listIssesId = updatedProject[0].issues;
      const listUserId = updatedProject[0].users;

      // get issue infor
      const issuesData = await Issues.find({ id: { in: listIssesId } });
      // get list user infor
      const userListInfor = await Users.find({ id: { in: listUserId } });
      const userListResult = userListInfor.map((user) => {
        return {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        };
      });

      console.log("issuesID  : " + issueId);
      await Issues.destroy({ id: issueId });
      console.log({
        ...updatedProject[0],
        issues: issuesData,
        users: userListResult,
      });
      res.ok({
        message: "delete issue successfully",
        updatedProject: {
          ...updatedProject[0],
          issues: issuesData,
          users: userListResult,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("server error.");
    }
  },
  updateIssue: async function (req, res) {
    const { title, type, status, priority, description } = req.body;
    let issueId = req.query.id;
    if (!issueId) {
      issueId = req.params.id;
    }
    console.log(issueId);

    const data = await Issues.update({ id: issueId })
      .set({
        title: title,
        type: type,
        status: status,
        priority: priority,
        description: description,
      })
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
      res.ok(issue);
    } catch (error) {
      console.log(error);
      res.status(500).json("server error");
    }
  },
  filterIssue: async function (req, res) {
    const searchText = req.query?.searchText;
    const userIds = req.query?.userIds;
    const limit = req.query?.limit;
    const isCurrent = req.query?.isCurrent;
    const projectId = req.query?.projectId;
    console.log(userIds);
    const currentTimeMinus1Hour = new Date(Date.now() - 60 * 60 * 1000); // time ago
    const whereCondition = {
      or: [
        { title: { contains: searchText } },
        { description: { contains: searchText } },
      ],
      project_id: projectId,
    };
    if (isCurrent === "true") {
      whereCondition.updatedAt = { ">=": currentTimeMinus1Hour };
    }

    try {
      const dataFind = await Issues.find({
        limit: limit,
        where: whereCondition,
        sort: "createdAt DESC",
      });
      console.log(typeof(userIds[0]))
      

      const dataFilterWithListUserId = dataFind.filter((issue) => {
        let assigneesArr = issue?.assigneesId;
      
        for (let index = 0; index < assigneesArr.length; index++) {
          for (let index2 = 0; index2 < userIds.length; index2++) {
            if(assigneesArr[index] === userIds[index2]) {
              return true;
            }
            
          }
          return false;
        }
        

       

        return false;
      });
      console.log(dataFilterWithListUserId);
      // const dataFilterWithUserIds = dataFind.filter(issue => {

      //   const check = true
      //   userIds.forEach(userId => {
      //     if(!(issue.assigneesId.includes(userId))){
      //       check = false
      //     }
      //   })
      //   return check
      // })

      res.ok(dataFind);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
