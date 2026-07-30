import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";

import { Map as OlMap, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import StadiaMaps from "ol/source/StadiaMaps";
import { fromLonLat, toLonLat } from "ol/proj";

import "ol/ol.css";

const STADIA_API_KEY = import.meta.env.VITE_STADIA_API_KEY;

const Map = forwardRef(function Map(
  { lon, lat, pins = [], onMapClick, picking = false },
  ref
) {
  const mapElRef = useRef(null);
  const olMapRef = useRef(null);
  const viewRef = useRef(null);
  const overlaysRef = useRef([]);
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  useImperativeHandle(ref, () => ({
    getOlMap: () => olMapRef.current
  }));

  useEffect(() => {
    const view = new View({
      center: fromLonLat([lon, lat]),
      zoom: 15
    });

    viewRef.current = view;

    olMapRef.current = new OlMap({
      layers: [
        new TileLayer({
          source: new StadiaMaps({
            layer: "stamen_watercolor",
            apiKey: STADIA_API_KEY
          })
        }),
        new TileLayer({
          source: new StadiaMaps({
            layer: "stamen_terrain_labels",
            apiKey: STADIA_API_KEY
          })
        })
      ],
      controls: [], // removing all default controls from the rendered map
      target: mapElRef.current,
      view
    });

    // read via a ref, not a closed-over prop, so this listener (registered once)
    // always calls whichever onMapClick is current instead of the one from mount
    olMapRef.current.on("click", event => {
      if (!onMapClickRef.current) {
        return;
      }

      const [clickLon, clickLat] = toLonLat(event.coordinate);
      onMapClickRef.current(clickLon, clickLat);
    });

    return () => {
      olMapRef.current.setTarget(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.setCenter(fromLonLat([lon, lat]));
    }
  }, [lon, lat]);

  useEffect(() => {
    const map = olMapRef.current;

    if (!map) {
      return;
    }

    overlaysRef.current.forEach(overlay => map.removeOverlay(overlay));

    overlaysRef.current = pins.map(pin => {
      const element = document.createElement("div");
      element.className = pin.pending ? "map-pin map-pin--pending" : "map-pin";
      if (pin.note) {
        element.title = pin.note;
      }

      const overlay = new Overlay({
        position: fromLonLat([pin.lon, pin.lat]),
        positioning: "center-center",
        element
      });

      map.addOverlay(overlay);
      return overlay;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins]);

  return (
    <div
      className={`map-target${picking ? " map-target--picking" : ""}`}
      ref={mapElRef}
    />
  );
});

export default Map;
