declare const tinymce: any;
export const filePickerCallback = (cb: any, value: any, meta: any) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");

  input.addEventListener("change", (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const id = "blobid" + new Date().getTime();
      const blobCache = tinymce.activeEditor.editorUpload.blobCache as any;
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
