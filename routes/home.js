var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

const chatList = require('../helpers/listFunction');


/** DB Models */
const allModels = require("./../models");
const { Op } = require("sequelize");
const Users = allModels.Users;
const Rooms = allModels.Rooms;
const Messages = allModels.Messages;
const sequelize = require('../models/index').sequelize;
/** DB Models END */


router.get('/chats', async function (req, res, next) {

  const userID = req.session.passport.user.id;
  var activePage = "chats";

  //call up chat list
  var messageList = await chatList(userID);

  var data = {
    activePage,
    messageList,
  };

  res.render('pages/chats', { title: "Chats", data });
});

router.get('/chats/:roomID/:recipientID', async function (req, res, next) {

  const userID = req.session.passport.user.id;
  const { roomID, recipientID } = req.params;
  var activePage = "chats";

  //Changing messages to read
  const updateMessages = await sequelize.query(`update messages 
      set isRead=true
      where room="${roomID}" and userID="${recipientID}"
  `)

  //call up chat list
  var messageList = await chatList(userID);

  //Messages in chat
  const messages = await Messages.findAll({
    attributes: [
      'room',
      'userID',
      'message',
      'createdAt'
    ],
    where: {
      room: roomID
    },
    order: [
      ['id', 'ASC'],
    ]
  });

  var data = {
    activePage,
    messageList,
    roomID,
    recipientID,
    userID,
    messages,
  };

  res.render('pages/chats', { title: "Chats", data });
});

router.get('/contacts', async function (req, res, next) {

  var activePage = "contacts";
  var userList = [];

  try {
    const users = await Users.findAll({
      attributes: [
        'userID',
        'username',
        'email',
      ],
      where: {
        username: {
          [Op.ne]: req.session.passport.user.username
        }
      },
      order: [
        ['username', 'ASC'],
      ]
    });

    if (users) {
      users.forEach(element => {
        userList.push(element);
      });
      var data = {
        activePage,
        userList
      };
      res.render('pages/contacts', { title: "Contacts", data });
    } else {
      res.render('pages/contacts', { title: "Contacts", error: "Bilinmeyen bir hata oluştu" });
    }

  } catch (error) {
    res.render('pages/contacts', { title: "Contacts", error: "Bilinmeyen bir hata oluştu" });
  }

});

router.get('/groups', function (req, res, next) {

  var activePage = "groups";

  var data = {
    activePage,
  };
  res.render('pages/groups', { title: "Groups", data });
});

router.get('/profile', function (req, res, next) {

  var user = req.session.passport.user;
  var username = user.username;
  var email = user.email;
  var activePage = "profile";

  var data = {
    activePage,
    username,
    email
  };

  res.render('pages/profile', { title: "Profile", data });
});

router.get('/settings', function (req, res, next) {

  var activePage = "settings";

  var data = {
    activePage,
  };
  res.render('pages/settings', { title: "Settings", data });
});

router.get('/contacts/:recipientID', async function (req, res, next) {
  const recipientID = req.params.recipientID;
  const userID = req.session.passport.user.id;
  const room = uuidv4();

  //Checking if such a room has been created before
  const searchRoom = await Rooms.findOne({
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            { userID: userID },
            { recipientID: recipientID }
          ]
        },
        {
          [Op.and]: [
            { userID: recipientID },
            { recipientID: userID }
          ]
        }
      ]
    }
  });

  if (!searchRoom) {
    res.redirect(`/chats/${room}/${recipientID}`);
  } else {
    console.log(searchRoom);
    res.redirect(`/chats/${searchRoom.room}/${recipientID}`);
  }

});


module.exports = router;
