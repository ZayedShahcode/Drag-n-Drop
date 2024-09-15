require('dotenv').config();
const express=require('express')
const cors = require('cors')
const session = require('express-session')
const cookieparser = require('cookie-parser');

const connectDB = require('./connect/connect')
const NotesRouter  = require('./routes/NotesRouter');
const userRouter = require('./routes/userRouter')

const app = express();


// app.use(cors());
app.use(cookieparser())
app.use(express.json());
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5173/notes'];

app.use((req, res, next) => {
    const origin = req.get('Origin');
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header('Access-Control-Allow-Origin', ''); // Or set to null if you prefer
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST,PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(204); // No content
        return;
    }

    next();
});
app.use('/notes',NotesRouter)
app.use('/users',userRouter)



const port = process.env.PORT

const start = async ()=>{
    await connectDB(process.env.MONGO_URL)
    app.listen(port,()=>{
        console.log("Server is listening");
    })

}
start();

