import { NextFunction, Request, Response } from "express";
import { collections } from "../db";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const auth = {
    secret: String(process.env.SECRET),
    expires: '1h',
};
  

export default new class AuthController{

    async login(req: Request, res: Response){
        try{
            const {email, password} = req.body

            const userInfo = await collections.users.find({ email: email }).toArray()

            if(!userInfo[0]){
                return res.status(422).json({ msg: "user not found" })
            }

                if(userInfo[0]){
                    const match = await bcrypt.compare(password, userInfo[0].password);

                    if(match){
                        const token = await jwt.sign(
                            {
                            _id: userInfo[0]._id,
                            name: userInfo[0].name,
                            email: userInfo[0].email
                            },
                            auth.secret,
                            {
                            expiresIn: auth.expires,
                            }
                        );

                        res.status(200).json({token: token, id: userInfo[0]._id})

                    } else {
                        res.status(401).json({ msg: "Invalid Credentials" });
                    }
                } else {
                        res.json({ msg: "Invalid Credentials" });
                }
        } catch(e) {
            res.status(500).json({
                msg: 'something is wrong...'
            })
            console.log(e)
        }
    }

    async checkToken(req: Request, res: Response, next: NextFunction){
        try{
            const id = req.params.idUser
            const objectId = new ObjectId(id)
            let user

            const userInfo = await collections.users.find({ _id: objectId }).toArray()

            user = userInfo[0]

            try{
                const token = req.headers.authorization?.replace('Bearer ', '');
                const authorization = req.headers

                if (!token){
                    console.log(authorization)
                    return res.status(401).json({ msg: 'No token provided.' });
                } 

                let decoded

                if(typeof(jwt.verify(token, auth.secret)) == String.prototype){
                    decoded = JSON.parse(jwt.verify(token, auth.secret).toString())
                }else{
                    decoded = jwt.verify(token, auth.secret)
                }

                next()

            }catch(e){
                console.log(e)
                res.status(401).json({ msg: "invalid token" })
            }
        }catch(e){
            console.log(e)
            res.status(500).json({
                msg: "something is wrong..."
            })

        }
            
    } 
}