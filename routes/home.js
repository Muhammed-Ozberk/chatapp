var express = require('express');
var router = express.Router();
var createRoom = require('../socket');

/** DB Models */
const allModels = require("./../models");
const { Op } = require("sequelize");
const Users = allModels.Users;
const Rooms = allModels.Rooms;
const sequelize = require('../models/index').sequelize;
/** DB Models END */


router.get('/chats', async function (req, res, next) {

  const userID = req.session.passport.user.id;
  var activePage = "chats";

  const messageList = await sequelize.query(`select users.userID,username,room from users 
  inner join rooms on
  users.userID = rooms.recipientID `);
  console.log(messageList);
  

  var data = {
    activePage,
    messageList
  };

  res.render('pages/chats', { title: "Chats", data });
});

router.get('/contacts', async function (req, res, next) {

  var activePage = "contacts";
  var userList = [];
  var data = {
    activePage,
    userList
  };
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
  const room = createRoom(recipientID);
  if (room) {
    const savedRoom = await Rooms.create({
      room,
      userID,
      recipientID,
    });
    if (savedRoom) {
      res.redirect('/chats');
    } else {
      res.redirect('/contacts');
    }
  } else {
    res.redirect('/contacts');
  }
});


module.exports = router;
