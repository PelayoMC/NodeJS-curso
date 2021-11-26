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
            .populate("dishes")
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
            req.body.user = req.user._id;
            Favorites.create(req.body)
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
            Favorites.find({ user: req.user._id })
                .then(
                    (favorites) => {
                        let ids = favorites.map((e) => e._id);
                        Favorites.deleteMany({
                            _id: { $in: ids },
                        })
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
    .get(cors.cors, (req, res, next) => {
        Favorites.findById(req.params.favoriteId)
            .populate("user")
            .populate("dishes")
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
            Favorites.findOne({ user: req.user._id })
                .then((favorite) => {
                    favorite.dishes.push(req.params.favoriteId);
                    favorite.save().then(
                        (fav) => {
                            Favorites.findById(fav._id)
                                .populate("user")
                                .populate("dishes")
                                .then((f) => {
                                    res.json(f);
                                });
                        },
                        (err) => next(err)
                    );
                    res.json(favorite);
                })
                .catch((err) => next(err));
        }
    )
    .delete(
        cors.corsWithOptions,
        [authenticate.verifyUser, authenticate.verifyAdmin],
        (req, res, next) => {
            Favorites.findOne({ user: req.user._id })
                .then((favorite) => {
                    favorite.dishes = favorite.dishes.filter(
                        (e) => e !== req.params.favoriteId
                    );
                    favorite.save().then(
                        (fav) => {
                            Favorites.findById(fav._id)
                                .populate("user")
                                .populate("dishes")
                                .then((f) => {
                                    res.json(f);
                                });
                        },
                        (err) => next(err)
                    );
                    res.json(favorite);
                })
                .catch((err) => next(err));
        }
    );

module.exports = favoriteRouter;
