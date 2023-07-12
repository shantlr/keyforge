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

  console.log(keyboard);

  return (
    <main className="p-16 h-full">
      <div className="text-primary">
        <span className="text-primary-lighter">Pick your keyboard</span>
        <SelectKeyboard className="ml-2" value={keyboardPath} keyboards={res} />
      </div>
      <div className="mt-8">
        <KeymapConfigurator keyboard={keyboard} />
      </div>
    </main>
  );
}
