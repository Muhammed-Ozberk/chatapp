/** DB Models */
const allModels = require("./../models");
const { Op } = require("sequelize");
const Users = allModels.Users;
const Rooms = allModels.Rooms;
const Messages = allModels.Messages;
const sequelize = require('../models/index').sequelize;
/** DB Models END */


module.exports = async (userID) => {
    const whereParam = [];
    const messageList = [];

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
    roomList.forEach(element => {
        whereParam.push(`'${element.room}'`)
    });

    const messages = await sequelize.query(`select * from messages where room in (${whereParam}) order by id desc`)

    const firstList = await sequelize.query(`select users.userID,room,username from users 
      inner join rooms  on
      users.userID = rooms.recipientID
      where rooms.userID = '${userID}'`);

    const secondList = await sequelize.query(`select users.userID,room,username from users 
      inner join rooms  on
      users.userID = rooms.userID
      where rooms.recipientID = '${userID}'`);


    for (let index = 0; index < firstList[0].length; index++) {
        var item = 0;
        var message = "";
        var data = null;
        for (let k = 0; k < messages[0].length; k++) {
            if (firstList[0][index].room == messages[0][k].room) {
                if (messages[0][k].userID == userID) {
                    data = {
                        userID: firstList[0][index].userID,
                        room: firstList[0][index].room,
                        username: firstList[0][index].username,
                        lastMsg: messages[0][k].message
                    }
                    break;
                } else if (messages[0][k].isRead == 0) {
                    if (message == "") {
                        message = messages[0][k].message;
                    }
                    item++;
                }
            }
        }
        if (data == null) {
            data = {
                userID: firstList[0][index].userID,
                room: firstList[0][index].room,
                username: firstList[0][index].username,
                lastMsg: message,
                messageQuantity: item
            }
        }
        messageList.push(data);
    }

    for (let index = 0; index < secondList[0].length; index++) {
        var item = 0;
        var message = "";
        var data = null;
        for (let k = 0; k < messages[0].length; k++) {
            if (secondList[0][index].room == messages[0][k].room) {
                if (messages[0][k].userID == userID) {
                    data = {
                        userID: secondList[0][index].userID,
                        room: secondList[0][index].room,
                        username: secondList[0][index].username,
                        lastMsg: messages[0][k].message
                    }
                    break;
                } else if (messages[0][k].isRead == 0) {
                    if (message == "") {
                        message = messages[0][k].message;
                    }
                    item++;
                }
            }
        }
        if (data == null) {
            data = {
                userID: secondList[0][index].userID,
                room: secondList[0][index].room,
                username: secondList[0][index].username,
                lastMsg: message,
                messageQuantity: item
            }
        }
        messageList.push(data);
    }
    return messageList;
}