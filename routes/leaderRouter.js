const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var authenticate = require("../authenticate");
var cors = require("./cors");
const Leaders = require("../models/leaders");
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// LEADERS
leaderRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Leaders.find({})
            .then(
                (leaders) => {
                    res.json(leaders);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Leaders.create(req.body)
                .then(
                    (leader) => {
                        console.log("Leaders created: ", leader._id);
                        res.json(leader);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    )
    .put(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            req.statusCode = 403;
            res.end("PUT operation not supported on /leaders");
        }
    )
    .delete(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Leaders.remove({})
                .then(
                    (resp) => {
                        res.json(resp);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    );

// LEADER WITH ID
leaderRouter
    .route("/:leaderId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then(
                (leader) => {
                    res.json(leader);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            res.statusCode = 403;
            res.end(
                "POST operation not supported on /leaders/" +
                    req.params.leaderId
            );
        }
    )
    .put(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Leaders.findByIdAndUpdate(
                req.params.leaderId,
                { $set: req.body },
                { new: true }
            )
                .then(
                    (leader) => {
                        res.json(leader);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    )
    .delete(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Leaders.findByIdAndRemove(req.params.leaderId)
                .then(
                    (resp) => {
                        res.json(resp);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    );

module.exports = leaderRouter;
