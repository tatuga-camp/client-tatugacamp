import { PrepareFile } from "./base64ToFile";

type InputconvertHeicFilesToJpeg = {
  formFiles: FormData;
};
export async function convertHeicFilesToJpeg({
  formFiles,
}: InputconvertHeicFilesToJpeg): Promise<
  Array<{ file: File; fileName: string; fileType: string }>
> {
  const heic2any = (await import("heic2any")).default;
  const filesOld = formFiles.getAll("files");
  const files = await Promise.all<PrepareFile>(
    filesOld.map(async (value: FormDataEntryValue) => {
      let file: File = value as File;
      if (file.type === "") {
        const blob: any = await heic2any({
          blob: file,
          toType: "image/jpeg",
        });
        file = new File([blob], file.name, { type: "image/jpeg" });
        return {
          file: file,
          fileName: file.name,
          fileType: file.type,
        };
      } else {
        return {
          file: file,
          fileName: file.name,
          fileType: file.type,
        };
      }
    })
  );

  return files;
}
