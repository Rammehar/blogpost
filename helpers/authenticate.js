const passport = require('passport');

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/login');
}
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

module.exports = {checkAuthenticated,checkNotAuthenticated};
