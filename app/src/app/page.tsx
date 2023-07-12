import { keyboards } from '@/lib/keyboards';
import { SelectKeyboard } from '@/components/controlled/selectKeyboard';

export default async function Home() {
  const res = await keyboards.get();

  return (
    <main className="p-16 h-full">
      <div className="text-primary">
        <span className="text-primary-lighter">Pick your keyboard</span>
        <SelectKeyboard className="ml-2" keyboards={res} />
      </div>
    </main>
  );
}
