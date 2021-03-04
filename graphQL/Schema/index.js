const { buildSchema } = require('graphql');

module.exports = buildSchema(`
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
}

type RootMutation {
    createEvent(eventInput:EventType): Event
    createUser(userInput:UserType): User
}

schema {
    query:RootQuery
    mutation:RootMutation
}
`);