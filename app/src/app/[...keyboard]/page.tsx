import { Button } from '@/components/base/button';
import { KeyforgeSteps } from '@/components/base/keyforgeSteps';
import { KeymapConfigurator } from '@/components/controlled/keymapConfigurator';
import { existingKeymap, keyboardInfo } from '@/lib/keyboards';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default async function Keyboard({
  params,
}: {
  params: { keyboard: string[] };
  searchParams: any;
}) {
  const keyboardPath = params.keyboard.join('/');

  const keyboard = await keyboardInfo.get(keyboardPath);

  if (!keyboard) {
    return (
      <main className="expanded-container flex items-center justify-center">
        404 - Keyboard not found
        <Link className="mt-8" href="/">
          <Button>
            <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
            Back
          </Button>
        </Link>
      </main>
    );
  }

  const keymaps = await Promise.all(
    keyboard.keymaps.map((key) => existingKeymap.get(`${keyboardPath}/${key}`))
  );

  return (
    <main className="expanded-container overflow-hidden">
      <div className="flex justify-center py-8">
        <KeyforgeSteps className="mb-4" current="customize" />
      </div>
      <div className="expanded-container mt-8">
        <KeymapConfigurator
          keyboardId={keyboardPath}
          keyboard={keyboard}
          keymaps={keymaps}
        />
      </div>
    </main>
  );
}
