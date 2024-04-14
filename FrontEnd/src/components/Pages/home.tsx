import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar"
import axios from "axios"
import DeviceCard from "../Components/DeviceCard";
import Map from "../Components/Map";
import { defaultLocation, domain, tokenKey } from "@/constants";
import AddDevice from "../Components/AddDevice";

interface HomePageProps {}

export type Device = {
  id: string;
  name: string;
  location: {
    latitude: number,
    longitude: number
  };
  sensors: Array<string>;
  status: string;
}

const HomePage : React.FC<HomePageProps> = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  useEffect(() => {
    const getDevices = async () => {
      const { data : { data } } = await axios.get(`${domain}/api/v1/devices`,{
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
        }
      });
      const fetcedDevices = data.map((device: any) => ({
        id: device._id,
        name: device.name,
        location: device.location,
        sensors: device.sensors.map((sensor: any) => sensor._id),
        status: device.status
      }));
      setDevices(fetcedDevices);
    };
    getDevices();
  },[devices]);
  const calculateCenter = (): number[] => {
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].status !== "Normal") {
        return [devices[i].location.latitude, devices[i].location.longitude];
      }
    }
    if (devices.length === 0) return defaultLocation
    return [devices[0].location.latitude, devices[0].location.longitude];
  };
  return (
    <>
      <Navbar />
      <div className="relative">
        <AddDevice work="add" setDevices={setDevices}/>
        <Map
          center={calculateCenter()}
          zoom={13}
          markers={devices.map(device => ({
            position: [device.location.latitude,device.location.longitude],
            popup: device.name,
            status: device.status
          }))}
        />
      </div>
      <div className="flex flex-col gap-3">
        {devices.map(device => {
          const { id, name, location, sensors, status } = device;
          return <DeviceCard key={id} id={id} name={name} status={status} location={location} sensors={sensors.length} setDevices={setDevices}/>;
        })}
      </div>
    </>
  )
}

export default HomePage