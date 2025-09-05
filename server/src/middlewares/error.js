import express from "express";

const errorHandeling = (err, req, res, next) => {
    console.error("Error occurred", err.message);

    res.status(500)
    .json({message: "Internal Server Error"});
}

export default errorHandeling;