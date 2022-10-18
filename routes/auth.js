const router = require('express').Router();


router.get('/login', (req, res, next) => {
    res.render('pages/login', { title: "Login" });
});

router.post('/login', (req, res, next) => {
    console.log(req.body);
    res.redirect('/login');
});



router.get('/register', (req, res, next) => {
    res.render('pages/register', { title: "Register" });
});


router.post('/register', (req, res, next) => {
    const viewPath = 'pages/register';
    let { username, email, password } = req.body;

    if (typeof username === "undefined" || username === "" || username === null) {
        return res.render(viewPath, {
            status: false,
            error: { location: "body", errorCode: 4000, field: "username", message: "username object required." }
        });
    } else if (typeof email === "undefined" || email === "" || email === null) {
        return res.render(viewPath, {
            status: false,
            error: { location: "body", errorCode: 4000, field: "email", message: "email object required." }
        });
    } else if (typeof password === "undefined" || password === "" || password === null) {
        return res.render(viewPath, {
            status: false,
            error: { location: "body", errorCode: 4000, field: "password", message: "password object required." }
        });
    } else {
        console.log(req.body);
        res.redirect('/register');
    }
})


module.exports = router;