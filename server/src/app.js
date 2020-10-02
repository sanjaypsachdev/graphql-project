const express = require("express")
const { graphqlHTTP } = require('express-graphql');

const app = express()

app.use('/graphql', graphqlHTTP({
  graphiql: true
}))

const port = 4000

app.listen(port, () => {
  console.log(`Listening for requests on port ${port}`)
})