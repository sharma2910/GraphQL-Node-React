const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const app = express()
const mongoose = require('mongoose');
const graphqlSchema = require('./graphQL/Schema/index');
const graphqlResolvers = require('./graphQL/resolvers/index');

app.use(bodyParser.json());


app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));

mongoose.connect('mongodb://localhost:27017/events-react-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to MongoDB')
    app.listen(3000, () => {
        console.log(`Listening on Port 3000`);
    })
}).catch((err) => {
    console.log(err.message)
})

