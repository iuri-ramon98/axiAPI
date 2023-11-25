/*

    Arquivo de configuração do passport

*/

import { Request, Response, NextFunction } from 'express';
import passport from "passport";
import dotenv from 'dotenv';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuarios'

dotenv.config();

const JsonNaoAutorizado = { status: 401, message: 'Não autorizado' };
const opcoes = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}

passport.use(new JWTStrategy(opcoes, async (payload, done) =>{
    const usuario = await Usuario.findByPk(payload.id);
    if (usuario){
        return done(null, usuario);
    }else{
        return done(JsonNaoAutorizado, false);
    }
}));

//gerador de token 
export const gerarToken = (data: object) => {
    return jwt.sign(data, process.env.JWT_SECRET as string);
}

//middleware de rota privada
export const RotaPrivada = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (err, usuario) =>{
        req.user = usuario.usuario_id;
        return usuario ? next() : next(JsonNaoAutorizado);
    })(req, res, next);
}

export default passport;