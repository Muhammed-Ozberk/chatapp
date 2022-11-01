module.exports = (sequelize, DataTypes) => {
    var Messages = sequelize.define('Messages',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            room: DataTypes.STRING,
            userID: DataTypes.STRING,
            message: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }
    );
    return Messages;
};

//npx sequelize migration:create --name create-messages
//npx sequelize-cli --config=config/database.js db:migrate