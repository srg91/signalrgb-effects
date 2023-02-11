export namespace SystemConstants {
  export const contextHasGetImageDataFunction = (() => {
    try {
      const canvas = document.getElementById("exCanvas") as HTMLCanvasElement;
      const context = canvas.getContext("2d", {
        desynchronized: true,
      }) as CanvasRenderingContext2D;

      const data = context.getImageData(10, 10, 10, 10);
      return data instanceof ImageData;
    } catch {
      return false;
    }
  })();
}
