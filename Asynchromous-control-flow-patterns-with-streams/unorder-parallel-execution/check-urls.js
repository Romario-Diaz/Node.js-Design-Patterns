import { pipeline } from "stream";
import { createReadStream, createWriteStream } from "fs";
import split from "split";
import superagent from "superagent";
import { ParallelStream } from "./parallel-stream";

pipeline(
  createReadStream(process.argv[2]),
  split(),
  new ParallelStream(async (url, enc, push, done) => {
    if (!url) {
      return done();
    }
    try {
      await superagent.head(url, { timeout: 5 * 1000 });
      push(`${url} is up\n`);
    } catch (err) {
      push(`${url} is down\n`);
    }
    done();
  }),
  createWriteStream("results.txt"),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("All urls have been checked");
  }
);
