import { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from "react-native-vision-camera";
import { useTextRecognition } from "react-native-vision-camera-text-recognition";
import { TextRecognitionOptions } from "react-native-vision-camera-text-recognition/lib/typescript/src/types";

export default function Index() {
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  useEffect(() => { if (!hasPermission) requestPermission() }, [hasPermission, requestPermission])

  const options: TextRecognitionOptions = { language: 'latin' };
  const { scanText } = useTextRecognition(options)

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const data = scanText(frame)
    Object.keys(data).length && console.log(data, 'data')
  }, [])

  if (!hasPermission) return <Text>PermissionsPage</Text>
  if (device == null) return <Text>NoCameraDeviceError</Text>
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
    />
  )
}

