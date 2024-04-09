import {Image} from "@chakra-ui/react"
const PlanetIcon = ({name}) => {
    const moons = ["Gilly","Mun","Minmus","Ike","Laythe","Vall","Tylo","Bop","Pol"]

    return (
        <>
            {
                !moons.includes(name) ?
                    <Image w={10} src={`../../public/assets/system/${name}.webp`} alt={name}/>
                    :
                    <Image w={10} ml={10} src={`../../public/assets/system/${name}.webp`} alt={name}/>
            }
        </>
    )
}

export {PlanetIcon}