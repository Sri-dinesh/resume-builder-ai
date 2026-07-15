declare module "pdfjs-dist/legacy/build/pdf.worker.mjs" {
  export const WorkerMessageHandler: unknown;
}

declare global {
  var pdfjsWorker:
    | {
        WorkerMessageHandler: unknown;
      }
    | undefined;
}

export {};
