const express = require('express')
const app = express()
require('dotenv').config();
const port = 3000

const path = require('path')
const sequelize = require('./database/database')
const session = require('express-session')
const { router } = require('./routes/auth')

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



// Conexión a la base de datos
async function connectionDB() {
    try {
        await sequelize.authenticate()
        console.log('Conexión establecida correctamente.')
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error)
    }
}

// Sincronizar modelos
async function syncDB() {
    console.log('Sincronizando DB...')
    await sequelize.sync({ force: false })
    console.log("Todos los modelos se han sincronizado.")
}



app.use('/', router)

app.use((req, res) => {
    res.status(404).render('error', { message: 'Página no encontrada' })
})




// verificar la conexión y sincronización con la BD
app.listen(port, () => {
    connectionDB()
    syncDB()
    console.log(`Servidor escuchando en http://localhost:${port}`)
})

