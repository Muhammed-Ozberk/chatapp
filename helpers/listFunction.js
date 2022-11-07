/** DB Models */
const allModels = require("./../models");
const { Op } = require("sequelize");
const Rooms = allModels.Rooms;
const sequelize = require('../models/index').sequelize;
/** DB Models END */


module.exports = async (userID) => {
    const whereParam = [];
    const messageList = [];

    //the logged in user list of created chat rooms
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

    if (roomList.length != 0) { //null error fix

        //Creating the query parameter required to fetch the message list
        roomList.forEach(element => {
            whereParam.push(`'${element.room}'`)
        });

        //Messages from chat rooms brought
        const messages = await sequelize.query(`select * from messages where room in (${whereParam}) order by id desc`);


        //User information of the brought chat rooms
        const firstList = await sequelize.query(`select users.userID,room,username from users 
          inner join rooms  on
          users.userID = rooms.recipientID
          where rooms.userID = '${userID}'`);

        const secondList = await sequelize.query(`select users.userID,room,username from users 
          inner join rooms  on
          users.userID = rooms.userID
          where rooms.recipientID = '${userID}'`);

        //Creating the chat list by combining the messages and user information with the rooms
        for (let index = 0; index < firstList[0].length; index++) {
            var item = 0;
            var message = "";
            var data = null;
            for (let k = 0; k < messages[0].length; k++) {
                if (firstList[0][index].room == messages[0][k].room) {
                    if (messages[0][k].userID == userID && message == "") {
                        data = {
                            userID: firstList[0][index].userID,
                            room: firstList[0][index].room,
                            username: firstList[0][index].username,
                            lastMsg: messages[0][k].message
                        }
                        break;
                    } else {
                        if (message == "") {
                            message = messages[0][k].message;
                        }
                        if (messages[0][k].isRead == 0) {
                            item++;
                        }
                    }
                }
            }
            if (message != "") {
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
                    if (messages[0][k].userID == userID && message == "") {
                        data = {
                            userID: secondList[0][index].userID,
                            room: secondList[0][index].room,
                            username: secondList[0][index].username,
                            lastMsg: messages[0][k].message
                        }
                        break;
                    } else {
                        if (message == "") {
                            message = messages[0][k].message;
                        }
                        if (messages[0][k].isRead == 0) {
                            item++;
                        }
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
    }
    //Created chat list
    return messageList;
}