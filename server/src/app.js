const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const cors = require('cors')

const schema = require('./schema/schema')
const testSchema = require('./schema/types_schema')

const app = express()

const port = process.env.PORT
const user = process.env.DB_USER
const password = process.env.DB_PASS
const host = process.env.DB_HOST
const dbname = process.env.DB_NAME
const dbConnStr =  `mongodb+srv://${user}:${password}@${host}/${dbname}?retryWrites=true&w=majority`

mongoose.connect(dbConnStr, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', () => {
  console.log('Connected to mongodb')
})

app.use(cors())

app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: schema
}))

app.listen(port, () => {
  console.log(`Listening for requests on port ${port}`)
})