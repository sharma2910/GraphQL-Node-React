const User = require('../../models/users');
const bcrypt = require('bcrypt');



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
}