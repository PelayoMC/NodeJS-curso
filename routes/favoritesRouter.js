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
            .populate("user")
            .populate("comments")
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
    .delete(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Favorites.find({ author: req.user._id })
                .then(
                    (favorites) => {
                        Favorites.findByIdAndRemove({})
                            .then(
                                (resp) => {
                                    res.json(resp);
                                },
                                (err) => next(err)
                            )
                            .catch((err) => next(err));
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
