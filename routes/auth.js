const express = require('express');
const router = express.Router()
const user = require('../models/user')
const bcrypt = require('bcrypt')
const saltRounds = 12

function autenticado(req, res, next) {
    if(req.session.usuario) {
        next()
    } else {
        res.render('error', {message : 'Acceso denegado'})
    }
}

function noAutenticado(req, res, next) {
    if (!req.session.usuario) {
        next()
    } else {
        res.redirect('/inicio') 
    }
}

// asegurarse de que puede ver el usuario
router.get('/',noAutenticado, (req, res) => {
    res.render('login')
})

router.get('/login',noAutenticado, (req, res) => {
    res.render('login')
})

router.get('/register',noAutenticado, (req, res) => {
    res.render('register')
})

router.get('/inicio',autenticado, (req, res) => {
    res.render('inicio')
})

// crear un usuario si no existe ya ese usuario
router.post('/register', async(req, res) => {
    const { usuario, email, contraseña } = req.body
    const existeUser = await user.findOne({where : {username : usuario}})

    if(existeUser) {
        res.render('error', { message: 'Ya existe este usuario' })
    } else {
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
        await user.create({
            username: usuario,
            email,
            password: hashedPassword
        })
        res.redirect('/login')

    }
})

// logearse y asegurarse de que existe el user y la contraseña coincide
router.post('/login', async(req, res) => {
    const { usuario, contraseña } = req.body
    const existeUser = await user.findOne({where : {username:usuario}})

    if(!existeUser) {
        return res.render('error', { message: 'No se ha podido encontrar el usuario' }) // manejar errores
    } 

    const coincide = await bcrypt.compare(contraseña, existeUser.password);
        if (coincide) {
            req.session.usuario = existeUser;
            res.redirect('/inicio');
        } else {
            res.render('error', { message: 'Nombre de usuario o contraseña incorrecta' });
        }

    
})






module.exports = {router, autenticado, noAutenticado}
