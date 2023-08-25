'use client';

import { useSelector } from '@/components/providers/redux';
import { KeyboardInfo } from '@/types';
import { PropsWithChildren } from 'react';
import { useQuery } from 'react-query';
import { Button } from '@/components/base/button';
import { Step, VerticalSteps } from '@/components/base/verticalSteps';
import { useDownloadBlob } from './useDownloadBlob';
import { toLower } from 'lodash';

const DisabledStep = ({ children }: PropsWithChildren) => {
  return <span className="text-gray-500">{children}</span>;
};

type CompileJob = {
  id: string;
  state: 'pending' | 'ready' | 'ongoing' | 'done';
};

export const Compile = ({
  keyboardKey,
  keyboardInfo,
}: {
  keyboardKey: string;
  keyboardInfo: KeyboardInfo & { qmkpath: string };
}) => {
  const selectedKeymap = useSelector((state) => {
    const id = state.view.selectedKeymap?.[keyboardKey]?.lastSelectedKeymap;
    if (!id) {
      return null;
    }
    return state.keymaps.keymaps[id];
  });

  const { data: jobId, error: createJobError } = useQuery(
    ['createJob', keyboardKey, selectedKeymap],
    async () => {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          keyboardKey,
          layers: selectedKeymap?.layers.map((l) => ({
            name: l.name,
            keys: l.keys,
          })),
          layout: selectedKeymap?.layout,
        }),
      });
      const job = (await res.json()) as CompileJob;
      return job.id;
    },
    {
      // enabled: false,
      enabled: Boolean(keyboardKey && selectedKeymap),
      refetchOnMount: false,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const { data: job, error: pingJobError } = useQuery(
    ['job', jobId],
    async () => {
      if (!jobId) {
        return;
      }

      const res = await fetch(`/api/compile/job/${jobId}`);
      const job = (await res.json()) as CompileJob;
      return job;
    },
    {
      refetchInterval: 5000,
      enabled: Boolean(jobId),
    }
  );

  const { data: firmware, error: runError } = useQuery(
    ['job', jobId, 'run'],
    async () => {
      if (!jobId) {
        return;
      }

      const res = await fetch(`/api/compile/job/${jobId}/run`, {
        method: 'POST',
      });
      return await res.blob();
    },
    {
      enabled: Boolean(job && job.state === 'ready'),
      refetchOnMount: false,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const [downloadBlob] = useDownloadBlob();

  if (!selectedKeymap) {
    return <div>No keymap selected</div>;
  }

  return (
    <div className="mt-8">
      <div className="text-center">
        Keymap <span className="text-primary">{selectedKeymap.name}</span> (
        <span className="text-sm">{keyboardInfo.qmkpath}</span>)
      </div>
      <div className="mt-8 mx-[120px]">
        <VerticalSteps current="wait">
          <Step name="wait">
            {() => {
              if (createJobError) {
                return (
                  <span>
                    Failed to create job: {(createJobError as Error).message}
                  </span>
                );
              }
              if (!jobId || !job) {
                return <span>Creating job...</span>;
              }
              if (job.state === 'pending') {
                return <span>Waiting for runner...</span>;
              }
              return <span>Runner ready</span>;
            }}
          </Step>
          <Step name="compile">
            {() => {
              if (runError) {
                return <span>{(runError as Error).message}</span>;
              }
              if (!jobId || !job || job.state === 'pending') {
                return <DisabledStep>Compile</DisabledStep>;
              }

              if (job.state === 'ongoing') {
                return <span>Compiling...</span>;
              }
              if (job.state === 'ready') {
                return <span>Starting compilation...</span>;
              }
              return <span>Compiled</span>;
            }}
          </Step>
          <Step name="ready">
            {({ active }) => {
              return (
                <Button
                  isDisabled={!firmware}
                  onPress={() => {
                    if (!firmware) {
                      return;
                    }

                    downloadBlob(firmware, {
                      fileName: `${keyboardKey}_${toLower(
                        selectedKeymap.name
                      ).replace(/[ -]/g, '_')}.bin`,
                    });
                  }}
                >
                  Download
                </Button>
              );
            }}
          </Step>
        </VerticalSteps>
      </div>
    </div>
  );
};
