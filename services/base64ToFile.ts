export type PrepareFile = {
  file: File;
  fileName: string;
  fileType: string;
};

export async function Base64ToFile({
  imagesBase64,
}: {
  imagesBase64: string[];
}): Promise<PrepareFile[]> {
  const heic2any = (await import("heic2any")).default;
  const formData = new FormData();

  // turn imageBase64 into formData
  for (const imageBase64 of imagesBase64) {
    const response = await fetch(imageBase64);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });
    formData.append("files", file);
  }

  // duplicate those formData Files in to filesOld
  const filesOld = formData.getAll("files");

  //This function identify which file does not contain type = "image/jpeg"
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
