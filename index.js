const express = require('express')
require('./db/mongoose')
const app = express()
const cookieParser = require('cookie-parser')

const adminRouter = require('./routers/admin')
const userRouter = require('./routers/user')

const PORT = process.env.PORT || 8000

app.use(express.json())

app.use(cookieParser())
app.use(express.urlencoded({ extended: true}));
app.use('/admin', adminRouter)
app.use('/users', userRouter)

if (process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname,  "build", "index.html"));
      });
}

app.listen(PORT, () => console.log(`Server is at ${PORT}`))