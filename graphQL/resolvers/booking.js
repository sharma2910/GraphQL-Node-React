const Booking = require('../../models/booking');
const { transformBooking } = require('./merge')

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args) => {
        const fetchedEvent = await Event.findById(args.eventId)
        const booking = new Booking({
            user: "60423db8cc97cb275ca8fc83",
            event: fetchedEvent._id
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err
        }
    }

}