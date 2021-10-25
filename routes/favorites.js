const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var authenticate = require("../authenticate");
var cors = require("./cors");
const Favorites = require("../models/favorites");
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

// Favorites
favoriteRouter
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
        Favorites.find({})
            // Cuando obtengamos los favorites, los autores del comentario se obtendran del schema de usuarios
            .populate("comments.author")
            .then(
                (favorites) => {
                    res.json(favorites);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Favorites.create(req.body)
                .then(
                    (favorite) => {
                        console.log("Favorite created: ", favorite._id);
                        res.json(favorite);
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
            res.end("PUT operation not supported on /favorites");
        }
    )
    .delete(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Favorites.remove({})
                .then(
                    (resp) => {
                        res.json(resp);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    );

// Favorites with id
favoriteRouter
    .route("/:favoriteId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Favorites.findById(req.params.favoriteId)
            .populate("comments.author")
            .then(
                (favorite) => {
                    res.json(favorite);
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
                "POST operation not supported on /favorites/" +
                    req.params.favoriteId
            );
        }
    )
    .put(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Favorites.findByIdAndUpdate(
                req.params.favoriteId,
                { $set: req.body },
                { new: true }
            )
                .then(
                    (favorite) => {
                        res.json(favorite);
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
            Favorites.findByIdAndRemove(req.params.favoriteId)
                .then(
                    (resp) => {
                        res.json(resp);
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        }
    );

module.exports = favoriteRouter;
