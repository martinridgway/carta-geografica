import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";

import { Map as OlMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import StadiaMaps from "ol/source/StadiaMaps";
import { fromLonLat } from "ol/proj";

import "ol/ol.css";

const STADIA_API_KEY = import.meta.env.VITE_STADIA_API_KEY;

const Map = forwardRef(function Map({ lon, lat }, ref) {
  const mapElRef = useRef(null);
  const olMapRef = useRef(null);
  const viewRef = useRef(null);

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

  return <div className="map-target" ref={mapElRef} />;
});

export default Map;
