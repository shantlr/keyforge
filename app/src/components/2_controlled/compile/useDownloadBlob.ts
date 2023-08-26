import { useCallback } from 'react';

export const useDownloadBlob = () => {
  return [
    useCallback((blob: Blob, { fileName }: { fileName?: string } = {}) => {
      const a = document.createElement('a');
      a.style.cssText = 'display: none';
      document.body.appendChild(a);

      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName || '';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, []),
  ] as const;
};
