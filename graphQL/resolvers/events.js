const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/users');

const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createEvent: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('not authenticated');
            }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: dateToString(args.eventInput.date),
                creator: req.userId
            });
            await event.save();
            const user = await User.findById(req.userId);
            user.createdEvents.push(event._id);
            await user.save();
            return transformEvent(event);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}