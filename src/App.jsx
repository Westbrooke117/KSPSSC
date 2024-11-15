import './App.css'
import distanceData from "./json/distances.json"
import antennaData from './json/antennas.json'
import relayData from './json/relays.json'
import {useEffect, useState} from "react";
import {
    Box,
    Button,
    Divider,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Text,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    UnorderedList,
    ListItem, HStack
} from "@chakra-ui/react";
import {ChevronDownIcon, DeleteIcon, SettingsIcon, SmallAddIcon} from "@chakra-ui/icons";
import {CustomModal} from "./components/CustomModal.jsx";

//Google Analytics Integration
import ReactGA from "react-ga4";
import {AppSettingsModal} from "./components/AppSettingsModal.jsx";
import {PlanetIcon} from "./components/PlanetIcon.jsx";
import {MotionGlobalConfig} from "framer-motion";
ReactGA.initialize("G-JERFZ4Z5W6");
const currentVersion = '1.0.2'

//TODO: Fix styling issue with reset button. Add local storage item for accessibility setting.

const App = () => {
    const [currentVersionCookie, setCurrentVersionCookie] = useState(localStorage.getItem('lastUsedVersion'))
    const [versionNotesModalActive, setVersionNotesModal] = useState(localStorage.getItem('lastUsedVersion') !== currentVersion);

    const [totalPower, setTotalPower] = useState(2000000000)

    const [dsnLevel, setDsnLevel] = useState(2000000000)
    const [antennas, updateAntennas] = useState([])
    const [relays, updateRelays] = useState([])

    const [endingDestination, setEndingDestination] = useState(4)

    const [minStrength, setMinStrength] = useState(0)
    const [maxStrength, setMaxStrength] = useState(0)

    const [activeSignalType, setActiveSignalType] = useState('Antenna')

    const [extraSettingsModalActive, toggleExtraSettingsModal] = useState(false)
    const [customAntennaModalActive, toggleAntennaModal] = useState(false)
    const [customRelayModalActive, toggleRelayModal] = useState(false)

    const [itemId, setItemId] = useState(0)

    const [rangeModifier, setRangeModifier] = useState(parseFloat(localStorage.getItem('rangeModifierValue')) || 1)
    const [DSNModifier, setDSNModifier] = useState(parseFloat(localStorage.getItem('DSNModifierValue')) || 1)


    useEffect(() => {
        MotionGlobalConfig.skipAnimations = JSON.parse(localStorage.getItem('disableAnimations')) || false

        if (rangeModifier || DSNModifier !== 1) {
            localStorage.setItem("DSNModifierValue", DSNModifier.toString())
            localStorage.setItem("rangeModifierValue", rangeModifier.toString())
        }

        if (antennas.length === 0 && relays.length > 0){
            setActiveSignalType('Relay')
        }
        if (relays.length === 0 && antennas.length > 0){
            setActiveSignalType('Antenna')
        }

        const calculateSignalStrength = (distance) => {
            let x = Math.min(1 - distanceData[endingDestination][distance] / Math.round(Math.sqrt((dsnLevel * DSNModifier) * (activeSignalType === 'Relay' ? calculateTotalPower().relayTotal : calculateTotalPower().antennaTotal))), 1)
            x = Math.max(x, 0)

            return Math.round(((3-2 * x) * x ** 2) * 100)
        }

        setMinStrength(calculateSignalStrength('min'))
        setMaxStrength(calculateSignalStrength('max'))

        setTotalPower(Math.floor(Math.sqrt((dsnLevel * DSNModifier) * (activeSignalType === 'Relay' ? calculateTotalPower().relayTotal : calculateTotalPower().antennaTotal))))
  },[dsnLevel, antennas, relays, endingDestination, activeSignalType, rangeModifier, DSNModifier])

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

      let antennaTotal = antennas.reduce(calculateSum, 0) * rangeModifier
      let relayTotal = relays.reduce(calculateSum, 0) * rangeModifier

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
        toggleExtraSettingsModal(false)
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

    const closeVersionModal = () => {
        localStorage.setItem('lastUsedVersion', currentVersion)
        setVersionNotesModal(false)
    }

    const updateModifiers = (setting, value) => {
        switch (setting){
            case 'rangeModifier':
                setRangeModifier(value)
                break;
            case 'DSNModifier':
                setDSNModifier(value)
                break;
        }
    }

  return (
    <div>
        {
            <Modal isOpen={versionNotesModalActive} onClose={closeVersionModal}>
                <ModalOverlay />
                <ModalContent
                    backgroundColor={'#1F1F1F'}
                    border={'1px solid #676767'}
                    borderRadius={'20px'}
                >
                    <ModalHeader color={'white'}>
                        <HStack alignItems={'center'}>
                            <Text>Minor Update v{currentVersion}</Text>
                            <Box borderRadius={'full'}>
                                <Image
                                    ml={3}
                                    w={12}
                                    src={'https://img.icons8.com/m_rounded/512/FFFFFF/github.png'}
                                    cursor={'pointer'}
                                    title={'View on GitHub'}
                                    onClick={() => window.open('https://github.com/Westbrooke117/KSPSSC', '_blank')}
                                />
                            </Box>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton color={'white'}/>
                    <ModalBody>
                        <Text color={'white'} mb={3}>What's new?</Text>
                        <UnorderedList color={'white'}>
                            <ListItem >The browser will now remember modifier and accessibility settings between sessions</ListItem>
                            <ListItem>Fixed a styling bug which made it hard to see the reset button on the settings page</ListItem>
                            <ListItem>Added this popup for updates</ListItem>
                        </UnorderedList>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            className="modal-close-button"
                            color={'white'}
                            fontWeight={'normal'}
                            backgroundColor={'#9F2C2C'}
                            border={'1px solid #D76F6F'}
                            onClick={() => {
                                closeVersionModal()
                            }}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        }
      <Box className={"title"} mt={10} mb={10}>
        <Text style={{color: "white", fontSize: 32}} textAlign={'center'}>KSP Signal Strength Calculator</Text>
      </Box>
      <div className={"signal-mode-selection-container"}>
          <div className={'signal-mode-wrapper'}>
              <button style={{marginRight: '10px'}} className={`signal-mode-selection ${activeSignalType === 'Antenna' ? 'active-button' : ''}`} onClick={() => setActiveSignalType('Antenna')}>Antenna Power</button>
              <div className={'vertical-divider'}></div>
              <button style={{marginLeft: '10px'}} className={`signal-mode-selection ${activeSignalType === 'Relay' ? 'active-button' : ''}`} onClick={() => setActiveSignalType('Relay')}>Relay Power</button>
          </div>
      </div>
      <Box className={"main-content-container"}>
          <Box className={"planet-container"} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
              <Menu
                  defaultValue={3}
                  flip={false}
              >
                  <MenuButton
                      backgroundColor={'#1F1F1F'}
                      pt={1}
                      pb={1}
                      pl={4}
                      pr={4}
                      mb={2}
                      borderRadius={10}
                      border={'1px solid #676767'}
                      color={'white'}
                  >Kerbin<ChevronDownIcon ml={1}/></MenuButton>
                  <MenuList
                      color={'white'}
                      maxHeight={'50vh'}
                      className={'planet-select'}
                      backgroundColor={'#1F1F1F'}
                      border={'1px solid #676767'}
                      overflowY={'scroll'}
                  >
                      <MenuItem
                          icon={<PlanetIcon name={"Kerbin"}/>}
                          backgroundColor={'#1F1F1F'}
                          className={'planet-list-item'}
                          h={50}
                      >
                          Kerbin
                      </MenuItem>
                  </MenuList>
              </Menu>
              <Image
                  pb={10}
                  w={200}
                  minW={100}
                  src={`assets/system/kerbin.webp`}
              />
          </Box>
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
        <Box className={"planet-container"} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Menu flip={false}>
              <MenuButton
                  backgroundColor={'#1F1F1F'}
                  pt={1}
                  pb={1}
                  pl={4}
                  pr={4}
                  mb={2}
                  borderRadius={10}
                  border={'1px solid #676767'}
                  color={'white'}
                >{distanceData[endingDestination].name}<ChevronDownIcon ml={1}/></MenuButton>
              <MenuList
                  overflowY={'scroll'}
                  maxHeight={'50vh'}
                  border={'1px solid #676767'}
                  borderRadius={10}
                  color={'white'}
                  pt={2}
                  pb={2}
                className={'planet-select'}
                backgroundColor={'#1F1F1F'}
              >
                {
                    distanceData.map(planet => (
                        <MenuItem
                            isDisabled={planet.id === 3}
                            className={'planet-list-item'}
                            icon={<PlanetIcon name={planet.name}/>}
                            backgroundColor={'#1F1F1F'}
                            onClick={() => setEndingDestination(planet.id)}
                            h={50}
                            value={planet.id}>
                            {planet.name}
                        </MenuItem>
                    ))
                }
            </MenuList>
          </Menu>
            <Image
                pb={10}
                w={200}
                minW={100}
                src={`assets/system/${(distanceData[endingDestination].name).toLowerCase()}.webp`}
            />
        </Box>
      </Box>
        <AppSettingsModal
            isOpen={extraSettingsModalActive}
            onClose={onClose}
            updateModifiers={updateModifiers}
            rangeModifierValue={rangeModifier}
            dsnModifierValue={DSNModifier}
        />
        <Box className={'centered'}>
            <Box display={'flex'} justifyContent={'space-between'} w={'1150px'} flexDirection={'row'}>
                {/*/Dummy element below to maintain flex alignment/*/}
                <Button
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    w={10}
                    visibility={'hidden'}
                ></Button>

                <Box className={"total-power"}><Text p={2}>Total {activeSignalType} Power: <span className={'power-readout'}>{totalPower.toLocaleString()}</span></Text></Box>

                <Box
                    className={'total-power'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    borderRadius={7}
                    w={10}
                >
                    <Button className={'settings-icon'} color={'white'} backgroundColor={'black'} onClick={() => {toggleExtraSettingsModal(true)}}>
                        <SettingsIcon/>
                    </Button>
                </Box>
            </Box>
        </Box>
      <Box className={"centered"}>
        <Box className={"settings-container"} maxW={1150} minW={600}>
          <Box className={"settings-column"}>
            <Text mt={3} mb={3} className={"text-centered white"}>Tracking Station Level</Text>
            <button
                className={`${dsnLevel === 2000000000 ? "button-active" : "button-inactive"} styled-button-alt`}
                onClick={() => {setDsnLevel(2000000000)}}
            >Level 1<br/>
                {
                    DSNModifier == 1 ?
                        <span className={'power-readout'}>2.00G</span>
                        :
                        <span className={'power-readout'}>2.00G <span className={'custom-difficulty-power'}>({generateShorthandNumber(2000000000 * DSNModifier)})</span></span>
                }
            </button>
            <button
                className={`${dsnLevel === 50000000000 ? "button-active" : "button-inactive"} styled-button-alt`}
                onClick={() => {setDsnLevel(50000000000)}}
            >Level 2<br/>
                {
                    DSNModifier == 1 ?
                        <span className={'power-readout'}>50.00G</span>
                        :
                        <span className={'power-readout'}>50.00G <span className={'custom-difficulty-power'}>({generateShorthandNumber(50000000000 * DSNModifier)})</span></span>
                }
            </button>
            <button
                className={`${dsnLevel === 250000000000 ? "button-active" : "button-inactive"} styled-button-alt`}
                onClick={() => {setDsnLevel(250000000000)}}
            >Level 3<br/>
                {
                    DSNModifier == 1 ?
                        <span className={'power-readout'}>250.00G</span>
                        :
                        <span className={'power-readout'}>250.00G <span className={'custom-difficulty-power'}>({generateShorthandNumber(250000000000 * DSNModifier)})</span></span>
                }
            </button>
          </Box>
          <Box className={"settings-column"}>
            <Text mt={3} mb={3} className={"text-centered white"}>Direct Antennas</Text>
              <CustomModal isOpen={customAntennaModalActive} onClose={onClose} addCustom={addCustom} toShorthand={generateShorthandNumber} signalType={'antenna'}/>
              <Menu flip={false}>
                  <MenuButton className={'styled-button-alt'}>--- Select ---</MenuButton>
                  <MenuList border={'1px solid #676767'} borderRadius={10} w={'300px'} backgroundColor={'#1f1f1f'} padding={'10px'}>
                      <MenuGroup>
                          { antennaData.map(antenna =>
                              <MenuItem
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
                              >{antenna.name}
                                  {

                                  }
                                  <span className={'power-readout'}>{generateShorthandNumber(antenna.power)}</span>
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
                              <p className={'component-name'}>{antenna.name}<br/>
                                  <span className={'power-readout'}>{generateShorthandNumber(antenna.power)} </span>
                                  {
                                      rangeModifier != 1 &&
                                        <span className={'custom-difficulty-power'}>({generateShorthandNumber(antenna.power * rangeModifier)})</span>
                                  }
                              </p>
                          </div>
                          <button onClick={() => {
                              const idToRemove = antenna.id; // Extract the id for clarity
                              updateAntennas((prevAntennas) => prevAntennas.filter((del) => del.id !== idToRemove));
                          }} className={'delete-button'}><DeleteIcon/></button>
                      </div>
                  )
              }
          </Box>
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
                                    <span className={'power-readout'}>{generateShorthandNumber(relay.power)} </span>
                                    {
                                        rangeModifier != 1 &&
                                        <span className={'custom-difficulty-power'}>({generateShorthandNumber(relay.power * rangeModifier)})</span>
                                    }
                                </p>
                            </div>
                            <button onClick={() => {
                                const idToRemove = relay.id; // Extract the id for clarity
                                updateRelays((prevRelays) => prevRelays.filter((del) => del.id !== idToRemove));
                            }} className={'delete-button'}><DeleteIcon/></button>
                        </div>
                    )
                }
            </div>
        </Box>
      </Box>
        <div className={'footer'}>
            <Box cursor={'pointer'} onClick={() => setVersionNotesModal(true)}>
                <Text className={'version-text info-link'}>v{currentVersion}</Text>
            </Box>
        </div>
    </div>
  )
}

export default App
