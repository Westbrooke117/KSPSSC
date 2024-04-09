import {
    Box,
    Button, CloseButton, Divider, FormControl, FormLabel, HStack, Input,
    Modal,
    ModalBody,
    ModalContent, ModalFooter, ModalHeader,
    ModalOverlay,
    Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch,
    Text
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {MotionGlobalConfig} from "framer-motion";

const AppSettingsModal = ({isOpen, onClose, updateModifiers, rangeModifierValue, dsnModifierValue}) => {
    const HandleInput = (setting, value) => {
        updateModifiers(setting, value)
    }

    const [skipAnimations, toggleSkipAnimations] = useState(false)
    MotionGlobalConfig.skipAnimations = skipAnimations

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered={true}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent
                backgroundColor={'#1F1F1F'}
                border={'1px solid #676767'}
                borderRadius={'20px'}
                color={'white'}
            >
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <ModalHeader fontWeight={'normal'}>Settings</ModalHeader>
                    <CloseButton mr={4} onClick={onClose}/>
                </Box>
                <Divider/>
                <ModalBody>
                    <Box>
                        <HStack alignItems={'center'} justifyContent={'space-between'}>
                            <Text mb={3} mt={2} fontSize={18}>Gameplay</Text>
                            <Button
                                variant={'ghost'}
                                fontWeight={'normal'}
                                fontSize={18}
                                onClick={() => {
                                    updateModifiers('rangeModifier', 1)
                                    updateModifiers('DSNModifier', 1)
                                }}>
                                Reset?
                            </Button>
                        </HStack>
                        <HStack>
                            <Text>Range Modifier:</Text>
                            <Input
                                variant={'unstyled'}
                                type={'number'}
                                value={rangeModifierValue}
                                onChange={(e) => HandleInput('rangeModifier', e.target.value)}
                                w={20}
                            ></Input>
                        </HStack>
                        <Slider
                            aria-label='slider-ex-1'
                            defaultValue={1}
                            value={rangeModifierValue}
                            min={0.10}
                            max={10}
                            step={0.1}
                            focusThumbOnChange={false}
                            colorScheme={'gray'}
                            onChange={(value) => updateModifiers('rangeModifier', value)}
                        ><SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                            <SliderThumb/>
                        </Slider>
                    </Box>
                    <Box>
                        <HStack>
                            <Text>DSN Modifier:</Text>
                            <Input
                                variant={'unstyled'}
                                value={dsnModifierValue}
                                onChange={(e) => HandleInput('DSNModifier', e.target.value)}
                                w={20}
                            ></Input>
                        </HStack>
                        <Slider
                            aria-label='slider-ex-1'
                            defaultValue={1}
                            value={dsnModifierValue}
                            min={0.1}
                            max={10}
                            step={0.1}
                            focusThumbOnChange={false}
                            colorScheme={'gray'}
                            onChange={(value) => updateModifiers('DSNModifier', value)}
                        ><SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box>
                    <Divider mt={3} mb={3}/>
                    <Text mb={3} mt={2} fontSize={18}>Accessibility</Text>
                    <FormControl display='flex' alignItems='center'>
                        <FormLabel htmlFor='animation-toggle' mb='0'>
                            Disable animations
                        </FormLabel>
                        <Switch
                            isChecked={skipAnimations === true}
                            id='animation-toggle'
                            onChange={() => toggleSkipAnimations(!skipAnimations)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color={'white'}
                        fontWeight={'normal'}
                        backgroundColor={'#9F2C2C'}
                        border={'1px solid #D76F6F'}
                        className={'modal-close-button'}
                        onClick={onClose}
                    >Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export { AppSettingsModal }