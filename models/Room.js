module.exports = (sequelize, DataTypes) => {
    var Users = sequelize.define('Rooms',
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

    return Users;
};

//npx sequelize migration:create --name create-rooms
//npx sequelize-cli --config=config/database.js db:migrate