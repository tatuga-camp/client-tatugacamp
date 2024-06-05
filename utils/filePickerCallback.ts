import { TinyMCE } from "tinymce";
import { convertHeicFilesToJpeg } from "./convertHEICToJPG";

declare const tinymce: TinyMCE;
export const filePickerCallback = (cb: any, value: any, meta: any) => {
  const input = document.createElement("input");

  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");

  input.addEventListener("change", async (e: any) => {
    const unConvertFile = e.target.files[0];
    const file = await convertHeicFilesToJpeg(unConvertFile);

    console.log(file);
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const id = "blobid" + new Date().getTime();
      const blobCache = tinymce.activeEditor?.editorUpload.blobCache as any;
      const base64 = reader.result as string;
      const base64String = base64.split(",")[1];
      const blobInfo = blobCache.create(id, file, base64String);
      blobCache.add(blobInfo);

      cb(blobInfo.blobUri(), { title: file.name });
    });

    reader.readAsDataURL(file);
  });

  input.click();
};
