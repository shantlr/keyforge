import { SelectKeyboard } from '@/components/2_controlled/selectKeyboard';
import { keyboardOptions } from '@/lib/keyboards';

export default async function Home() {
  const res = await keyboardOptions.get();

  return (
    <main className="expanded-container overflow-hidden">
      <SelectKeyboard className="ml-2" keyboards={res} />
    </main>
  );
}
