import { prog } from './prog';

const main = async () => {
  await prog.parseAsync(process.argv);
};
main().catch((err) => {
  console.error(`main failed:`, err);
  process.exit(1);
});
