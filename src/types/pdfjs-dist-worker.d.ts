declare module "pdfjs-dist/legacy/build/pdf.worker.mjs" {
  export const WorkerMessageHandler: any;
}

declare global {
  var pdfjsWorker:
    | {
        WorkerMessageHandler: any;
      }
    | undefined;
}

export {};
