import { KeymapConfigurator } from '@/components/controlled/keymapConfigurator';
import { SelectKeyboard } from '@/components/controlled/selectKeyboard';
import { keyboardInfo, keyboards } from '@/lib/keyboards';

export default async function Keyboard({
  params,
}: {
  params: { keyboard: string[] };
  searchParams: any;
}) {
  const res = await keyboards.get();
  const keyboardPath = params.keyboard.join('/');

  const keyboard = await keyboardInfo.get(keyboardPath);

  return (
    <main className="p-4 expanded-container overflow-hidden">
      <div className="text-primary flex items-center">
        <span className="text-primary-lighter">Pick your keyboard</span>
        <SelectKeyboard className="ml-2" value={keyboardPath} keyboards={res} />
      </div>
      <div className="expanded-container mt-8">
        <KeymapConfigurator keyboardId={keyboardPath} keyboard={keyboard} />
      </div>
    </main>
  );
}
