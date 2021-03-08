const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type User{
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]!
}

input UserType{
    email: String!
    password: String!
}

type Event{
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

input EventType{
    title: String!
    description:String!
    price: Float!
    date: String!
}

type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
}

type RootMutation {
    createEvent(eventInput:EventType): Event
    createUser(userInput:UserType): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query:RootQuery
    mutation:RootMutation
}
`);