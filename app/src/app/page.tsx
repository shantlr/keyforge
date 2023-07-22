import { keyboards } from '@/lib/keyboards';
import { SelectKeyboard } from '@/components/controlled/selectKeyboard';
import { KeyforgeSteps } from '@/components/base/keyforgeSteps';

export default async function Home() {
  const res = await keyboards.get();

  return (
    <main className="expanded-container overflow-hidden">
      <div className="py-8 flex justify-center">
        <KeyforgeSteps className="mb-4" current="pick" />
      </div>
      <div className="text-primary flex items-center">
        <span className="text-primary-lighter">Pick your keyboard</span>
        <SelectKeyboard className="ml-2" keyboards={res} />
      </div>
    </main>
  );
}
