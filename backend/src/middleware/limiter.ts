import redisClient from "../config/redis";
import { RedisStore } from "rate-limit-redis";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15*60*1000,

  max: 100,
  
  standardHeaders: true,

  legacyHeaders: false,

  message:{
    success:false,
    message:"Too many requests. Try again later",
  },
  
  store: new RedisStore({
    sendCommand: (...args)=>
      redisClient.sendCommand(args),
  })
})

export default limiter;