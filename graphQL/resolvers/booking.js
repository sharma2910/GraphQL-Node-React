const Booking = require('../../models/booking');
const { transformBooking } = require('./merge')

module.exports = {
    bookings: async (args,req) => {
        try {
            if(!req.isAuth){
                throw new Error('not authenticated');
            }
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args,req) => {
        if(!req.isAuth){
            throw new Error('not authenticated');
        }
        const fetchedEvent = await Event.findById(args.eventId)
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent._id
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args,req) => {
        try {
            if(!req.isAuth){
                throw new Error('not authenticated');
            }
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err
        }
    }

}