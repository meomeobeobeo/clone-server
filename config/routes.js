/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'POST /users' : 'UsersController.create',

  //auth
  'POST /auth/signUp' : 'AuthController.signUp',
  'POST /auth/signIn' : 'AuthController.signIn',

  //user
  'PATCH /users/changeInfo' : "UsersController.changePassword",

  


  //projects
  'GET /projects/:currentUser' : 'ProjectsController.getAllProjectsHaveAdminId',
  'POST /projects' : 'ProjectsController.createProject',
  'PATCH /projects/update' : 'ProjectsController.updateProject',
  'GET /projects/detail/:id' : 'ProjectsController.getProjectById',


  //issues 
  'POST /issues/create/:project_id' : 'IssuesController.createNewIssue',
  'DELETE /issues' : 'IssuesController.deleteIssue',
  'PATCH /issues/:id' : 'IssuesController.updateIssue',
  'GET /issues/:id' : 'IssuesController.'
 
  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
