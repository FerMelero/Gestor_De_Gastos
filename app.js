const express = require('express')
const app = express()
require('dotenv').config();
const port = 3000

const path = require('path')
const sequelize = require('./database/database')
const session = require('express-session')
const { router } = require('./routes/auth')
const { User, Transaccion } = require('./models');

app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Middlewares
app.use(express.json())
app.use(express.urlencoded ({extended : false}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'vistas'))



app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente.');
        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados.');
        console.log(`Servidor escuchando en http://localhost:${port}`);
    } catch (err) {
        console.error('Error al iniciar:', err);
    }
});


app.use('/', router)

app.use((req, res) => {
    res.status(404).render('error', { message: 'Página no encontrada' })
})
