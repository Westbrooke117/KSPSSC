import './App.css'
import distanceData from "./json/distances.json"
import antennaData from './json/antennas.json'
import {useEffect, useRef, useState} from "react";

function App() {
    const [dsnLevel, setDsnLevel] = useState(2000000000)
    const [totalPower, setTotalPower] = useState(2000000000)

    const [antennas, updateAntennas] = useState([])
    const [relays, updateRelays] = useState([])
    const [destination, setDestination] = useState(3)

    const [minStrength, setMinStrength] = useState(0)
    const [maxStrength, setMaxStrength] = useState(0)

    const antennaSelect = useRef()

    useEffect(() => {
        console.log(destination)
        const calculateSignalStrength = (distance) => {
            let x = Math.min(1 - distanceData[destination][distance] / Math.round(Math.sqrt(dsnLevel * calculateTotalPower().antennaTotal)), 1)
            x = Math.max(x, 0)

            return Math.round(((3-2 * x) * x ** 2) * 100)
        }

        setMinStrength(calculateSignalStrength('min'))
        setMaxStrength(calculateSignalStrength('max'))

        setTotalPower(Math.floor(Math.sqrt(dsnLevel * calculateTotalPower().antennaTotal)))
  },[dsnLevel, antennas, destination])

    const generateShorthandNumber = (power) => {
      if (power < 1000000){
          return `${Math.floor(power/1000)}k`
      } else {
          return `${Math.floor(power/1000000000).toFixed(2)}G`
      }
    }

    const calculateTotalPower = () => {
      const calculateSum = (total, num) => {
          return total + num.power
      }

      let antennaTotal = antennas.reduce(calculateSum, 0)
      let relayTotal = relays.reduce(calculateSum, 0)

      return {
          antennaTotal: antennaTotal,
          relayTotal: relayTotal
      }
    }

  return (
    <>
      <div className={"title"}>
        <p style={{color: "white", fontSize: 32}}>KSP Signal Strength Calculator</p>
      </div>
      <div className={"signal-mode-selection"}>
        <button>Direct Mode</button>
        <button>Relay Mode</button>
      </div>
      <div className={"main-content-container"}>
          <div className={"planet-container-wrapper"}>
              <div className={"planet-container"} style={{backgroundImage: 'url(src/assets/kerbol_system/Kerbin.webp)', backgroundSize: 'cover'}}>
                  <select style={{width: 'fit-content', height: 'fit-content'}}>
                      <option>Kerbin</option>
                  </select>
              </div>
              <div className={"container-overlay"}></div>
          </div>
        <div className={"connection-container"}>
          <div style={{borderBottom: minStrength !== 0 ? `3px solid hsl(${minStrength}, 100%, 60%)` : `3px dotted white`, height: 35, width: 500}}>
              {
                  minStrength !== 0 ?
                      <p className={"text-centered white"}>{minStrength}% strength at min distance</p>
                      :
                      <p className={"text-centered white"}>No connection at min distance</p>
              }
          </div>
          <div style={{borderBottom: maxStrength !== 0 ? `3px solid hsl(${maxStrength}, 100%, 60%)` : `3px dotted white`, height: 35, width: 500}}>
              {
                  maxStrength !== 0 ?
                      <p className={"text-centered white"}>{maxStrength}% strength at max distance</p>
                      :
                      <p className={"text-centered white"}>No connection at max distance</p>
              }
          </div>
        </div>
        <div className={"planet-container"} style={{backgroundImage: `url(src/assets/kerbol_system/${distanceData[destination].name}.webp)`, backgroundSize: 'cover'}}>
          <select style={{width: 'fit-content', height: 'fit-content'}} defaultValue={3} onChange={(e) => setDestination(parseInt(e.target.value))}>
            {
              distanceData.map(planet => (
                  <option value={planet.id}>{planet.name}</option>
              ))
            }
          </select>
        </div>
      </div>
      <div className={"centered"}>
        <div className={"total-power"}>
          <p>Total Relay Power: {totalPower.toLocaleString()}</p>
        </div>
      </div>
      <div className={"centered"}>
        <div className={"settings-container"}>
          <div className={"settings-column"}>
            <p className={"text-centered white"}>KSC Ground Radar Level</p>
            <button className={ dsnLevel === 2000000000 ? "button-active" : "button-inactive" } onClick={() => {setDsnLevel(2000000000)}}>Level 1 ꞏ <span className={'power-readout'}>2.0G</span></button>
            <button className={ dsnLevel === 50000000000 ? "button-active" : "button-inactive" } onClick={() => {setDsnLevel(50000000000)}}>Level 2 ꞏ <span className={'power-readout'}>50.0G</span></button>
            <button className={ dsnLevel === 250000000000 ? "button-active" : "button-inactive" } onClick={() => {setDsnLevel(250000000000)}}>Level 3 ꞏ <span className={'power-readout'}>250.0G</span></button>
          </div>
          <div className={"settings-column"}>
            <p className={"text-centered white"}>Direct Antennas</p>
              <select ref={antennaSelect} onChange={(e) => {
                  let id = e.target.value
                  antennaSelect.current.value = 'default'
                  updateAntennas(
                      [
                          ...antennas,
                          {
                              name: antennaData[id].name,
                              power: antennaData[id].power
                          }
                      ]
                  )
              }}>
                  <option value={'default'}>--- Select ---</option>
                  <optgroup label={'Stock'}>
                      { antennaData.map(antenna => <option value={antenna.id} >{antenna.name} · {generateShorthandNumber(antenna.power)}</option>) }
                  </optgroup>
              </select>
              {
                  antennas.map(antenna => <button>{antenna.name} · <span className={'power-readout'}>{generateShorthandNumber(antenna.power)}</span></button>)
              }
          </div>
          <div className={"settings-column"}>
              <p className={"text-centered white"}>Relays</p>
              <button onClick={() => {
                  updateRelays(
                      [
                          ...relays,
                          { relayCount: 1 }
                      ]
                  )
              }}>+</button>
              {
                  relays.map(relay => <button>Aurora</button>)
              }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
