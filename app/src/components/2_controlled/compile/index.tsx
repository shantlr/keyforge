'use client';

import { useSelector } from '@/components/providers/redux';
import { KeyboardInfo } from '@/types';
import { PropsWithChildren, useState } from 'react';
import { useQuery } from 'react-query';
import { Button } from '@/components/0_base/button';
import { Step, VerticalSteps } from '@/components/0_base/verticalSteps';
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

  const [state, setState] = useState({
    current: 'wait',
    jobCreated: false,
    jobReady: false,
    compileStarted: false,
    compileDone: false,
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
            id: l.id,
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
      onSuccess() {
        setState((s) => ({ ...s, current: 'wait', jobCreated: true }));
      },
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
      onSuccess(res) {
        if (res?.state === 'ready') {
          setState((s) => ({ ...s, jobReady: true }));
        }
      },
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

      setState((s) => ({
        ...s,
        compileStarted: true,
        current: 'compile',
      }));

      const res = await fetch(`/api/compile/job/${jobId}/run`, {
        method: 'POST',
      });
      return await res.blob();
    },
    {
      onSuccess() {
        setState((s) => ({
          ...s,
          compileDone: true,
          current: 'download',
        }));
      },
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
        <VerticalSteps current={state.current}>
          <Step name="wait" done={state.jobReady}>
            {() => {
              if (state.jobReady) {
                return <span>Runner ready</span>;
              }
              if (createJobError) {
                return (
                  <span>
                    Failed to create job: {(createJobError as Error).message}
                  </span>
                );
              }
              return <div>Waiting for runner...</div>;
            }}
          </Step>
          <Step name="compile" done={state.compileDone}>
            {() => {
              if (runError) {
                return <span>{(runError as Error).message}</span>;
              }

              if (firmware) {
                return <span>Compiled !</span>;
              }

              if (state.compileStarted) {
                return <span>Compiling...</span>;
              }

              return <DisabledStep>Compilation step</DisabledStep>;
            }}
          </Step>

          <Step name="download">
            {() => {
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
