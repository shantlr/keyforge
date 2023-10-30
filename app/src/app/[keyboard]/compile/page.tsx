import { Compile } from '@/components/2_controlled/compile';
import { keyboardInfo } from '@/lib/keyboards';

export default async function KeyboardCompile({
  params: { keyboard: kbKey },
}: {
  params: { keyboard: string };
}) {
  const kb = await keyboardInfo.get(kbKey);

  return (
    <main className="expanded-container overflow-hidden">
      <Compile keyboardKey={kbKey} keyboardInfo={kb} />
    </main>
  );
}
