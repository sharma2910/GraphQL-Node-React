const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
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
    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: dateToString(args.eventInput.date),
                creator: "60423db8cc97cb275ca8fc83"
            });
            await event.save();
            const user = await User.findById("60423db8cc97cb275ca8fc83");
            user.createdEvents.push(event._id);
            await user.save();
            return transformEvent(event);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}