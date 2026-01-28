import { createClient } from "redis";

const USERNAME = process.env.REDIS_USERNAME;
const PASSWORD = process.env.REDIS_PASSWORD;
const client = createClient({
  username: USERNAME,
  password: PASSWORD,
  socket: {
    host: "redis-16504.c321.us-east-1-2.ec2.cloud.redislabs.com",
    port: 16504,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

export async function connectRedis(): Promise<typeof client> {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}
export async function closeRedis(): Promise<void> {
  if (client.isOpen) {
    await client.quit();
  }
}

export default client;
