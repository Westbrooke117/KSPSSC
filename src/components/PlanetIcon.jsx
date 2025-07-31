import {Image} from "@chakra-ui/react"
const PlanetIcon = ({name, stock}) => {
    const moons = ["Gilly","Mun","Minmus","Ike","Laythe","Vall","Tylo","Bop","Pol","Hale","Ovok","Eeloo (OPM)", "Slate","Tekto","Polta","Priax","Wal","Tal","Thatmo","Nissee","Karen"]

    // No images for OPM planets. Use placeholder image instead.
    let url;
    if (!stock){
        url = "assets/system/placeholder.png"
    } else {
        url = `assets/system/${name.toLowerCase()}.webp`
    }

    return (
        <>
            {
                !moons.includes(name) ?
                    <Image w={10} src={url} alt={"?"}/>
                    :
                    <Image w={10} ml={10} src={url} alt={"?"}/>
            }
        </>
    )
}

export {PlanetIcon}