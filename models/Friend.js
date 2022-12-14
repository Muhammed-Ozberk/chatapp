module.exports = (sequelize, DataTypes) => {
    var Friends = sequelize.define('Friends',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            firstUserID: DataTypes.STRING,
            firstUserName: DataTypes.STRING,
            secondUserID: DataTypes.STRING,
            secondUserName: DataTypes.STRING,
            isFriend: DataTypes.BOOLEAN,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }
    );
    return Friends;
};

//npx sequelize migration:create --name create-rooms
//npx sequelize-cli --config=config/database.js db:migrate