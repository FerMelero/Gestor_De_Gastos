const express = require('express');
const { Resend } = require('resend')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 12
const { User, Transaccion } = require('../models');
require('dotenv').config();



const resend = new Resend(process.env.RESEND_API_KEY);
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

router.get('/inicio',autenticado, async(req, res) => {
    const ingresos = await Transaccion.findAll( {where: { usuarioID: req.session.usuario.id, tipo: 'I' }})
    const gastos = await Transaccion.findAll( {where: { usuarioID: req.session.usuario.id, tipo: 'G' }})

    let saldo = 0;

    for (let i = 0; i < ingresos.length; i++) {
        saldo += ingresos[i].importe;
    }

    for (let i = 0; i < gastos.length; i++) {
        saldo -= gastos[i].importe;
    }



    res.render('inicio', {saldo})
})

// crear un usuario si no existe ya ese usuario
router.post('/register', async(req, res) => {
    const { usuario, email, contraseña } = req.body
    const existeUser = await User.findOne({where : {username : usuario}})

    if(existeUser) {
        res.render('error', { message: 'Ya existe este usuario' })
    } else {
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
        await User.create({
            username: usuario,
            email,
            password: hashedPassword
        })
        try {
            const { data, error } = await resend.emails.send({
                from: 'Gestor de Gastos <onboarding@resend.dev>',
                to: ['serviciogestiongastos@gmail.com'],
                subject: '¡Bienvenido a Gestor de Gastos!',
                html: `<strong>Hola ${usuario}, tu cuenta ha sido creada correctamente.</strong>`
            });

            if (error) {
                console.error('Error al enviar email:', error);
            } else {
                console.log('Email enviado:', data);
            }
        } catch (err) {
            console.error('Error general al enviar email:', err);
            }
        
        res.redirect('/login')

    }
})

// logearse y asegurarse de que existe el user y la contraseña coincide
router.post('/login', async (req, res) => {
    const { usuario, contraseña } = req.body
    const existeUser = await User.findOne({ where: { username: usuario } })

    if (!existeUser) {
        return res.render('error', { message: 'No se ha podido encontrar el usuario' });
    }

    const coincide = await bcrypt.compare(contraseña, existeUser.password);
    if (coincide) {
        // Guardar solo los datos necesarios en sesión:
        req.session.usuario = {
            id: existeUser.id,
            username: existeUser.username,
            email: existeUser.email
        };

        res.redirect('/inicio');
    } else {
        res.render('error', { message: 'Nombre de usuario o contraseña incorrecta' });
    }
});


router.get('/ingresos/nuevo', async(req, res) => {
    console.log("Usuario en sesión:", req.session.usuario);
    res.render('ingresoNuevo')
})

router.post('/nuevoIngreso', async(req, res) => {
    const {descripcion, monto} = req.body

    if(monto <= 0){
        return res.render('error', { message: '¡El ingreso debe ser mayor a 0!' })
    }
    const fecha = new Date()
    const fechaISO = fecha.toISOString().split('T')[0]

    await Transaccion.create({
        tipo: 'I',
        descripcion,
        importe: monto,
        fecha: fechaISO,
        usuarioId: req.session.usuario.id  
});


    res.redirect('/inicio');
})

router.get('/gastos/nuevo', async(req, res) => {
    console.log("Usuario en sesión:", req.session.usuario);
    res.render('gastoNuevo')
})

router.post('/nuevoGasto', async(req, res) => {
    const {descripcion, monto} = req.body

    if(monto <= 0){
        return res.render('error', { message: '¡El gasto debe ser mayor a 0!' })
    }
    const fecha = new Date()
    const fechaISO = fecha.toISOString().split('T')[0]

    await Transaccion.create({
        tipo: 'G',
        descripcion,
        importe: (monto),
        fecha: fechaISO,
        usuarioId: req.session.usuario.id  
});


    res.redirect('/inicio');
})








module.exports = {router, autenticado, noAutenticado}
