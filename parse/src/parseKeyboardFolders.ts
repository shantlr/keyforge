import { readFile, readdir } from 'fs/promises';
import path from 'path';

const parseFileToJson = async (filePath: string) => {
  const content = (await readFile(filePath)).toString();

  try {
    const res = JSON.parse(content);
    return res;
  } catch (err) {
    if (err instanceof SyntaxError) {
      return null;
    }
    throw err;
  }
};

export const parseKeyboardsFolder = async (
  {
    dir,
    parentKeymapsDir,
    parentInfoJson,
  }: {
    dir: string;
    parentKeymapsDir?: string;
    parentInfoJson?: Record<string, any>;
  },
  onKeyboardFolder: (input: {
    dir: string;
    infoJson: any;
    keymapsDir: string;
  }) => Promise<void> | void,
): Promise<{ keyboardParsed: boolean }> => {
  const files = await readdir(dir, { withFileTypes: true });

  // keyboards folder should contain rules.mk file
  const isKeyboardFolder = files.some(
    (f) => f.name === 'rules.mk' && f.isFile(),
  );

  if (isKeyboardFolder) {
    const infoFile = files.find((f) => f.name === 'info.json' && f.isFile());
    if (!infoFile) {
      console.warn(
        `${dir} does contain rules.mk but info.json is missing (skiping folder)`,
      );
      return { keyboardParsed: false };
    }

    const info = await parseFileToJson(path.resolve(dir, infoFile.name));
    if (!info) {
      console.log(`failed to parse ${dir}/${infoFile.name} (skipping folder)`);
      return { keyboardParsed: false };
    }

    const keymapFolder = files.find(
      (f) => f.name === 'keymaps' && f.isDirectory(),
    );

    const resolvedInfo = {
      ...(parentInfoJson || null),
      ...info,
    };

    const keymapsDir = keymapFolder
      ? path.resolve(dir, keymapFolder.name)
      : parentKeymapsDir;

    // check for revisions
    const revs = files.filter((f) => f.isDirectory() && f.name !== 'keymaps');
    if (revs.length) {
      const parsedRevs = await Promise.all(
        revs.map((r) =>
          parseKeyboardsFolder(
            {
              dir: path.resolve(dir, r.name),
              parentInfoJson: resolvedInfo,
              parentKeymapsDir: keymapsDir,
            },
            onKeyboardFolder,
          ),
        ),
      );
      if (parsedRevs.some((r) => r.keyboardParsed)) {
        return { keyboardParsed: true };
      }
    }

    // if no revision found, consider keyboard root folder as the default revision
    await onKeyboardFolder({
      dir,
      infoJson: resolvedInfo,
      keymapsDir,
    });
    return {
      keyboardParsed: true,
    };
  } else {
    // look for keyboard folder in subfolders
    const res = await Promise.all(
      files
        .filter((f) => f.isDirectory())
        .map((f) =>
          parseKeyboardsFolder(
            {
              dir: path.resolve(dir, f.name),
              parentInfoJson,
              parentKeymapsDir,
            },
            onKeyboardFolder,
          ),
        ),
    );
    return {
      keyboardParsed: res.some((r) => r.keyboardParsed),
    };
  }
};
