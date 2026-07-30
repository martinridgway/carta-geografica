// Composites OpenLayers' per-layer canvases into a single flat image,
// honoring each layer's opacity/CSS transform — the pattern from OL's own
// "Export Map to PNG" example, since a naive single-canvas grab would miss
// layers OL renders onto separate canvases (it happens to flatten this
// app's two raster TileLayers onto one shared canvas, but that's an
// implementation detail not worth depending on).
//
// Reads the map's *already-rendered* canvases directly rather than waiting
// on a "rendercomplete" event — that event only fires for a render OL
// considers new/dirty, so waiting on it hangs forever when the map is
// already idle, which is always true by the time a user clicks an export
// button.
export function exportMapImage(map) {
  return new Promise((resolve, reject) => {
    try {
      const mapCanvas = document.createElement("canvas");
      const [width, height] = map.getSize();
      mapCanvas.width = width;
      mapCanvas.height = height;
      const mapContext = mapCanvas.getContext("2d");

      const layerCanvases = map
        .getViewport()
        .querySelectorAll(".ol-layer canvas, canvas.ol-layer");

      layerCanvases.forEach(canvas => {
        if (canvas.width === 0) {
          return;
        }

        const opacity =
          canvas.parentNode.style.opacity || canvas.style.opacity;
        mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);

        const transform = canvas.style.transform;
        const match = transform && transform.match(/^matrix\(([^)]*)\)$/);

        if (match) {
          mapContext.setTransform(...match[1].split(",").map(Number));
        } else {
          mapContext.setTransform(1, 0, 0, 1, 0, 0);
        }

        mapContext.drawImage(canvas, 0, 0);
      });

      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);

      mapCanvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to export the map as an image"));
        }
      }, "image/png");
    } catch (err) {
      reject(err);
    }
  });
}
