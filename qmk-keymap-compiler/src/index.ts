import { server } from './server';

server().catch((err) => {
  console.error(err, `main failed (exiting...)`);
  process.exit(1);
});
