module.exports = (sequelize, DataTypes) => {
    var Rooms = sequelize.define('Rooms',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            room: DataTypes.STRING,
            userID: DataTypes.STRING,
            recipientID: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }
    );

    return Rooms;
};

//npx sequelize migration:create --name create-rooms
//npx sequelize-cli --config=config/database.js db:migrate