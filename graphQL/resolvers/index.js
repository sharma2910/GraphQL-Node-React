const Event = require('../../models/event');
const User = require('../../models/users');
const bcrypt = require('bcrypt');

const getUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user._id,
            createdEvents: getEvents.bind(this, user._doc.createdEvents)
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const getEvents = async (eventIDs) => {
    try {
        const events = await Event.find({
            _id: { $in: eventIDs }
        });
        return events.map(event => {
            return {
                ...event._doc,
                _id: event._id,
                creator: getUser.bind(this, event.creator),
                date: new Date(event._doc.date).toISOString()
            }
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    creator: getUser.bind(this, event._doc.creator),
                    date: new Date(event._doc.date).toISOString()
                }
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date).toISOString(),
                creator: "603f8eb50864ae655c169f6d"
            });
            await event.save();
            const user = await User.findById("603f8eb50864ae655c169f6d");
            user.createdEvents.push(event._id);
            await user.save();
            return {
                ...event._doc,
                _id: event._id,
                creator: getUser.bind(this, event._doc.creator),
                date: new Date(event._doc.date).toISOString()
            };
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
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
    }
}