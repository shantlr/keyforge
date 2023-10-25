'use client';

import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toLower } from 'lodash';
import { PropsWithChildren, useState } from 'react';
import { useQuery } from 'react-query';

import {
  $$compileCreateJob,
  $$compilePingJob,
  CompileJob,
} from '@/actions/compile';
import { Button } from '@/components/0_base/button';
import { Step, VerticalSteps } from '@/components/0_base/verticalSteps';
import { useSelector } from '@/components/providers/redux';
import { KeyboardInfo } from '@/types';

import { Logs } from './logs';
import { useDownloadBlob } from './useDownloadBlob';

const DisabledStep = ({ children }: PropsWithChildren) => {
  return <span className="text-gray-500">{children}</span>;
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
    hasDownloaded: false,
  });

  // init compile job
  const { data: initJob, error: createJobError } = useQuery(
    ['createJob', keyboardKey, selectedKeymap],
    async () => {
      if (!selectedKeymap) {
        return null;
      }

      const res = await $$compileCreateJob({
        keyboardKey,
        layout: selectedKeymap?.layout,
        layers: selectedKeymap?.layers.map((l) => ({
          id: l.id,
          name: l.name,
          keys: l.keys,
        })),
      });

      return res;
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

  const jobId = initJob?.job?.id;

  const [job, setJob] = useState<CompileJob | null>(null);
  const { error: pingJobError } = useQuery(
    ['job', jobId],
    async () => {
      if (!jobId) {
        return null;
      }
      return $$compilePingJob(jobId);
    },
    {
      onSuccess(res) {
        if (res?.state === 'ready') {
          setState((s) => ({ ...s, jobReady: true }));
        }
        if (res) {
          setJob(res);
        }
      },
      refetchInterval: job?.state === 'ready' ? 3000 : false,
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

      // NOTE: we are using route instead of action as we cannot send a buffer from action
      const res = await fetch(`/api/compile/job/${jobId}/run`, {
        method: 'POST',
      });
      if (res.status !== 200) {
        throw new Error(`Status ${res.status}: ${await res.text()}`);
      }
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
    <div className="expanded-container pt-8 overflow-hidden">
      <div className="text-center">
        Keymap <span className="text-primary">{selectedKeymap.name}</span> (
        <span className="text-sm">{keyboardInfo.qmkpath}</span>)
      </div>
      <div className="pt-8 pb-8 h-full px-[120px] overflow-auto">
        <VerticalSteps current={state.current}>
          <Step
            name="wait"
            failed={Boolean(createJobError) || initJob?.success === false}
            done={state.jobReady}
          >
            {() => {
              if (initJob?.error_code === 'COMPILE_OPERATOR_NOT_READY') {
                return <span>Compile runner is not ready</span>;
              }
              if (initJob?.error_code === 'COMPILE_OPERATOR_NOT_SETUP') {
                return <span>Compile runner is not setup</span>;
              }

              if (createJobError) {
                return (
                  <span>
                    Failed to create job: {(createJobError as Error).message}
                  </span>
                );
              }

              if (!state.jobCreated) {
                return <span>Creating job...</span>;
              }
              if (!state.jobReady) {
                return <span>Job in queue...</span>;
              }
              if (state.jobReady) {
                return <span>Runner ready</span>;
              }

              return <div>Waiting for runner...</div>;
            }}
          </Step>
          <Step
            name="compile"
            failed={Boolean(runError)}
            done={state.compileDone}
          >
            {() => {
              if (runError) {
                return (
                  <div>
                    <span>
                      Compilation failed: {(runError as Error).message}
                    </span>
                    <Logs logs={job?.logs} />
                  </div>
                );
              }

              if (firmware) {
                return (
                  <div>
                    <span>Compiled !</span>
                    <Logs logs={job?.logs} />
                  </div>
                );
              }

              if (state.compileStarted) {
                return (
                  <div>
                    <span>Compiling...</span>
                    <Logs logs={job?.logs} />
                  </div>
                );
              }

              return <DisabledStep>Compilation step</DisabledStep>;
            }}
          </Step>

          <Step
            loadingIcon={
              <FontAwesomeIcon className="text-primary" icon={faDownload} />
            }
            doneIcon={
              <FontAwesomeIcon className="text-success" icon={faDownload} />
            }
            name="download"
            done={state.hasDownloaded}
          >
            {() => {
              return (
                <Button
                  isDisabled={!firmware}
                  colorScheme={state.hasDownloaded ? 'success' : 'primary'}
                  onPress={() => {
                    if (!firmware) {
                      return;
                    }
                    setState((s) => ({
                      ...s,
                      hasDownloaded: true,
                    }));

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
