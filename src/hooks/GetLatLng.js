import { useSearchParams } from "react-router-dom";

export default function useLatLng() {
  const [serchParams] = useSearchParams();
  const Lat = serchParams.get("lat");
  const Lng = serchParams.get("lng");
  return [Lat, Lng];
}
