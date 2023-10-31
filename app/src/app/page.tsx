import { SelectKeyboardPage } from '@/components/pages/selectKeyboardPage';
import { keyboardOptions } from '@/lib/keyboards';

export default async function Home() {
  const res = await keyboardOptions.get();

  return (
    <main className="expanded-container overflow-hidden">
      <SelectKeyboardPage keyboards={res} />
    </main>
  );
}
