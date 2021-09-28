const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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
    .get((req, res, next) => {
        Promotions.find({})
            .then(
                (promos) => {
                    res.json(promos);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Promotions.create(req.body)
            .then(
                (promo) => {
                    console.log("Leaders created: ", promo._id);
                    res.json(promo);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        req.statusCode = 403;
        res.end("PUT operation not supported on /promos");
    })
    .delete((req, res, next) => {
        Promotions.remove({})
            .then(
                (resp) => {
                    res.json(resp);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

// promo WITH ID
promoRouter
    .route("/:promoId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then(
                (promo) => {
                    res.json(promo);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(
            "POST operation not supported on /promos/" + req.params.promoId
        );
    })
    .put((req, res, next) => {
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
    })
    .delete((req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
            .then(
                (resp) => {
                    res.json(resp);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

module.exports = promoRouter;
