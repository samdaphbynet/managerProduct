import app from "./app.js"
import userAuth from "./routes/user.Routes.js"



app.use("/api/user/", userAuth);