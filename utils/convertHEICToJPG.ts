export const convertHeicFilesToJpeg = async (file: File) => {
  if (
    !file.type ||
    file.name.endsWith(".HEIC") ||
    file.name.endsWith(".heic")
  ) {
    try {
      const heic2any = (await import("heic2any")).default;
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8, // Adjust the quality as needed
      });

      // Handle the case where convertedBlob is an array
      const jpgBlob = Array.isArray(convertedBlob)
        ? convertedBlob[0]
        : convertedBlob;

      const jpgFile = new File(
        [jpgBlob],
        file.name.replace(/\.(HEIC|heic)$/i, ".jpg"),
        {
          type: "image/jpeg",
          lastModified: file.lastModified,
        }
      );

      console.log(jpgFile);

      return jpgFile;
    } catch (error) {
      console.error("Conversion failed:", error);
      return file;
    }
  } else {
    return file;
  }
};
