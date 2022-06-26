import Logging  from '../library/Logging';
import {config} from './config';
import mongoose, {ConnectOptions} from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo.url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    } as ConnectOptions);
  } catch (err) {
    Logging.error('Unable to connect: ');
    Logging.error(err);
  }
}
