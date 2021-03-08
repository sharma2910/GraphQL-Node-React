const User = require('../../models/users');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');

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
            return transformEvent(event);
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const getEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err;
    }
}

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event._id,
        creator: getUser.bind(this, event.creator),
        date: dateToString(event._doc.date)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking._id,
        user: getUser.bind(this, booking._doc.user),
        event: getEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    };
}

module.exports = {
    transformBooking,
    transformEvent
}