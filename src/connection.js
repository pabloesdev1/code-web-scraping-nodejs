import mongoose from "mongoose";

export const connection = mongoose.connect(
    ""  // add your url
).then((db) =>{
    console.log("Connected!")
}).catch((err) => {
    console.log("Error: "+err)
})