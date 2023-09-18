function myRoute(app) {
    app.use((req, res, next) => {
        res.cookie('animal1', 'catsdadadsa', { httpOnly: true })
        res.cookie('animal2', 'moosh', { httpOnly: true })
        next()
    });
}

module.exports = { myRoute };
