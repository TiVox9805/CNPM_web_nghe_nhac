import mongoose from "mongoose";
let cache = {
	conn: null,
	promise: null
};
let cnt = 0;
let createcnt = 0;
export const connectDB = async () => {
	try {
		cnt++;
		if(cache.conn){
			console.log(`Using existing connection | Cnt ${cnt} | CreateCnt ${createcnt}`)
			return cache.conn;
		}
		if(!cache.promise){
			createcnt++;
			console.log(`Creating new connection | Cnt ${cnt} | CreateCnt ${createcnt}`)
			cache.promise = mongoose.connect(process.env.MONGODB_URI);
		}
		cache.conn = await cache.promise;
		console.log("✅ Connected to MongoDB");
		return cache.conn;
	} catch (error) {
		console.log("❌ Failed to connect:", error);
		throw error;
	}
};