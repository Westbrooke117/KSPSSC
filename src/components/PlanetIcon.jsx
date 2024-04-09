import {Image} from "@chakra-ui/react"
const PlanetIcon = ({name}) => {
    const moons = ["Gilly","Mun","Minmus","Ike","Laythe","Vall","Tylo","Bop","Pol"]
    console.log(name.toLowerCase())

    return (
        <>
            {
                !moons.includes(name) ?
                    <Image w={10} src={`assets/system/${name.toLowerCase()}.webp`} alt={name}/>
                    :
                    <Image w={10} ml={10} src={`assets/system/${name.toLowerCase()}.webp`} alt={name}/>
            }
        </>
    )
}

export {PlanetIcon}