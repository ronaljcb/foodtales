import {LoadScript} from '@react-google-maps/api';
import type {ReactNode} from 'react';
export default function GoogleMapsProvider({children}:{children:ReactNode}) {
 const key=import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
 return key?<LoadScript googleMapsApiKey={key}>{children}</LoadScript>:<>{children}</>;
}
