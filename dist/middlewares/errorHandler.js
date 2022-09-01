export default function errorHandlingMiddleware(error, req, res, next) {
    if (error.name === "Not Found") {
        return res.status(404).send(error.message);
    }
    if (error.name === "Already Exists" || error.name === "Insufficient Funds" || error.name === "Blocked" || error.name === "Diferent Types" || error.name === "Wrong CVC" || error.name === "Not Allowed" || error.name === "Wrong Password" || error.name === "Not Active" || error.name === "Expired") {
        return res.status(400).send(error.message);
    }
    return res.sendStatus(500);
}
