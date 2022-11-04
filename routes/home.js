var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');


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

  const messageList = [];
  const firstList = await sequelize.query(`select users.userID,room,username from users 
  inner join rooms  on
  users.userID = rooms.recipientID
  where rooms.userID = '${userID}'`);

  const secondList = await sequelize.query(`select users.userID,room,username from users 
  inner join rooms  on
  users.userID = rooms.userID
  where rooms.recipientID = '${userID}'`);


  firstList[0].forEach(element => {
    messageList.push(element);
  });

  secondList[0].forEach(element => {
    messageList.push(element);
  });


  const roomList = await Rooms.findAll({
    attributes: [
      'room',
    ],
    where: {
      [Op.or]: [
        { userID: userID },
        { recipientID: userID }
      ]
    }
  });

  var data = {
    activePage,
    messageList
  };

  res.render('pages/chats', { title: "Chats", data });
});

router.get('/chats/:roomID/:recipientID', async function (req, res, next) {

  const userID = req.session.passport.user.id;
  const { roomID, recipientID } = req.params;
  var activePage = "chats";

  const messageList = [];
  const firstList = await sequelize.query(`select users.userID,room,username from users 
  inner join rooms  on
  users.userID = rooms.recipientID
  where rooms.userID = '${userID}'`);

  const secondList = await sequelize.query(`select users.userID,room,username from users 
  inner join rooms  on
  users.userID = rooms.userID
  where rooms.recipientID = '${userID}'`);


  firstList[0].forEach(element => {
    messageList.push(element);
  });

  secondList[0].forEach(element => {
    messageList.push(element);
  });


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
    messages
  };

  res.render('pages/chatsUser', { title: "Chats", data });
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
  const room = uuidv4();
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
    const savedRoom = await Rooms.create({
      room,
      userID,
      recipientID,
    });
    res.redirect(`/chats/${room}/${recipientID}`);
  } else {
    console.log(searchRoom);
    res.redirect(`/chats/${searchRoom.room}/${recipientID}`);
  }


  // if (room) {
  //   const savedRoom = await Rooms.create({
  //     room,
  //     userID,
  //     recipientID,
  //   });
  //   if (savedRoom) {
  //     res.redirect('/chats');
  //   } else {
  //     res.redirect('/contacts');
  //   }
  // } else {
  //   res.redirect('/contacts');
  // }
});


router.post('/message/save', async function (req, res, next) {
  const { room, message } = req.body;
  const userID = req.session.passport.user.id;

  if (!room) {
    res.json({ status: false });
  } else if (!userID) {
    res.json({ status: false });
  } else if (!message) {
    res.json({ status: false });
  } else {
    const recordedMessage = await Messages.create({
      room,
      userID,
      message
    });
    if (recordedMessage) {
      res.json({
        status: true,
        data: recordedMessage
      })
    } else {
      res.json({ status: false });
    }
  }

})


module.exports = router;
