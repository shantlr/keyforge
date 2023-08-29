import { keyboardOptions } from '@/lib/keyboards';
import { SelectKeyboard } from '@/components/2_controlled/selectKeyboard';
import { KeyforgeSteps } from '@/components/2_controlled/keyforgeSteps';

export default async function Home() {
  const res = await keyboardOptions.get();

  return (
    <main className="expanded-container overflow-hidden">
      <div className="py-8 flex justify-center">
        <KeyforgeSteps className="mb-4" current="pick" />
      </div>
      <SelectKeyboard className="ml-2" keyboards={res} />
    </main>
  );
}
