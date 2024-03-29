import {Image} from "@chakra-ui/react";
const MenuIcon = ({src}) => {
    return (
        <>
            <Image src={src} maxW={20} maxH={20} w={'auto'} h={'auto'}/>
        </>
    )
}

export { MenuIcon }