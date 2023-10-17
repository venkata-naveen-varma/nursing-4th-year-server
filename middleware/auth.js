const auth = (req, res, next) => {
    try {
        if(!req.session.user){
            return res.status(400).json({message: "Login required"});
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export default auth;
