import { Button } from '@/components/base/button';
import { existingKeymap, keyboardInfo } from '@/lib/keyboards';
import { CustomizeKeymapPage } from '@/components/pages/customizeKeymapPage';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default async function Keyboard({
  params,
}: {
  params: { keyboard: string };
  searchParams: any;
}) {
  const kbKey = params.keyboard;
  const keyboard = await keyboardInfo.get(kbKey);

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
    keyboard.keymaps.map((key) => existingKeymap.get(`${keyboard.path}/${key}`))
  );

  return (
    <main className="expanded-container overflow-hidden">
      <CustomizeKeymapPage
        keyboardKey={kbKey}
        keyboard={keyboard}
        keymaps={keymaps}
      />
    </main>
  );
}
