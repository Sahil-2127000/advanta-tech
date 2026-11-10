import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { MARK_DOT, MARK_H, MARK_SHAPES, MARK_W } from '../brand/logoMark'

const ACCENT = '#4d8dff'
const BRAND = '#0455c0'
const BONE = '#e9eff9'

const shapes = {
  ico: <icosahedronGeometry args={[1.05, 0]} />,
  octa: <octahedronGeometry args={[1.15, 0]} />,
  dodeca: <dodecahedronGeometry args={[1.0, 0]} />,
}

/** The Advanta mark, extruded with a bevel into glossy logo-blue chrome. The "i" dot floats on its own. */
function LogoCore() {
  const group = useRef(null)
  const dot = useRef(null)
  const size = 1.45 / MARK_H
  const geometry = useMemo(() => {
    const toShape = (pts) =>
      new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2((x - MARK_W / 2) * size, -(y - MARK_H / 2) * size)))
    const depth = 0.34
    const geo = new THREE.ExtrudeGeometry(MARK_SHAPES.map(toShape), {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.045,
      bevelSegments: 5,
    })
    geo.translate(0, 0, -depth / 2)
    geo.computeVertexNormals()
    return geo
  }, [size])
  useEffect(() => () => geometry.dispose(), [geometry])
  const [cx, cy, r] = MARK_DOT
  const dotPos = [(cx - MARK_W / 2) * size, -(cy - MARK_H / 2) * size, 0]

  useFrame((state) => {
    const t = state.clock.elapsedTime
    group.current.rotation.y = Math.sin(t * 0.35) * 0.5
    group.current.rotation.x = Math.sin(t * 0.27) * 0.08
    dot.current.position.y = dotPos[1] + Math.sin(t * 1.6) * 0.07
    dot.current.position.z = Math.cos(t * 1.6) * 0.05
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color="#3d7cff" metalness={0.35} roughness={0.2} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={2.4} emissive="#0455c0" emissiveIntensity={0.35} />
      </mesh>
      <mesh ref={dot} position={dotPos}>
        <sphereGeometry args={[r * size * 1.05, 48, 48]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.2} roughness={0.12} clearcoat={1} emissive={ACCENT} emissiveIntensity={0.25} envMapIntensity={1.4} />
      </mesh>
    </group>
  )
}

/** Faceted blue-chrome crystal with a soft wireframe shell (inner pages). */
function Core({ shape }) {
  if (shape === 'logo') return <LogoCore />
  return <Crystal shape={shape} />
}

function Crystal({ shape }) {
  const solid = useRef(null)
  const shell = useRef(null)
  useFrame((_, dt) => {
    solid.current.rotation.y += dt * 0.16
    solid.current.rotation.x += dt * 0.05
    shell.current.rotation.y -= dt * 0.08
    shell.current.rotation.z += dt * 0.04
  })
  return (
    <group>
      <mesh ref={solid}>
        {shapes[shape]}
        <meshPhysicalMaterial color="#1d4fa8" metalness={0.85} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} flatShading envMapIntensity={2.2} />
      </mesh>
      <mesh ref={shell} scale={1.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

/** A thin orbit with `count` nodes travelling around it — one node per service. */
function Orbit({ radius, count, tilt, speed, nodeColor, nodeSize = 0.075, ringOpacity = 0.35 }) {
  const carrier = useRef(null)
  const nodes = useMemo(
    () => Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2
      return [Math.cos(a) * radius, 0, Math.sin(a) * radius]
    }),
    [count, radius],
  )
  useFrame((_, dt) => {
    carrier.current.rotation.y += dt * speed
  })
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.0035, 6, 240]} />
        <meshBasicMaterial color={BONE} transparent opacity={ringOpacity} />
      </mesh>
      <group ref={carrier}>
        {nodes.map((p, i) => (
          <mesh key={i} position={p} rotation={[i, i * 0.5, 0]}>
            <boxGeometry args={[nodeSize, nodeSize, nodeSize]} />
            <meshStandardMaterial color={nodeColor} emissive={nodeColor} emissiveIntensity={0.55} metalness={0.4} roughness={0.35} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** Small deterministic PRNG (mulberry32) so the dust field is stable between renders. */
function seeded(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Dust({ count }) {
  const positions = useMemo(() => {
    const rand = seeded(19)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.5 + rand() * 6
      const t = rand() * Math.PI * 2
      const p = Math.acos(2 * rand() - 1)
      arr.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)], i * 3)
    }
    return arr
  }, [count])
  const ref = useRef(null)
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.01
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color={BONE} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/** Gentle floating motion for the core. */
function Bob({ children }) {
  const ref = useRef(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.position.y = Math.sin(t * 0.9) * 0.12
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.06
  })
  return <group ref={ref}>{children}</group>
}

