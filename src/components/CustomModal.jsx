import {
    Button, FormControl, FormHelperText, FormLabel, Input,
    Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
} from "@chakra-ui/react";
import {useState} from "react";

const CustomModal = ({isOpen, onClose, addCustom, toShorthand, signalType}) => {
    const [customAntenna, setCustomAntenna] = useState({
        name: 'Custom Antenna',
        power: 0
    })
    const [customRelay, setCustomRelay] = useState({
        name: 'Custom Relay',
        power: 0
    })

    const HandleModalSubmit = (status, type) => {
        if (status === 'submit'){
            type === 'antenna' ?
                addCustom('antenna', customAntenna.name, customAntenna.power)
                :
                addCustom('relay', customRelay.name, customRelay.power)
        }

        //Reset state
        setCustomAntenna({
            name: 'Custom Antenna',
            power: 0
        })
        setCustomRelay({
            name: 'Custom Relay',
            power: 0
        })
    }

    return (
        <>
        {
            signalType === 'antenna' ?
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered={true}
                closeOnOverlayClick={false}
            >
                <ModalOverlay/>
                <ModalContent
                    backgroundColor={'#1F1F1F'}
                    border={'1px solid #676767'}
                    borderRadius={'20px'}
                >
                    <ModalBody>
                        <FormControl mb={5} mt={2}>
                            <FormLabel color={'white'}>Antenna Name (Optional)</FormLabel>
                            <Input border={'1px solid #434343'} color={'white'} onChange={(e) => setCustomAntenna({
                                ...customAntenna,
                                name: e.target.value
                            })} type={'text'}/>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel color={'white'}>Antenna Power</FormLabel>
                            <NumberInput border={'#434343'} color={'white'} min={1} onChange={(valueString) => setCustomAntenna({
                                ...customAntenna,
                                power: parseInt(valueString)
                            })}>
                                <NumberInputField/>
                            </NumberInput>
                            {
                                customAntenna.power < 0 ?
                                    <FormHelperText color={'#8a8a8a'}>-</FormHelperText>
                                    :
                                    <FormHelperText color={'#8a8a8a'}>{toShorthand(customAntenna.power)}</FormHelperText>
                            }
                        </FormControl>
                    </ModalBody>
                    <ModalFooter d={'flex'} justifyContent={'space-between'}>
                        <Button
                            color={'white'}
                            fontWeight={'normal'}
                            backgroundColor={'#9F2C2C'}
                            border={'1px solid #D76F6F'}
                            onClick={() => {
                                HandleModalSubmit()
                                onClose()
                            }}
                            className={'modal-close-button'}
                        >Close</Button>
                        <Button
                            color={'white'}
                            fontWeight={'normal'}
                            className={'modal-submit-button'}
                            onClick={() => {
                                HandleModalSubmit('submit','antenna')
                                onClose()
                            }}>Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            :
            <Modal
            isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        closeOnOverlayClick={false}
        >
        <ModalOverlay/>
        <ModalContent
            backgroundColor={'#1F1F1F'}
            border={'1px solid #676767'}
            borderRadius={'20px'}
        >
            <ModalBody>
                <FormControl mb={5} mt={2}>
                    <FormLabel color={'white'}>Relay Name (Optional)</FormLabel>
                    <Input border={'1px solid #434343'} color={'white'} onChange={(e) => setCustomRelay({
                        ...customRelay,
                        name: e.target.value
                    })} type={'text'}/>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel color={'white'}>Relay Power</FormLabel>
                    <NumberInput border={'#434343'} color={'white'} min={1} onChange={(valueString) => setCustomRelay({
                        ...customRelay,
                        power: parseInt(valueString)
                    })}>
                        <NumberInputField />
                    </NumberInput>
                    {
                        customRelay.power < 0 ?
                            <FormHelperText color={'#8a8a8a'}>-</FormHelperText>
                            :
                            <FormHelperText color={'#8a8a8a'}>{toShorthand(customRelay.power)}</FormHelperText>
                    }
                </FormControl>
            </ModalBody>
            <ModalFooter d={'flex'} justifyContent={'space-between'}>
                <Button
                    color={'white'}
                    fontWeight={'normal'}
                    backgroundColor={'#9F2C2C'}
                    border={'1px solid #D76F6F'}
                    onClick={() => {
                        HandleModalSubmit()
                        onClose()
                    }}
                    className={'modal-close-button'}
                >Close</Button>
                <Button
                    color={'white'}
                    fontWeight={'normal'}
                    className={'modal-submit-button'}
                    onClick={() => {
                        HandleModalSubmit('submit','relay')
                        onClose()
                    }}>Add</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
}
        </>
    )
}

export {CustomModal}