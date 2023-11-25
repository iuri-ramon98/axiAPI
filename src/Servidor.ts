/*

    Comandos do servidor

*/

import express, { Request, Response, ErrorRequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRotas from './routes/UsuarioRotas';
import equipamentoRotas from './routes/EquipamentoRotas';
import usuarioEquipamentoRotas from './routes/UsuarioEquipamentoRotas';
import fichaSaudeRotas from './routes/FichaSaudeRotas';
import cirurgiaRotas from './routes/CirurgiaRotas';
import consultaRotas from './routes/ConsultaRotas';
import medicamentoRotas from './routes/MedicamentoRotas';
import passport from 'passport';


dotenv.config();

const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.json());


server.use(passport.initialize());

server.get('/ping', (req: Request, res: Response) => res.json({ pong: true }));

server.use(usuarioRotas);
server.use(equipamentoRotas);
server.use(usuarioEquipamentoRotas);
server.use(fichaSaudeRotas);
server.use(cirurgiaRotas);
server.use(consultaRotas);
server.use(medicamentoRotas);


server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ status: "error", message: 'Endpoint não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(err.status){
        res.status(err.status);
    } else {
        res.status(400);
    }if(err.message){
        res.json({ status:err.status, message: err.message });
    } else{
        res.json({ status: "error", message: 'Ocorreu algum erro.' });
    }    
}
server.use(errorHandler);

server.listen(process.env.PORT);