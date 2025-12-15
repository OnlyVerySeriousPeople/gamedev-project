export default class DrawManager {
  constructor(ctx, images, ee) {
    this.ctx = ctx;
    this.images = images;
    this.ee = ee;
  }

  static async loadImages(imageNames) {
    return new Map(
      await Promise.all(
        imageNames.map(
          (name) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.src = `assets/images/${name}.png`;
              img.onload = () => resolve([name, img]);
              img.onerror = reject;
            }),
        ),
      ),
    );
  }

  onCreate() {
    this.setEventListeners();
  }

  setEventListeners() {}

  drawImage(objectName, sBox, dBox) {
    const img = this.images.get(objectName);
    this.ctx.drawImage(
      img,
      sBox.x,
      sBox.y,
      sBox.width,
      sBox.height,
      dBox.x,
      dBox.y,
      dBox.width,
      dBox.height,
    );
  }

  drawMirroredImage(objectName, sBox, dBox) {
    const img = this.images.get(objectName);
    this.ctx.save();
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(
      img,
      sBox.x,
      sBox.y,
      sBox.width,
      sBox.height,
      -dBox.x - dBox.width,
      dBox.y,
      dBox.width,
      dBox.height,
    );
    this.ctx.restore();
  }
}
