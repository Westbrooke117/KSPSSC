import './App.css'
import distanceData from "./json/distances.json"
import antennaData from './json/antennas.json'
import relayData from './json/relays.json'
import {useEffect, useRef, useState} from "react";
import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@chakra-ui/react";
import { MenuIcon} from "./components/MenuIcon.jsx";
import {DeleteIcon} from "@chakra-ui/icons";

const App = () => {
    const [totalPower, setTotalPower] = useState(2000000000)

    const [dsnLevel, setDsnLevel] = useState(2000000000)
    const [antennas, updateAntennas] = useState([])
    const [relays, updateRelays] = useState([])

    const [destination, setDestination] = useState(3)
    const [minStrength, setMinStrength] = useState(0)
    const [maxStrength, setMaxStrength] = useState(0)

    const [activeSignalType, setActiveSignalType] = useState('Antenna')

    const relaySelect = useRef()
    const antennaSelect = useRef()

    const [itemId, setItemId] = useState(0)

    useEffect(() => {
        const calculateSignalStrength = (distance) => {
            console.log(antennas)
            let x = Math.min(1 - distanceData[destination][distance] / Math.round(Math.sqrt(dsnLevel * (activeSignalType === 'Relay' ? calculateTotalPower().relayTotal : calculateTotalPower().antennaTotal))), 1)
            x = Math.max(x, 0)

            return Math.round(((3-2 * x) * x ** 2) * 100)
        }

        setMinStrength(calculateSignalStrength('min'))
        setMaxStrength(calculateSignalStrength('max'))

        setTotalPower(Math.floor(Math.sqrt(dsnLevel * (activeSignalType === 'Relay' ? calculateTotalPower().relayTotal : calculateTotalPower().antennaTotal))))
  },[dsnLevel, antennas, relays, destination, activeSignalType])

    const generateShorthandNumber = (power) => {
      if (power < 1000000){
          return `${Math.floor(power/1000)}k`
      }
      if (power < 1000000000){
            return `${Math.floor(power/1000000)}M`
      }
      else {
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

    const HandleOptionClick = (type, id) => {
        setItemId(itemId + 1)

        switch (type){
            case 'antenna':
                updateAntennas(
                    [
                        ...antennas,
                        {
                            name: antennaData[id].name,
                            id: itemId,
                            power: antennaData[id].power
                        }
                    ]
                )
                break;
            case 'relay':
                updateRelays(
                    [
                        ...relays,
                        {
                            name: relayData[id].name,
                            id: itemId,
                            power: relayData[id].power
                        }
                    ]
                )
                break;
        }
    }

  return (
    <>
      <div className={"title"}>
        <p style={{color: "white", fontSize: 32}}>KSP Signal Strength Calculator</p>
      </div>
      <div className={"signal-mode-selection-container"}>
          <div className={'signal-mode-wrapper'}>
              <button style={{marginRight: '10px'}} className={`signal-mode-selection ${activeSignalType === 'Antenna' ? 'active-button' : ''}`} onClick={() => setActiveSignalType('Antenna')}>Direct Mode</button>
              <div className={'vertical-divider'}></div>
              <button style={{marginLeft: '10px'}} className={`signal-mode-selection ${activeSignalType === 'Relay' ? 'active-button' : ''}`} onClick={() => setActiveSignalType('Relay')}>Relay Mode</button>
          </div>
      </div>
      <div className={"main-content-container"}>
          <div className={"planet-container"} style={{backgroundImage: 'url(src/assets/kerbol_system/Kerbin.webp)', backgroundSize: 'cover'}}>
              <select className={'planet-select'} style={{width: 'fit-content', height: 'fit-content'}}>
                  <option>Kerbin</option>
              </select>
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
          <div style={{borderBottom: maxStrength !== 0 ? `3px solid hsl(${maxStrength}, 100%, 60%)` : `3px dotted white`, height: 35, width: 500, marginBottom: 35}}>
              {
                  maxStrength !== 0 ?
                      <p className={"text-centered white"}>{maxStrength}% strength at max distance</p>
                      :
                      <p className={"text-centered white"}>No connection at max distance</p>
              }
          </div>
        </div>
        <div className={"planet-container"} style={{backgroundImage: `url(src/assets/kerbol_system/${distanceData[destination].name}.webp)`, backgroundSize: 'cover'}}>
          <select className={'planet-select'} style={{width: 'fit-content', height: 'fit-content'}} defaultValue={3} onChange={(e) => setDestination(parseInt(e.target.value))}>
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
          <p>Total {activeSignalType} Power: {totalPower.toLocaleString()}</p>
        </div>
      </div>
      <div className={"centered"}>
        <div className={"settings-container"}>
          <div className={"settings-column"}>
            <p className={"text-centered white"}>Tracking Station Level</p>
            <button className={`${dsnLevel === 2000000000 ? "button-active" : "button-inactive"} styled-button-alt`} onClick={() => {setDsnLevel(2000000000)}}>Level 1<br/><span className={'power-readout'}>2.0G</span></button>
            <button className={`${dsnLevel === 50000000000 ? "button-active" : "button-inactive"} styled-button-alt`} onClick={() => {setDsnLevel(50000000000)}}>Level 2<br/><span className={'power-readout'}>50.0G</span></button>
            <button className={`${dsnLevel === 250000000000 ? "button-active" : "button-inactive"} styled-button-alt`} onClick={() => {setDsnLevel(250000000000)}}>Level 3<br/><span className={'power-readout'}>250.0G</span></button>
          </div>
          <div className={"settings-column"}>
            <p className={"text-centered white"}>Direct Antennas</p>
              <Menu flip={false}>
                  <MenuButton className={'styled-button-alt'}>--- Select ---</MenuButton>
                  <MenuList border={'1px solid #676767'} borderRadius={10} w={'280px'} backgroundColor={'#1f1f1f'} padding={'10px'}>
                      <MenuGroup title={'Stock'} mt={0} mb={10} color={'white'}>
                          { antennaData.map(antenna => <MenuItem
                              value={antenna.id}
                              background={'none'}
                              border={'none'}
                              color={'white'}
                              cursor={'pointer'}
                              className={'menu-item'}
                              display={'flex'}
                              justifyContent={'space-between'}
                              mt={5}
                              onClick={() => {HandleOptionClick('antenna', antenna.id)}}
                          >{antenna.name}<span className={'power-readout'}>{generateShorthandNumber(antenna.power)}</span></MenuItem>) }
                      </MenuGroup>
                  </MenuList>
              </Menu>
              {
                  antennas.map(antenna =>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                          <div className={'styled-div'}>
                              <div className={'icon-container'}>
                                  <img className={'icon'} src={`src/assets/communotrons/${antenna.name}.webp`}/>
                              </div>
                              <p>{antenna.name}<br/><span className={'power-readout'}>{generateShorthandNumber(antenna.power)}</span></p>
                          </div>
                          <button onClick={() => {
                              const idToRemove = antenna.id; // Extract the id for clarity
                              updateAntennas((prevAntennas) => prevAntennas.filter((del) => del.id !== idToRemove));
                          }} className={'delete-button'}><DeleteIcon/></button>
                      </div>
                  )
              }
          </div>
            {/*TODO: Use chakra UI menu component instead of select */}
            <div className={"settings-column"}>
                <p className={"text-centered white"}>Relays</p>
                <Menu flip={false} onChange={(e) => {
                    let id = e.target.value
                    updateRelays(
                        [
                            ...relays,
                            {
                                name: relayData[id].name,
                                power: relayData[id].power
                            }
                        ]
                    )
                }}>
                    <MenuButton cursor={'pointer'} className={'styled-button-alt'}>--- Select ---</MenuButton>
                    <MenuList border={'1px solid #676767'} borderRadius={10} w={'280px'} backgroundColor={'#1f1f1f'} padding={'10px'}>
                        <MenuGroup mt={0} mb={10} title={'Stock'} color={'white'}>
                            { relayData.map(relay => <MenuItem
                                value={relay.id}
                                background={'none'}
                                border={'none'}
                                color={'white'}
                                cursor={'pointer'}
                                className={'menu-item'}
                                display={'flex'}
                                justifyContent={'space-between'}
                                mt={5}
                                onClick={() => {HandleOptionClick('relay', relay.id)}}
                            >{relay.name}<span className={'power-readout'}>{generateShorthandNumber(relay.power)}</span></MenuItem>) }
                        </MenuGroup>
                    </MenuList>
                </Menu>
                {
                    relays.map(relay =>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <div className={'styled-div'}>
                                <div className={'icon-container'}>
                                    <img className={'icon'} src={`src/assets/relays/${relay.name}.webp`}/>
                                </div>
                                <p className={'component-name'}>{relay.name}<br/>
                                    <span className={'power-readout'}>{generateShorthandNumber(relay.power)}</span></p>
                            </div>
                            <button onClick={() => {
                                const idToRemove = relay.id; // Extract the id for clarity
                                updateRelays((prevRelays) => prevRelays.filter((del) => del.id !== idToRemove));
                            }} className={'delete-button'}><DeleteIcon/></button>
                        </div>
                    )
                }
            </div>
        </div>
      </div>
        <div className={'footer'}>
            <p>Created by<br/>Westbrooke117</p>
            <p className={'version-text'}>v1.0</p>
        </div>
    </>
  )
}

export default App
