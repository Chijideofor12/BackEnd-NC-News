const express = require("express");
const { getUsers,userByUsername } = require("../controllers/users.controller");

const usersRouter = require("express").Router();
usersRouter.get("/", getUsers);
usersRouter.route("/:username").get(userByUsername)
module.exports = usersRouter;
