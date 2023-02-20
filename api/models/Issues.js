/**
 * Issues.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title : {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      isIn : ['task','story','bug'],
      defaultsTo: 'task'

    },
    status:{
      type: 'string',
      isIn : ['backlog','done','selected','inprogress'],
      defaultsTo: 'backlog'
    },
    priority :{
      type : 'string',
      required: true,
      isIn : ['1','2','3','4','5'],
    },
    project_id :{
      type : 'string',
      required: true,
    },
    userCreateId : {
      type : 'string',
      required: true,
    },
    reporterId : {
      type: 'string',
    },
    description : {
      type: 'string',
    },
    assigneesId : {
      type :'ref',
      defaultsTo: []
    },
    expireTime : {
      type :'string',
    },
    isExpire : {
      type :'boolean',
      defaultsTo: false
    }
    




    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

