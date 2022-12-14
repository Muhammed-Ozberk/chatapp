var express = require('express');
var router = express.Router();

/** DB Models */
const allModels = require("./../models");
const Rooms = allModels.Rooms;
const Messages = allModels.Messages;
const Users = allModels.Users;
const sequelize = require('../models/index').sequelize;
const { Op } = require("sequelize");
/** DB Models END */

router.post('/message/save', async function (req, res, next) {
    const { room, message, recipientID } = req.body;
    const userID = req.session.passport.user.id;

    if (!room) {
        res.json({ status: false });
    } else if (!userID) {
        res.json({ status: false });
    } else if (!message) {
        res.json({ status: false });
    } else {
        try {
            //Creation of rooms when either party sends a message
            //Checking if the room exists
            const thereIsRoom = await Messages.findOne({
                where: {
                    room: room
                }
            });
            if (!thereIsRoom) {
                //Creating the room
                const savedRoom = await Rooms.create({
                    room,
                    userID,
                    recipientID,
                });
            }
            //Saving the message
            const recordedMessage = await Messages.create({
                room,
                userID,
                message,
            });
            if (recordedMessage) {
                res.json({
                    status: true,
                    data: recordedMessage
                })
            } else {
                res.json({ status: false });
            }
        } catch (error) {
            res.render('error', { message: error, error: { status: false, stack: error } });
        }
    }
});

router.post('/chats/read', async function (req, res, next) {
    const { roomID, recipientID } = req.body;
    if (!roomID) {
        res.json({ status: false });
    } else if (!recipientID) {
        res.json({ status: false });
    } else {
        try {
            //Recording instant message read receipts
            const updateMessages = await sequelize.query(`update messages 
            set isRead=true
            where room="${roomID}" and userID="${recipientID}"
          `);

            if (updateMessages) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
        } catch (error) {
            res.render('error', { message: error, error: { status: false, stack: error } });
        }
    }
});

router.get('/bring-contacts/:personToSearch', async function (req, res, next) {
    var { personToSearch } = req.params;
    let combining = /[\u0300-\u036F]/g;
    if (!personToSearch) {
        res.json({ status: false });
    } else {
        personToSearch = personToSearch.normalize('NFKD').replace(combining, '');
        try {

            const searchList = await Users.findAll({
                attributes: [
                    'userID',
                    'username',
                    'email',
                ],
                where: {
                    username: {
                        [Op.substring]: personToSearch,
                        [Op.ne]: req.session.passport.user.username
                    }
                }
            });
            if (searchList) {
                res.json({ persons: searchList });
            } else {
                res.json({ status: false });
            }
        } catch (error) {
            res.render('error', { message: error, error: { status: false, stack: error } });
        }
    }

});



module.exports = router;
