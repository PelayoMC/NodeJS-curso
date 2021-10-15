const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var authenticate = require("../authenticate");
var cors = require("./cors");
const Promotions = require("../models/promotions");
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// promoES
promoRouter
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
        Promotions.find({})
            .then(
                (promos) => {
                    res.json(promos);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Promotions.create(req.body)
                .then(
                    (promo) => {
                        console.log("Leaders created: ", promo._id);
                        res.json(promo);
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
            res.end("PUT operation not supported on /promos");
        }
    )
    .delete(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Promotions.remove({})
                .then(
                    (resp) => {
                        res.json(resp);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    );

// promo WITH ID
promoRouter
    .route("/:promoId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then(
                (promo) => {
                    res.json(promo);
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
                "POST operation not supported on /promos/" + req.params.promoId
            );
        }
    )
    .put(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Promotions.findByIdAndUpdate(
                req.params.promoId,
                { $set: req.body },
                { new: true }
            )
                .then(
                    (promo) => {
                        res.json(promo);
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
            Promotions.findByIdAndRemove(req.params.promoId)
                .then(
                    (resp) => {
                        res.json(resp);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    );

module.exports = promoRouter;
