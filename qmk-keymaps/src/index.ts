import { prog } from './cli';

const main = async () => {
  await prog.parseAsync(process.argv);
};
main().catch((err) => {
  console.log(err, `main failed (exiting...)`);
  process.exit(1);
});
