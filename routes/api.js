var express = require('express');
var router = express.Router();

/** DB Models */
const allModels = require("./../models");
const Rooms = allModels.Rooms;
const Messages = allModels.Messages;
const sequelize = require('../models/index').sequelize;
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
    }

});

router.post('/chats/read', async function (req, res, next) {
    const { roomID, recipientID } = req.body;
    if (!roomID) {
        res.json({ status: false });
    } else if (!recipientID) {
        res.json({ status: false });
    } else {

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
    }
});

module.exports = router;
