const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

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


router.post('/register-post',async (req, res, next) => {
    const viewPath = 'pages/register';
    // let { username, email, password } = req.body;
console.log(req.body.username);
    // if (typeof username === "undefined" || username === "" || username === null) {
    //     return res.render(viewPath, {
    //         status: false,
    //         error: { location: "body", errorCode: 4000, field: "username", message: "Username object required." }
    //     });
    // } else if (typeof email === "undefined" || email === "" || email === null) {
    //     return res.render(viewPath, {
    //         status: false,
    //         error: { location: "body", errorCode: 4000, field: "email", message: "Email object required." }
    //     });
    // } else if (typeof password === "undefined" || password === "" || password === null) {
    //     return res.render(viewPath, {
    //         status: false,
    //         error: { location: "body", errorCode: 4000, field: "password", message: "Password object required." }
    //     });
    // } else {
        try {
            
        } catch (error) {
            console.log(error);
        }
        uuidv4();
        res.render(viewPath, { status: true , message:"Kayıt başarıyla gerçekleşti"});
    // }
})




module.exports = router;