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

    const [skipAnimations, toggleSkipAnimations] = useState(JSON.parse(localStorage.getItem('disableAnimations')))
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
                    <HStack alignItems={'baseline'} justifyContent={'space-between'}>
                        <Text mb={2} mt={2} fontSize={18}>Gameplay</Text>
                        <Button
                            variant={'unstyled'}
                            fontWeight={'normal'}
                            fontSize={18}
                            color={'white'}
                            onClick={() => {
                                updateModifiers('rangeModifier', 1)
                                localStorage.setItem('rangeModifierValue', "1")

                                updateModifiers('DSNModifier', 1)
                                localStorage.setItem('DSNModifierValue', "1")
                            }}>
                            Reset?
                        </Button>
                    </HStack>
                    <Box backgroundColor={'#2B2B2B'} p={3} borderRadius={10}>
                        <Box>
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
                    </Box>
                    <Text mb={2} mt={4} fontSize={18}>Accessibility</Text>
                    <Box backgroundColor={'#2B2B2B'} p={3} borderRadius={10}>
                        <FormControl display='flex' alignItems='center'>
                            <FormLabel htmlFor='animation-toggle' mb='0'>
                                Disable animations
                            </FormLabel>
                            <Switch
                                isChecked={skipAnimations === true}
                                id='animation-toggle'
                                onChange={() => {
                                    localStorage.setItem('disableAnimations', JSON.stringify(!skipAnimations))
                                    toggleSkipAnimations(!skipAnimations)
                                }}
                            />
                        </FormControl>
                    </Box>
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