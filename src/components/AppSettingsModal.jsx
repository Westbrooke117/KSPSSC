import {
    Box,
    Button, HStack, Input,
    Modal,
    ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader,
    ModalOverlay,
    Slider, SliderFilledTrack, SliderThumb, SliderTrack,
    Text
} from "@chakra-ui/react";
import {useEffect, useState} from "react";

const AppSettingsModal = ({isOpen, onClose, updateModifiers, rangeModifierValue, dsnModifierValue}) => {

    const HandleInput = (setting, value) => {
        updateModifiers(setting, value)
    }

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
                <ModalHeader fontWeight={'normal'}>Extra Settings</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Box mb={3}>
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
                            min={0}
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