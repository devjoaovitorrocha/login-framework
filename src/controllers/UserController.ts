import { Request, Response } from "express";
import { collections, connectToDatabase } from "../db";
import bcrypt from 'bcrypt'


export default new class UserConttroller{

    async register(req: Request, res: Response){
        try{
            const {name, email, password} = req.body

            //Validations

            if(!name || !email || !password){
                return res.status(422).json({ msg: "something is null..."})
            }

            const userExists = await collections.users.find({ email: email }).toArray()

            if(userExists[0]){
                return res.status(422).json({ msg: "this user is already registered" })
            }

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            try{
                collections.users.insertOne({
                    name,
                    email, 
                    password: passwordHash
                }).then(() =>{
                    res.status(201).json({ msg: "user registered"})
                })

            } catch(err){

                console.log(err)

                res.status(500).json({ msg: "Server error, contact the support"})
            }  
        }catch(err){
            res.status(500).json({msg: 'Sorry, there is something wrong...'})
            console.log(err)
        }
    }
}