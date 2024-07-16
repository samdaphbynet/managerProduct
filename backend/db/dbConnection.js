import mongoose from 'mongoose';

const dbConnection = async () => {
    const connect = await mongoose.connect(process.env.MONGO_DB)
    console.log(`MongoDB Connected: ${connect.connection.host}`);
    return connect;
}

export default dbConnection;