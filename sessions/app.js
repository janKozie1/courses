const express = require('express')
const session = require('express-session')

const HOUR = 1000 * 60 * 60
const {
    PORT = 3000,
    NODE_EVN = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'zxcvQa?<>XCV!>}xxzcvs',
    SESS_LIFETIME = 2 * HOUR
} = process.env

const IN_PROD = NODE_EVN === 'development'

const users = [
    { id: 1, name: 'asdf1', email: 'asdf1@asdf.pl', password: 'secret1' },
    { id: 2, name: 'asdf2', email: 'asdf2@asdf.pl', password: 'secret2' },
    { id: 3, name: 'asdf3', email: 'asdf3@asdf.pl', password: 'secret3' },
    { id: 4, name: 'asdf4', email: 'asdf4@asdf.pl', password: 'secret4' },
]


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: false,
    }
}))
app.use((req,res,next)=>{
    const {userId} = req.session
    if(userId){
        res.locals.user = users.find(e=>e.id === req.session.userId)
    }
})

const redirectLogin = (req, res, next) => {

    if (!req.session.userId) {
        res.redirect("/login")
    } else {
        next()
    }
}
const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/home")
    } else {
        next()
    }
}

app.get("/", (req, res) => {
    const { userId } = req.session;
    console.log(req.session)
    res.send(`
        <h1>Welcome!</h1>
        ${userId ?
            `
            <a href='/home'>Home</a>
            <form method='post' action ='/logout'>
                <button>Logout</button>
            </form>`
            :
            `
            <a href='/login'>Login</a>
            <a href='/register'>Register</a>`
        }
        
    `)
})

app.get('/home', redirectLogin, (req, res) => {
    const user = users.find(e=>e.id === req.session.userId)
    res.send(`
        <h1>Home</h1>
        <a href="/">Main</a>
        <ul>
            <li>Name:${user.name}</li>
            <li>Email:${user.email}</li>
        </ul>
    `)
})

app.get('/profile',(req,res)=>{
    const user = users.find(e=>e.id === req.session.userId)
})

app.post('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err=>{
        if(err){
            return res.redirect('/home')
        }
    })
    res.clearCookie(SESS_NAME)
    res.redirect('/login')
})

app.route("/login")
    .get(redirectHome, (req, res) => {
        res.send(`
            <h1>Login</h1>
            <form method='post' action='/login'>
                <input type="email" name="email" placeholder="email" required/>
                <input type="password" name="password" placeholder="password" required/>
                <input type="submit"/>
            </form>
            <a href="/register">Register</a>
        `)
    })
    .post(redirectHome, (req, res) => {
        const { email, password } = req.body
        
        if (email && password) {
            const user = users.find(user => user.email === email && user.password === password)
            console.log(user)
            if (user) {
                req.session.userId = user.id
                console.log(req.session.userId)
                return res.redirect('/home')
            }
        }
        res.redirect('/login')
    })

app.route('/register')
    .get(redirectHome, (req, res) => {
        res.send(`
            <h1>Register</h1>
            <form method='post' action='/register'>
                <input type="text" name="name" placeholder="name"/>
                <input type="email" name="email" placeholder="email" required/>
                <input type="password" name="password" placeholder="password" required/>
                <input type="submit"/>
                <a href="/login">Login</a>
            </form>
        `)
    })
    .post(redirectHome, (req, res) => {
        const { name, email, password } = req.body
        if(name && email && password){
            const exist = users.some(e=>e.email === email)
            if(!exists){
                const user = {
                    id:users.length,
                    name,
                    email,
                    password
                }
                users = [...users,user]
                req.session.userId = user.id
                return res.redirect('/home')
            }
        }
        res.redirect('/register')
    })


app.listen(PORT, () => {
    console.log(PORT)
})