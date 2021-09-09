const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        next();
    })
    .get((req, res, next) => {
        res.end("Will send all the dishes to you!");
    })
    .post((req, res, next) => {
        res.end(
            "Will add the dish: " +
                req.body.name +
                " with details: " +
                req.body.description
        );
    })
    .put((req, res, next) => {
        req.statusCode = 403;
        res.end("PUT operation not supported on /dishes");
    })
    .delete((req, res, next) => {
        res.end("Deleting all dishes");
    });
// .get("/dishes/:dishId", (req, res, next) => {
//         res.end("Will send dish with id: " + req.params.dishId);
// })
// .post("/dishes/:dishId", (req, res, next) => {
//         req.statusCode = 403;
//         res.end("POST operation not supported on /dishes/" + req.params.dishId);
// })
// .put("/dishes/:dishId", (req, res, next) => {
//         res.write("Updating the dish with id: " + req.params.dishId);
//         res.end("Will update dish with id: " + req.params.dishId);
// })
// .delete("/dishes/:dishId", (req, res, next) => {
//         res.end("Will delete dish with id: " + req.params.dishId);
// });

module.exports = dishRouter;
