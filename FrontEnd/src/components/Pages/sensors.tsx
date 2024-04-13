import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import SensorCard from "../Components/SensorCard";
import { domain } from "@/constants";

interface SensorsPageProps {}

type Sensor = {
  id: string;
  name: string;
  minValue: number;
  maxValue: number;
  status: string;
  logs: {
    value: Number;
    timestamp: String;
    status: String;
  }[];
}

const SensorsPage : React.FC<SensorsPageProps> = () => {
  const { deviceId } = useParams();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  useEffect(() => {
    const getSensors = async () => {
      const { data } = await axios.get(`${domain}/api/v1/sensors/${deviceId}`);
      setSensors(data.map((sensor: any) => ({
        ...sensor,
        logs: sensor.logs.map((log: any) => ({
            ...log,
            timestamp: log.createdAt.toString()
          }))
      })));
    };
    getSensors();
  },[sensors]);
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-4">
        {sensors.map((sensor, index) => {
          const { id, name, status, minValue, maxValue, logs } = sensor;
          return <SensorCard key={index} deviceId={deviceId || ""} id={id} name={name} status={status} minValue={minValue} maxValue={maxValue} logs={logs} />
        })}
      </div>
    </>
  );
}

export default SensorsPage;