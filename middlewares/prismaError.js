
module.exports = function (err, req, res, next) {
    console.error("Errore del Prisma Client:", err);

    // Restituisci uno stato HTTP 500 con un messaggio di errore
    res.status(500).json({ error: "Internal server error" });
};