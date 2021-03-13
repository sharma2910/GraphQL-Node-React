const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = {
    createUser: async (args) => {
        try {
            const exsistingUser = await User.findOne({ email: args.userInput.email });
            if (exsistingUser) throw new Error('User with Email exist');
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            await user.save();
            return { ...user._doc, password: null, _id: user._id };
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) throw new Error('User does not exist!');
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) throw new Error('Password is incorrect');
            const token = jwt.sign({ userId: user._id, email: user.email }, 'some', {
                expiresIn: '1h'
            });
            return {
                userID: user._id,
                token: token,
                tokenExpiration: 1
            }
        }
        catch (err) {
            throw err;
        }
    }
}