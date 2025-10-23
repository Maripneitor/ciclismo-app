import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EventMap = ({ route, eventLocation }) => {
  const defaultCenter = [40.4168, -3.7038]; // Madrid
  const defaultRoute = route || [
    [40.4168, -3.7038],
    [40.4178, -3.7138],
    [40.4188, -3.7238],
    [40.4198, -3.7338]
  ];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Polyline
        positions={defaultRoute}
        color="blue"
        weight={4}
        opacity={0.7}
      />
      
      <Marker position={defaultRoute[0]}>
        <Popup>
          <strong>Inicio</strong><br />
          {eventLocation}
        </Popup>
      </Marker>
      
      <Marker position={defaultRoute[defaultRoute.length - 1]}>
        <Popup>
          <strong>Meta</strong><br />
          {eventLocation}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default EventMap;