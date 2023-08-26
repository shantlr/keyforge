import { Compile } from '@/components/2_controlled/compile';
import { KeyforgeSteps } from '@/components/2_controlled/keyforgeSteps';
import { keyboardInfo } from '@/lib/keyboards';
import Link from 'next/link';

export default async function KeyboardCompile({
  params: { keyboard: kbKey },
}: {
  params: { keyboard: string };
}) {
  const kb = await keyboardInfo.get(kbKey);

  return (
    <main className="expanded-container overflow-hidden">
      <div className="flex justify-center pt-8">
        <KeyforgeSteps
          customize={
            <Link className="hover:text-primary transition" href={`/${kbKey}`}>
              Customize
            </Link>
          }
          current="compile"
        />
      </div>

      <Compile keyboardKey={kbKey} keyboardInfo={kb} />
    </main>
  );
}
