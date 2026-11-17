import type { IAppNativeController } from "@lotus/xdraw/ui";

const triggerDownload = (data: Blob, fileName: string): void => {
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export const webAppNativeController: IAppNativeController = {
  appName: "XDraw Web",
  isMobileApp: false,
  isBrowserWebApp: true,
  isElectronApp: false,
  downloadDataRequest: (data: Blob, saveMimetype: string, fileNameOrPath?: string) => {
    triggerDownload(
      data,
      fileNameOrPath ||
        new Date().toISOString() +
          ".xdraw." +
          saveMimetype
            .replace("image/", ".")
            .replace("text/", ".")
            .replace("application/", "."),
    );
  },
  openFileRequest: (accept: string) =>
    new Promise<File | null>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.onchange = () => resolve(input.files?.[0] ?? null);
      input.click();
    }),
  async shareDataRequest(data: Blob, mimeType: string, fileName: string) {
    const file = new File([data], fileName, { type: mimeType });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
      return;
    }
    // Web Share API dosyayla desteklenmiyorsa indirmeye dus
    triggerDownload(data, fileName);
  },
};
