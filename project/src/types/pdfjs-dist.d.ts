declare module 'pdfjs-dist' {
  export const GlobalWorkerOptions: { workerSrc: any };
  export function getDocument(src: string | any): { promise: Promise<any> };
}

declare module 'pdfjs-dist/build/pdf.worker.mjs?url' {
  const value: string;
  export default value;
}

declare module 'pdfjs-dist/build/pdf.worker.min.mjs?url' {
  const value: string;
  export default value;
}