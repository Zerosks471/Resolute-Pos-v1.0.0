const { getUserDB } = require("../services/user.service");
const { verifyToken } = require("../utils/jwt")
const { ROLES } = require("../config/user.config");

exports.isLoggedIn = (req, res, next) => {
    let token;

    if(req.cookies.accessToken || 
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    ) {
        token = req.cookies.accessToken || req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Login to access this area!"
        });
    }
    req.token = token;
    next();
} 

exports.isAuthenticated = (req, res, next) => {
    const accessToken = req.token;
    
    try {
        const decodedToken = verifyToken(accessToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized access!"
        });
    }
} 

exports.hasRefreshToken = (req, res, next) => {
    let token;

    if(req.cookies.refreshToken) {
        token = req.cookies.refreshToken;
    }

    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Login again to access this area!"
        });
    }
    try {
        const decodedToken = verifyToken(token);
        req.user = decodedToken;

        next();
    } catch (error) {
        console.error(error);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('resolutepos__authenticated');

        return res.status(401).json({
            success: false,
            message: "Unauthorized access!"
        });
    }
} 

exports.authorize = (requiredScopes) => {
    return async (req, res, next) => {
        try {
            const {username, scope: userScopes} = req.user;
        
            const user = await getUserDB(username);

            if(!user) {
                return res.status(401).json({
                    success: false, 
                    message: "Access denied!"
                });
            }

            if(user.role == ROLES.ADMIN) {
                return next();
            }

            if(user.scope != userScopes) {
                return res.status(403).json({
                    success: false, 
                    message: "Forbidden! Access Denied!"
                });
            }

            const userScopesArr = user?.scope?.split(",")?.map(s=>s.trim());

            const isOperationAllowed = requiredScopes.some((scope)=>userScopesArr.includes(scope));

            // let isOperationAllowed = false;

            // for (const requiredScope of requiredScopes) {
            //     const isAllowed = userScopesArr.includes(requiredScope);
            //     if(isAllowed) {
            //         isOperationAllowed = true;
            //         break;
            //     }
            // }

            if(!isOperationAllowed) {
                return res.status(403).json({
                    success: false, 
                    message: "Forbidden! Access Denied!"
                });
            }
            next();

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong! try later!"
            });
        }
    };
}