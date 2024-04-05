import './App.css'
import distanceData from "./json/distances.json"
import antennaData from './json/antennas.json'
import relayData from './json/relays.json'
import {useEffect, useState} from "react";
import {
    Box,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Text
} from "@chakra-ui/react";
import {DeleteIcon, SmallAddIcon} from "@chakra-ui/icons";
import {CustomModal} from "./components/CustomModal.jsx";

//Google Analytics Integration
import ReactGA from "react-ga4";
ReactGA.initialize("G-JERFZ4Z5W6");

const App = () => {
    const [totalPower, setTotalPower] = useState(2000000000)

    const [dsnLevel, setDsnLevel] = useState(2000000000)
    const [antennas, updateAntennas] = useState([])
    const [relays, updateRelays] = useState([])

    const [endingDestination, setEndingDestination] = useState(3)

    const [minStrength, setMinStrength] = useState(0)
    const [maxStrength, setMaxStrength] = useState(0)

    const [activeSignalType, setActiveSignalType] = useState('Antenna')

    const [customAntennaModalActive, toggleAntennaModal] = useState(false)
    const [customRelayModalActive, toggleRelayModal] = useState(false)

    const [itemId, setItemId] = useState(0)

    useEffect(() => {

        if (antennas.length === 0 && relays.length > 0){
            setActiveSignalType('Relay')
        }
        if (relays.length === 0 && antennas.length > 0){
            setActiveSignalType('Antenna')
        }

        const calculateSignalStrength = (distance) => {
            console.log(antennas)
            let x = Math.min(1 - distanceData[endingDestination][distance] / Math.round(Math.sqrt(dsnLevel * (activeSignalType === 'Relay' ? calculateTotalPower().relayTotal : calculateTotalPower().antennaTotal))), 1)
            x = Math.max(x, 0)

            return Math.round(((3-2 * x) * x ** 2) * 100)
        }

        setMinStrength(calculateSignalStrength('min'))
        setMaxStrength(calculateSignalStrength('max'))

        setTotalPower(Math.floor(Math.sqrt(dsnLevel * (activeSignalType === 'Relay' ? calculateTotalPower().relayTotal : calculateTotalPower().antennaTotal))))
  },[dsnLevel, antennas, relays, endingDestination, activeSignalType])

    const generateShorthandNumber = (power) => {
        if (power === 0 || isNaN(power)){ return `-` }
        if (power < 1000){ return power }
        if (power < 1000000){ return `${(power/1000).toFixed(2)}k` }              //A Thousand
        if (power < 1000000000){ return `${(power/1000000).toFixed(2)}M` }        //A Million
        if (power < 1000000000000){ return `${(power/1000000000).toFixed(2)}G` }  //A Billion
        else { return `${(power/1000000000000).toFixed(2)}T` }                    //A Trillion and over
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

    const onClose = () => {
        toggleAntennaModal(false)
        toggleRelayModal(false)
    }

    const addCustom = (type, name, power) => {
        setItemId(itemId + 1)

        switch (type){
            case 'antenna':
                updateAntennas([
                    ...antennas,
                    {
                        id: itemId,
                        name: name,
                        power: power
                    }
                ])
                break;
            case 'relay':
                updateRelays([
                    ...relays,
                    {
                        id: itemId,
                        name: name,
                        power: power
                    }
                ])
                break;
        }
    }

  return (
    <div>
      <Box className={"title"} mt={10} mb={10}>
        <Text style={{color: "white", fontSize: 32}}>KSP Signal Strength Calculator</Text>
      </Box>
      <div className={"signal-mode-selection-container"}>
          <div className={'signal-mode-wrapper'}>
              <button style={{marginRight: '10px'}} className={`signal-mode-selection ${activeSignalType === 'Antenna' ? 'active-button' : ''}`} onClick={() => setActiveSignalType('Antenna')}>Antenna Mode</button>
              <div className={'vertical-divider'}></div>
              <button style={{marginLeft: '10px'}} className={`signal-mode-selection ${activeSignalType === 'Relay' ? 'active-button' : ''}`} onClick={() => setActiveSignalType('Relay')}>Relay Mode</button>
          </div>
      </div>
      <div className={"main-content-container"}>
          <div className={"planet-container"} style={{backgroundImage: 'url(assets/system/kerbin.webp)', backgroundSize: 'cover'}}>
              <select className={'planet-select'} style={{width: 'fit-content', height: 'fit-content'}}>
                  <option>Kerbin</option>
              </select>
          </div>
        <div className={"connection-container"}>
          <Box mb={25} style={{borderBottom: minStrength !== 0 ? `3px solid hsl(${minStrength}, 100%, 60%)` : `3px dotted white`, height: 25, width: 500}}>
              <Text className={"text-centered white"}>
                  {
                      minStrength !== 0 ?
                          `${minStrength}% strength at min distance`
                          :
                          `No connection at min distance`
                  }
              </Text>
          </Box>
          <Box style={{borderBottom: maxStrength !== 0 ? `3px solid hsl(${maxStrength}, 100%, 60%)` : `3px dotted white`, height: 25, width: 500, marginBottom: 35}}>
              {
                  maxStrength !== 0 ?
                      <Text className={"text-centered white"}>{maxStrength}% strength at max distance</Text>
                      :
                      <Text className={"text-centered white"}>No connection at max distance</Text>
              }
          </Box>
        </div>
        <div className={"planet-container"} style={{backgroundImage: `url(assets/system/${(distanceData[endingDestination].name).toLowerCase()}.webp)`, backgroundSize: 'cover'}}>
          <select className={'planet-select'} style={{width: 'fit-content', height: 'fit-content'}} defaultValue={3} onChange={(e) => setEndingDestination(parseInt(e.target.value))}>
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
          <Text
              p={2}
          >Total {activeSignalType} Power: <span className={'power-readout'}>{totalPower.toLocaleString()}</span></Text>
        </div>
      </div>
      <div className={"centered"}>
        <div className={"settings-container"}>
          <div className={"settings-column"}>
            <Text mt={3} mb={3} className={"text-centered white"}>Tracking Station Level</Text>
            <button className={`${dsnLevel === 2000000000 ? "button-active" : "button-inactive"} styled-button-alt`} onClick={() => {setDsnLevel(2000000000)}}>Level 1<br/><span className={'power-readout'}>2.00G</span></button>
            <button className={`${dsnLevel === 50000000000 ? "button-active" : "button-inactive"} styled-button-alt`} onClick={() => {setDsnLevel(50000000000)}}>Level 2<br/><span className={'power-readout'}>50.00G</span></button>
            <button className={`${dsnLevel === 250000000000 ? "button-active" : "button-inactive"} styled-button-alt`} onClick={() => {setDsnLevel(250000000000)}}>Level 3<br/><span className={'power-readout'}>250.00G</span></button>
          </div>
          <div className={"settings-column"}>
            <Text mt={3} mb={3} className={"text-centered white"}>Direct Antennas</Text>
              <CustomModal isOpen={customAntennaModalActive} onClose={onClose} addCustom={addCustom} toShorthand={generateShorthandNumber} signalType={'antenna'}/>
              <Menu flip={false}>
                  <MenuButton className={'styled-button-alt'}>--- Select ---</MenuButton>
                  <MenuList border={'1px solid #676767'} borderRadius={10} w={'300px'} backgroundColor={'#1f1f1f'} padding={'10px'}>
                      <MenuGroup>
                          { antennaData.map(antenna => <MenuItem
                              value={antenna.id}
                              background={'none'}
                              border={'none'}
                              color={'white'}
                              cursor={'pointer'}
                              className={'menu-item'}
                              display={'flex'}
                              p={1}
                              justifyContent={'space-between'}
                              onClick={() => {HandleOptionClick('antenna', antenna.id)}}
                          >{antenna.name}<span className={'power-readout'}>{generateShorthandNumber(antenna.power)}</span></MenuItem>) }
                      </MenuGroup>
                      <MenuDivider/>
                      <MenuItem
                          background={'none'}
                          border={'none'}
                          color={'white'}
                          cursor={'pointer'}
                          className={'menu-item'}
                          display={'flex'}
                          p={1}
                          onClick={() => toggleAntennaModal(!customAntennaModalActive)}
                      >
                          <SmallAddIcon mr={2}/>
                          Custom Antenna
                      </MenuItem>
                  </MenuList>
              </Menu>
              {
                  antennas.map(antenna =>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                          <div className={'styled-div'}>
                              <div className={'icon-container'}>
                                  <img
                                      className={'icon'}
                                      src={`assets/communotrons/${antenna.name}.webp`}
                                      onError={({ currentTarget }) => {
                                          currentTarget.onerror = null;
                                          currentTarget.src="assets/nosrc.png";
                                      }}
                                  />
                              </div>
                              <p className={'component-name'}>{antenna.name}<br/><span className={'power-readout'}>{generateShorthandNumber(antenna.power)}</span></p>
                          </div>
                          <button onClick={() => {
                              const idToRemove = antenna.id; // Extract the id for clarity
                              updateAntennas((prevAntennas) => prevAntennas.filter((del) => del.id !== idToRemove));
                          }} className={'delete-button'}><DeleteIcon/></button>
                      </div>
                  )
              }
          </div>
            <div className={"settings-column"}>
                <Text mb={3} mt={3} className={"text-centered white"}>Relays</Text>
                <CustomModal isOpen={customRelayModalActive} onClose={onClose} addCustom={addCustom} toShorthand={generateShorthandNumber} signalType={'relay'}/>
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
                    <MenuList border={'1px solid #676767'} borderRadius={10} w={'300px'} backgroundColor={'#1f1f1f'} padding={'10px'}>
                        <MenuGroup>
                            { relayData.map(relay => <MenuItem
                                value={relay.id}
                                background={'none'}
                                border={'none'}
                                color={'white'}
                                cursor={'pointer'}
                                className={'menu-item'}
                                display={'flex'}
                                p={1}
                                justifyContent={'space-between'}
                                onClick={() => {HandleOptionClick('relay', relay.id)}}
                            >
                                <span className={'relay-span'}>{relay.name}</span>
                                <span className={'power-readout'}>{generateShorthandNumber(relay.power)}</span>
                            </MenuItem>) }
                        </MenuGroup>
                        <MenuDivider/>
                        <MenuItem
                            background={'none'}
                            border={'none'}
                            color={'white'}
                            cursor={'pointer'}
                            className={'menu-item'}
                            display={'flex'}
                            p={1}
                            onClick={() => toggleRelayModal(!customRelayModalActive)}
                        >
                            <SmallAddIcon mr={2}/>
                            Custom Relay
                        </MenuItem>
                    </MenuList>
                </Menu>
                {
                    relays.map(relay =>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <div className={'styled-div'}>
                                <div className={'icon-container'}>
                                    <img
                                         className={'icon'}
                                         src={`assets/relays/${relay.name}.webp`}
                                         onError={({ currentTarget }) => {
                                             currentTarget.onerror = null;
                                             currentTarget.src="assets/nosrc.png";
                                         }}
                                    />
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
            <p>Created by<br/><a className={'info-link'} target={'_blank'} href={'https://www.reddit.com/user/Westbrooke117/'} rel="noreferrer">Westbrooke117</a></p>
            <p className={'version-text info-link'}><a target={'_blank'} href={'https://github.com/Westbrooke117/KSPSSC'} rel={'noreferrer'}>v1.0</a></p>
        </div>
    </div>
  )
}

export default App
