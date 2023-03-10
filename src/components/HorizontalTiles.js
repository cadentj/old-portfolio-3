import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, ScrollControls, Scroll, useScroll, Text, KeyboardControls, useKeyboardControls } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import { Minimap } from './Minimap'
import { state, damp } from './util'
import { Vector3 } from "three";
import { Box } from '@mui/system'


import { Outlet, useNavigate } from 'react-router-dom'

import '../styles/tiles.css';


import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'

import Montseratt from './../fonts/Montserrat/static/Montserrat-SemiBold.ttf'

const dummy = new Vector3()
let xDim;
const titles = ["BRICK2 BYTE", "HOUSING MODEL", "EMAIL BOT", "THUNDER DASH", "CODE CLUB", "AI CLUB"]
const pageLinks = ["btb", "HOUSING MODEL", "EMAIL BOT", "THUNDER DASH", "CODE CLUB", "AI CLUB"]
const colors = ["#484A68", "#ECE8DE", "#DE4C3F", "#DE4C3F", "#DE4C3F", "#DE4C3F"]
const textColors = ["#FFF1CE", "#55729C", "#FFF1CE", "#FFF1CE", "#FFF1CE", "#FFF1CE"]

let keyPressed;

function Item({ index, position, scale, c = new THREE.Color(), ...props }) {

    // let navigate = useNavigate();484A68

    // function handleClick(page) {
    //     navigate(page);
    // }

    const ref = useRef()
    const scroll = useScroll()
    const { clicked, urls } = useSnapshot(state)
    const [hovered, hover] = useState(false)

    const click = () => {
        state.clicked = index === clicked ? null : index
        props.setTitles(titles[index])
        props.setLink(pageLinks[index])
        props.setColor(colors[index])
        props.setTextColor(textColors[index])
    }


    const over = () => hover(true)
    const out = () => hover(false)

    function unclick() {
        state.clicked = null
        props.setTitles("")
        props.setLink("")
        props.setColor("#141414")
    }

    function change(newIndex) {
        state.clicked = newIndex
        props.setTitles(titles[newIndex])
        props.setLink(pageLinks[newIndex])
        props.setColor(colors[newIndex])
        props.setTextColor(textColors[newIndex])
    }

    function checkClicked() {
        return state.clicked == null
    }

    useFrame((state, delta) => {
        const difference = scroll.offset * xDim
        const newIndex = (clicked === null) ? 0 : index - clicked;
        const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
        ref.current.material.scale[1] = ref.current.scale.y = damp(ref.current.scale.y, (clicked !== null) ? 5.5 : 4 + y, 4, delta)
        ref.current.material.scale[0] = ref.current.scale.x = damp(ref.current.scale.x, (clicked !== null) ? 8 : scale[0], 6, delta)

        // Switch to 0.85 and clicked===index to have normal tiling
        if (clicked !== null && index < clicked) ref.current.position.x = damp(ref.current.position.x, difference + (newIndex * 4.85) - 4, 6, delta)
        if (clicked !== null && index > clicked) ref.current.position.x = damp(ref.current.position.x, difference + (newIndex * 4.85) + 4, 6, delta)
        if (clicked === null) ref.current.position.x = damp(ref.current.position.x, position[0], 6, delta)

        if (clicked === index) ref.current.position.x = damp(ref.current.position.x, difference, 6, delta)

        // if (scroll.delta > 0.0005 || checkClicked()) unclick()
        if (checkClicked()) unclick()

        // 37 is left arrow, 39 is right arrow
        if (keyPressed == 37 && (clicked != 0 && clicked != null)) {
            change(clicked - 1)
            keyPressed = null
        } else if (keyPressed == 39 && (clicked != urls.length - 1 && clicked != null)) {
            change(clicked + 1)
            keyPressed = null
        }


        ref.current.material.grayscale = damp(ref.current.material.grayscale, hovered || clicked === index ? 0 : Math.max(0, 1 - y), 6, delta)
        ref.current.material.color.lerp(c.set(hovered || clicked === index ? 'white' : '#aaa'), hovered ? 0.3 : 0.1)
    })
    return <Image ref={ref} {...props} position={position} scale={scale} height={2} onClick={click} onPointerOver={over} onPointerOut={out} />
}

function Items({ w = 0.7, gap = 0.15, setTitles, setLink, setColor, setTextColor }) {
    const { urls } = useSnapshot(state)
    const { width } = useThree((state) => state.viewport)
    const xW = w + gap
    xDim = xW * (urls.length - 1)
    return (
        <ScrollControls horizontal damping={0.40} pages={(width - xW + urls.length * xW) / width}>
            <Minimap />
            <Scroll>
                {urls.map((url, i) => <Item key={i} index={i} position={[xW * i, 0, 0]} scale={[w, 4, 1]} url={url} setTitles={setTitles} setLink={setLink} setColor={setColor} setTextColor={setTextColor} />) /* prettier-ignore */}
            </Scroll>
        </ScrollControls>
    )
}

function Screen(props) {
    const [titleTop, setTop] = useState("");
    const [titleBottom, setBottom] = useState("");
    const [link, setLink] = useState("");
    const [textColor, setTextColor] = useState("");

    function setTitles(title) {
        const split = title.split(' ')
        setTop(split[0])
        setBottom(split[1])
    }



    return (

        <>
            <Text
                scale={[1, 1, 10]}
                position={[0, 1.5, 0]}
                color={textColor} // default
                font={Montseratt}
                letterSpacing={0.3}
            >
                {titleTop}
            </Text>
            <Text
                scale={[.15, .15, 10]}
                position={[0, -2.5, 0]}
                color={textColor} // default
                font={Montseratt}
                letterSpacing={0.3}
                onClick={() => props.handleClick(link)}
            >
                {link}
            </Text>
            <Text
                scale={[1, 1, 10]}
                position={[0, -1.5, 0]}
                color={textColor} // default
                font={Montseratt}
                letterSpacing={0.3}
            >
                {titleBottom}
            </Text>
            <Items setTitles={setTitles} setLink={setLink} setColor={props.setColor} setTextColor={setTextColor} />
        </>
    )
}

function Stars(props) {
    const ref = useRef();

    useFrame((state) => { ref.current.rotation.y += 0.0005 })

    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 200 }))
    return (
        <group >
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial transparent color="#ffffff" size={0.3} sizeAttenuation={true} depthWrite={false} />
            </Points>
        </group>
    )
}

export default function HorizontalTiles() {
    const [color, setColor] = useState("#141414");

    let navigate = useNavigate();

    async function handleClick(page) {
        let new_page = "/" + page
        navigate(new_page);
    }

    const [titleTop, setTop] = useState("");

    function onKeyPressed(e) {
        keyPressed = e.keyCode
    }

    return (
        <>
            <div
                onKeyDown={onKeyPressed}
                tabIndex={0}
            >
                <KeyboardControls
                    map={[
                        { name: "left", keys: ["ArrowLeft"] },
                        { name: "right", keys: ["ArrowRight"] },
                    ]}>
                    <Box sx={{ height: '100vh', width: '100%', position: 'fixed', backgroundColor: color }} className="background" >
                        <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} onPointerMissed={() => (state.clicked = null)}>
                            <Screen setColor={setColor} handleClick={handleClick} />
                        </Canvas>
                    </Box>
                </KeyboardControls>
            </div>
        </>
    )
}
