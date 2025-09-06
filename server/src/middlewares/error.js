import express from "express";

export const errorHandeling = (err, req, res, next) => {
    console.error("Error occurred", err.message);

    res.status(500)
    .json({message: "Internal Server Error"});
}
