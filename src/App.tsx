import { useEffect, useRef} from 'react'
import './App.css'


const App = () => {
  const audioContext = useRef<AudioContext>();
  const splitter = useRef<ChannelSplitterNode>();
  const merger = useRef<ChannelMergerNode>();
  const source = useRef<AudioBufferSourceNode>();

  const initAudio = () => {
    if (audioContext.current) {
      const channelNumber = 10
      const buffer = audioContext.current.createBuffer(channelNumber, audioContext.current.sampleRate * 3, audioContext.current.sampleRate);
      for (let channel=0; channel<channelNumber; channel++) {
        const arrayBuffer = buffer.getChannelData(channel);
        for (let i=0; i<arrayBuffer.length; i++) {
          arrayBuffer[i] = Math.random() * 2 - 1;
        }
      }
      source.current = audioContext.current.createBufferSource();
      if (splitter.current) source.current.connect(splitter.current)
      source.current.buffer = buffer;
    }
    console.log("merger:", merger.current?.channelCount);
    console.log("splitter:", splitter.current?.channelCount);
    console.log(audioContext.current?.destination.channelCount);
    source.current?.start();
  }

  useEffect(() => {
    audioContext.current = new AudioContext()
    splitter.current = audioContext.current.createChannelSplitter(20);
    merger.current = audioContext.current.createChannelMerger(20);
    splitter.current.connect(merger.current, 3)
    merger.current.connect(audioContext.current.destination)
  }, [])
  

  return (
    <div className="App">
      <button onClick={initAudio}>Play Audio</button>
    </div>
  )
}

export default App
