import { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from "react-native-vision-camera";
import { useTextRecognition } from "react-native-vision-camera-text-recognition";
import { TextRecognitionOptions } from "react-native-vision-camera-text-recognition/lib/typescript/src/types";
import FastTranslator from 'fast-mlkit-translate-text';
import { Worklets } from "react-native-worklets-core";

FastTranslator.prepare({
  source: 'English',
  target: 'Tagalog',
  downloadIfNeeded: true, // set to false if you want to download mannually
});

export default function Index() {

  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  useEffect(() => { if (!hasPermission) requestPermission() }, [hasPermission, requestPermission])

  const options: TextRecognitionOptions = { language: 'latin' };
  const { scanText } = useTextRecognition(options)

  const translate = (blocks) => {
    console.log(blocks)
    blocks.forEach(block => FastTranslator.translate(block.blockText).then(result => console.log("TRANSLATED: ", result)).catch(error => console.error(error)))
  }

  const translateOnJS = Worklets.createRunOnJS(translate)

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const data = scanText(frame)
    if (!Object.keys(data).length) return
    translateOnJS(data.blocks)
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

