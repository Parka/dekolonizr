import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

export default function Index() {
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  useEffect(() => { if (!hasPermission) requestPermission() }, [hasPermission, requestPermission])
  if (!hasPermission) return <Text>PermissionsPage</Text>
  if (device == null) return <Text>NoCameraDeviceError</Text>
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}
