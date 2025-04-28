export const authenticate = async () => {
    const [ , token] = bearer.split(" ")
        if(!token) {
            const error = new Error('Token no valido')
            res.status(401).json({ error: error.message})
            return
        }

        
        try {
            const decoded = jwt.verify(token, "Palabrasecreta")
            if(typeof decoded === 'object' && decoded.id) {
                const user = await User.findByPk(decoded.id, {
                    attributes: ['id', 'name', 'email']
                })
                res.json(user)
            }
            return
            
        } catch (error) {
            res.status(500).json({error: "Token no valido"})            
        }

}