/**
 * Reflection environment built from glowing panels (softboxes + a lime ring),
 * prefiltered once with PMREM — gives the chrome its studio highlights with no HDR download.
 */
function StudioEnvironment() {
  const gl = useThree((state) => state.gl)
  const target = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const room = new THREE.Scene()
    const panel = (geo, color, intensity, position, scale = [1, 1, 1]) => {
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...position)
      mesh.scale.set(...scale)
      mesh.lookAt(0, 0, 0)
      room.add(mesh)
    }
    const plane = new THREE.PlaneGeometry(1, 1)
    panel(plane, '#ffffff', 2.2, [0, 5, -6], [12, 2, 1])
    panel(plane, '#ffffff', 1.4, [6, 0, 2], [8, 1.2, 1])
    panel(plane, '#ffffff', 0.6, [0, -5, 2], [10, 3, 1])
    panel(new THREE.RingGeometry(0.7, 1, 48), ACCENT, 4, [-5, 1, -1], [3, 3, 3])
    panel(plane, BRAND, 3, [-2, -3, 5], [6, 2, 1])
    const rt = pmrem.fromScene(room, 0.04)
    pmrem.dispose()
    room.traverse((o) => {
      o.geometry?.dispose()
      o.material?.dispose()
    })
    return rt
  }, [gl])
  useEffect(() => () => target.dispose(), [target])
  return <primitive object={target.texture} attach="environment" />
}

/** Eases the whole rig toward the pointer and away with scroll progress. */
function Rig({ progress, children }) {
  const ref = useRef(null)
  useFrame((state) => {
    const p = progress?.get() ?? 0
    const g = ref.current
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.35 + p * 1.2, 0.05)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.22 + p * 0.4, 0.05)
    g.position.y = THREE.MathUtils.lerp(g.position.y, p * 1.4, 0.08)
  })
  return <group ref={ref}>{children}</group>
}

/**
 * The Advanta "core": 14 growth nodes + 5 quality nodes orbiting one solid centre.
 * `active=false` stops the render loop (off-screen / reduced motion).
 */
export default function CoreScene({ progress, active = true, shape = 'ico', lite = false, highlight }) {
  const growthColor = highlight === 'quality' ? '#33415c' : ACCENT
  const qualityColor = highlight === 'growth' ? '#33415c' : BONE
  return (
    <Canvas
      camera={{ position: [0, 0, lite ? 11.5 : 6.2], fov: 38 }}
      dpr={[1, lite ? 1.25 : 1.75]}
      gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'demand'}
      eventSource={typeof document !== 'undefined' ? document.getElementById('root') : undefined}
      eventPrefix="client"
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3, 5]} intensity={2.2} />
      <directionalLight position={[-4, 2, -3]} color={ACCENT} intensity={1.4} />
      <pointLight position={[-3, -1, 2]} color={ACCENT} intensity={6} distance={8} />
      <Rig progress={progress}>
        <Bob>
          <Core shape={shape} />
        </Bob>
        <Orbit radius={2.25} count={14} tilt={[0.42, 0, 0.18]} speed={0.12} nodeColor={growthColor} />
        <Orbit radius={2.85} count={5} tilt={[-0.3, 0, -0.32]} speed={-0.08} nodeColor={qualityColor} nodeSize={0.1} ringOpacity={0.2} />
      </Rig>
      <Dust count={lite ? 220 : 520} />
      <StudioEnvironment />
    </Canvas>
  )
}
