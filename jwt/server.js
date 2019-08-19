const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 8888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const users = [
    { id: 1, username: "clarkKent", password: "superman" },
    { id: 2, username: "bruceWayne", password: "batman" }
];

app.get('/time', (req, res) => {
    const time = (new Date()).toLocaleTimeString();
    res.status(200).send(`The Time is ${time}`);
});
app.post("/login", (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send("Error. Please enter the correct username and password");
        return;
    }
    const user = users.find((u) => {
        return u.username === req.body.username && u.password === req.body.password;
    });
    if(!user){
        res.status(401).send("No user found with your creditals")
        return;
    }
    const token = jwt.sign({
        sub: user.id,
        username: user.username
      }, "mykey", {expiresIn: "3 hours"});
      res.status(200).send({access_token: token})
})

app.get("*", (req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});