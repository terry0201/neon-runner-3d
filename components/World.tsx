import React, { useRef, useMemo } from 'react';
import { Instance, Instances, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameStatus } from '../types';

interface WorldProps {
  gameStatus: GameStatus;
}

// 輔助函式：產生範圍內的隨機整數
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// 顏色定義
const COLORS = {
  cksWhite: "#f3f4f6", // 大理石白
  cksBlue: "#003087",  // 紀念堂藍
  roofGold: "#f59e0b", // 兩廳院黃瓦
  pillarRed: "#991b1b",// 兩廳院紅柱
  floorGrey: "#94a3b8",// 水泥地
  tileFloor: "#cbd5e1",// 廣場地磚
  grass: "#166534",    // 深綠草地
  t101Green: "#aecbfa",// 101玻璃色
};

// 台北 101 (程式化生成 - 高擬真版)
const Taipei101 = () => {
    return (
        <group position={[280, 0, -300]}>
            {/* 基座 */}
            <mesh position={[0, 15, 0]}>
                <boxGeometry args={[40, 30, 40]} />
                <meshStandardMaterial color="#64748b" />
            </mesh>
            
            {/* 8個斗 (竹節) */}
            {[...Array(8)].map((_, i) => (
                <group key={i} position={[0, 30 + i * 18, 0]}>
                    {/* 倒梯形 */}
                    <mesh position={[0, 9, 0]}>
                        <cylinderGeometry args={[14, 10, 18, 4]} rotation={[0, Math.PI/4, 0]} />
                        <meshStandardMaterial color={COLORS.t101Green} metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* 裝飾角 */}
                    <mesh position={[12, 9, 12]}><boxGeometry args={[2, 10, 2]} /><meshStandardMaterial color="#cbd5e1"/></mesh>
                    <mesh position={[-12, 9, 12]}><boxGeometry args={[2, 10, 2]} /><meshStandardMaterial color="#cbd5e1"/></mesh>
                    <mesh position={[12, 9, -12]}><boxGeometry args={[2, 10, 2]} /><meshStandardMaterial color="#cbd5e1"/></mesh>
                    <mesh position={[-12, 9, -12]}><boxGeometry args={[2, 10, 2]} /><meshStandardMaterial color="#cbd5e1"/></mesh>
                </group>
            ))}

            {/* 塔尖 */}
            <group position={[0, 30 + 8 * 18, 0]}>
                <mesh position={[0, 5, 0]}>
                    <boxGeometry args={[8, 10, 8]} />
                    <meshStandardMaterial color={COLORS.t101Green} />
                </mesh>
                <mesh position={[0, 25, 0]}>
                     <cylinderGeometry args={[1, 6, 30, 4]} rotation={[0, Math.PI/4, 0]} />
                     <meshStandardMaterial color={COLORS.t101Green} />
                </mesh>
                <mesh position={[0, 45, 0]}>
                     <cylinderGeometry args={[0.2, 0.5, 20, 8]} />
                     <meshStandardMaterial color="#cbd5e1" />
                </mesh>
            </group>
        </group>
    )
}

// 新光摩天大樓
const ShinKongTower = () => {
    return (
        <group position={[-200, 0, 100]}>
            <mesh position={[0, 40, 0]}>
                <boxGeometry args={[30, 80, 20]} />
                <meshStandardMaterial color="#fca5a5" />
            </mesh>
            <mesh position={[0, 85, 0]}>
                <boxGeometry args={[25, 10, 15]} />
                <meshStandardMaterial color="#fca5a5" />
            </mesh>
        </group>
    )
}

// 中正紀念堂主體 (高精細版)
const CKSMemorialHall = () => {
  return (
    <group position={[0, 0, -60]}>
      {/* 基座 */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[45, 8, 45]} />
        <meshStandardMaterial color={COLORS.cksWhite} />
      </mesh>
      
      {/* 中央主梯 */}
      <group position={[0, 0, 28]}>
         <mesh position={[0, 2, 0]} rotation={[-Math.PI/6, 0, 0]}>
             <boxGeometry args={[16, 12, 1]} />
             <meshStandardMaterial color="#e5e7eb" />
         </mesh>
         <mesh position={[0, 2.1, 0]} rotation={[-Math.PI/6, 0, 0]}>
             <planeGeometry args={[4, 12]} />
             <meshStandardMaterial color="#d1d5db" />
         </mesh>
      </group>

      {/* 主體建築 */}
      <mesh position={[0, 18, 0]}>
        <boxGeometry args={[32, 20, 32]} />
        <meshStandardMaterial color={COLORS.cksWhite} />
      </mesh>
      
      {/* 斗拱層 */}
      <mesh position={[0, 29, 0]}>
        <boxGeometry args={[34, 2, 34]} />
        <meshStandardMaterial color="#dbeafe" />
      </mesh>

      {/* 屋頂 */}
      <group position={[0, 30, 0]}>
        <mesh position={[0, 2, 0]} rotation={[0, Math.PI/8, 0]}>
           <cylinderGeometry args={[22, 26, 4, 8]} />
           <meshStandardMaterial color={COLORS.cksBlue} />
        </mesh>
        <mesh position={[0, 8, 0]} rotation={[0, Math.PI/8, 0]}>
           <cylinderGeometry args={[0, 22, 12, 8]} />
           <meshStandardMaterial color={COLORS.cksBlue} />
        </mesh>
        <mesh position={[0, 14.5, 0]}>
           <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
           <meshStandardMaterial color="#fbbf24" metalness={0.8} />
        </mesh>
      </group>

      {/* 銅門 */}
      <mesh position={[0, 13, 16.1]}>
        <planeGeometry args={[6, 10]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
    </group>
  );
};

// 兩廳院
const PalaceBuilding = ({ position, rotationY }: { position: [number, number, number], rotationY: number }) => {
    return (
        <group position={position} rotation={[0, rotationY, 0]}>
            <mesh position={[0, 2, 0]}>
                <boxGeometry args={[30, 4, 20]} />
                <meshStandardMaterial color={COLORS.cksWhite} />
            </mesh>
            <mesh position={[0, 10, 0]}>
                <boxGeometry args={[28, 12, 18]} />
                <meshStandardMaterial color={COLORS.pillarRed} />
            </mesh>
            <Instances range={6} position={[0, 8, 9.5]}>
                <cylinderGeometry args={[0.6, 0.6, 12]} />
                <meshStandardMaterial color="#7f1d1d" />
                {[-12, -7, -2, 2, 7, 12].map((x, i) => (
                    <group key={i} position={[x, 0, 0]}><mesh /></group>
                ))}
            </Instances>
            <group position={[0, 16, 0]}>
                <mesh>
                    <coneGeometry args={[22, 10, 4]} rotation={[0, Math.PI/4, 0]} />
                    <meshStandardMaterial color={COLORS.roofGold} />
                </mesh>
                <mesh position={[0, 5, 0]}>
                     <boxGeometry args={[30, 1, 0.5]} />
                     <meshStandardMaterial color={COLORS.roofGold} />
                </mesh>
            </group>
        </group>
    )
}

// 自由廣場牌樓
const LibertyGate = () => {
  const height = 18;
  const pillarW = 2;
  
  return (
    <group position={[0, 0, 150]}>
      {[-20, -12, -5, 5, 12, 20].map((x, i) => (
         <mesh key={i} position={[x, height/2, 0]}>
            <boxGeometry args={[pillarW, height, pillarW]} />
            <meshStandardMaterial color={COLORS.cksWhite} />
         </mesh>
      ))}

      <mesh position={[0, 12, 0]}>
         <boxGeometry args={[44, 2, 2.5]} />
         <meshStandardMaterial color={COLORS.cksWhite} />
      </mesh>
      <mesh position={[0, 15, 0]}>
         <boxGeometry args={[28, 1.5, 2.5]} />
         <meshStandardMaterial color={COLORS.cksWhite} />
      </mesh>

      <mesh position={[0, 19, 0]}>
          <coneGeometry args={[14, 6, 4]} rotation={[0, Math.PI/4, 0]} />
          <meshStandardMaterial color={COLORS.cksBlue} />
      </mesh>
      <mesh position={[-16, 17, 0]}>
          <coneGeometry args={[8, 5, 4]} rotation={[0, Math.PI/4, 0]} />
          <meshStandardMaterial color={COLORS.cksBlue} />
      </mesh>
      <mesh position={[16, 17, 0]}>
          <coneGeometry args={[8, 5, 4]} rotation={[0, Math.PI/4, 0]} />
          <meshStandardMaterial color={COLORS.cksBlue} />
      </mesh>
    </group>
  );
};

// 廣場與景觀
const Plaza = () => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 45]}>
        <planeGeometry args={[20, 180]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 45]} receiveShadow>
        <planeGeometry args={[120, 220]} />
        <meshStandardMaterial color={COLORS.tileFloor} roughness={0.8} />
      </mesh>
      
      {/* 雲漢池/光華池 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-80, 0.05, 45]}>
        <planeGeometry args={[60, 220]} />
        <meshStandardMaterial color={COLORS.grass} />
      </mesh>
       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[80, 0.05, 45]}>
        <planeGeometry args={[60, 220]} />
        <meshStandardMaterial color={COLORS.grass} />
      </mesh>
      
      {/* 水池 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-80, 0.1, 45]}>
         <circleGeometry args={[20, 32]} />
         <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.5} />
      </mesh>
      {/* 白色曲橋 */}
      <mesh position={[-80, 1, 45]} rotation={[0, Math.PI/4, 0]}>
         <boxGeometry args={[30, 0.5, 2]} />
         <meshStandardMaterial color="#fff" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[80, 0.1, 45]}>
         <circleGeometry args={[20, 32]} />
         <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.5} />
      </mesh>

      <PalaceBuilding position={[-70, 0, 40]} rotationY={Math.PI/2} />
      <PalaceBuilding position={[70, 0, 40]} rotationY={-Math.PI/2} />
    </group>
  );
};

// 擬真樹木組件 (松柏風格)
const RealisticTree: React.FC<{ key?: number | string, position: [number, number, number], scale: number }> = ({ position, scale }) => {
    return (
        <group position={position} scale={[scale, scale, scale]}>
            {/* 樹幹 */}
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.3, 0.5, 3]} />
                <meshStandardMaterial color="#4a3728" />
            </mesh>
            {/* 樹葉 (三層) */}
            <mesh position={[0, 3, 0]}>
                <coneGeometry args={[2.5, 3, 8]} />
                <meshStandardMaterial color="#14532d" />
            </mesh>
            <mesh position={[0, 4.5, 0]}>
                <coneGeometry args={[2, 2.5, 8]} />
                <meshStandardMaterial color="#15803d" />
            </mesh>
            <mesh position={[0, 6, 0]}>
                <coneGeometry args={[1.2, 2, 8]} />
                <meshStandardMaterial color="#16a34a" />
            </mesh>
        </group>
    )
}

const Trees = () => {
    // 樹木放置邏輯：避開 8 字形路線 (中央區塊)
    // 增加密度 (30 -> 60)
    const data = useMemo(() => {
        const trees: { pos: [number, number, number], scale: number }[] = [];
        
        // 左前區 (靠近牌樓左側)
        for(let i=0; i<60; i++) {
             trees.push({ pos: [randomInt(-180, -110), 0, randomInt(50, 200)], scale: 0.8 + Math.random() * 0.5 });
        }
        // 右前區 (靠近牌樓右側)
        for(let i=0; i<60; i++) {
             trees.push({ pos: [randomInt(110, 180), 0, randomInt(50, 200)], scale: 0.8 + Math.random() * 0.5 });
        }
        // 左後區 (靠近紀念堂左側)
        for(let i=0; i<60; i++) {
             trees.push({ pos: [randomInt(-180, -110), 0, randomInt(-150, 0)], scale: 0.8 + Math.random() * 0.5 });
        }
        // 右後區 (靠近紀念堂右側)
        for(let i=0; i<60; i++) {
             trees.push({ pos: [randomInt(110, 180), 0, randomInt(-150, 0)], scale: 0.8 + Math.random() * 0.5 });
        }

        return trees;
    }, []);

    return (
        <group>
            {data.map((t, i) => (
                <RealisticTree key={i} position={t.pos} scale={t.scale} />
            ))}
        </group>
    )
}

// 城市天際線
const CitySkyline = () => {
    const count = 200;
    const data = useMemo(() => {
        const d = [];
        for(let i=0; i<count; i++) {
             const angle = Math.random() * Math.PI * 2;
             const r = 250 + Math.random() * 200; // 遠處
             const x = Math.cos(angle) * r;
             const z = Math.sin(angle) * r;
             const h = 20 + Math.random() * 80;
             const w = 10 + Math.random() * 20;
             d.push({ position: [x, h/2, z] as [number, number, number], args: [w, h, w] as [number, number, number], color: Math.random() > 0.5 ? '#94a3b8' : '#64748b' });
        }
        return d;
    }, []);

    return (
        <group>
             {data.map((b, i) => (
                 <mesh key={i} position={b.position}>
                     <boxGeometry args={b.args} />
                     <meshStandardMaterial color={b.color} />
                 </mesh>
             ))}
        </group>
    )
}

// 擬真人類組件 (Low-poly Humanoid)
const Humanoid = ({ type, colorClothes, colorSkin, colorPants, speed }: { type: 'adult' | 'kid', colorClothes: string, colorSkin: string, colorPants: string, speed: number }) => {
    const leftArm = useRef<THREE.Mesh>(null);
    const rightArm = useRef<THREE.Mesh>(null);
    const leftLeg = useRef<THREE.Mesh>(null);
    const rightLeg = useRef<THREE.Mesh>(null);
    const bodyScale = type === 'kid' ? 0.6 : 1;

    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed * 40; 
        if (leftArm.current && rightArm.current && leftLeg.current && rightLeg.current) {
            leftArm.current.rotation.x = Math.sin(t) * 0.5;
            rightArm.current.rotation.x = -Math.sin(t) * 0.5;
            leftLeg.current.rotation.x = -Math.sin(t) * 0.6; 
            rightLeg.current.rotation.x = Math.sin(t) * 0.6;
        }
    });

    return (
        <group scale={[bodyScale, bodyScale, bodyScale]}>
            <mesh position={[0, 0.9, 0]}>
                <boxGeometry args={[0.4, 0.6, 0.2]} />
                <meshStandardMaterial color={colorClothes} />
            </mesh>
            <mesh position={[0, 1.35, 0]}>
                <boxGeometry args={[0.25, 0.3, 0.25]} />
                <meshStandardMaterial color={colorSkin} />
            </mesh>
            <mesh ref={leftArm} position={[-0.28, 1.1, 0]} rotation={[0, 0, 0.1]}>
                 <boxGeometry args={[0.12, 0.6, 0.12]} />
                 <meshStandardMaterial color={colorClothes} />
                 <mesh position={[0, -0.35, 0]}><boxGeometry args={[0.1, 0.15, 0.1]} /><meshStandardMaterial color={colorSkin}/></mesh>
            </mesh>
            <mesh ref={rightArm} position={[0.28, 1.1, 0]} rotation={[0, 0, -0.1]}>
                 <boxGeometry args={[0.12, 0.6, 0.12]} />
                 <meshStandardMaterial color={colorClothes} />
                 <mesh position={[0, -0.35, 0]}><boxGeometry args={[0.1, 0.15, 0.1]} /><meshStandardMaterial color={colorSkin}/></mesh>
            </mesh>
            <mesh ref={leftLeg} position={[-0.1, 0.3, 0]}>
                 <boxGeometry args={[0.15, 0.6, 0.15]} />
                 <meshStandardMaterial color={colorPants} />
            </mesh>
            <mesh ref={rightLeg} position={[0.1, 0.3, 0]}>
                 <boxGeometry args={[0.15, 0.6, 0.15]} />
                 <meshStandardMaterial color={colorPants} />
            </mesh>
        </group>
    )
}

const Pet = ({ color, speed }: { color: string, speed: number }) => {
    const group = useRef<THREE.Group>(null);
    useFrame((state) => {
         const t = state.clock.getElapsedTime() * speed * 60;
         if (group.current) {
             group.current.position.y = 0.2 + Math.abs(Math.sin(t)) * 0.05; 
             group.current.rotation.z = Math.sin(t) * 0.05;
         }
    });
    return (
        <group ref={group}>
            <mesh position={[0, 0, 0]}><boxGeometry args={[0.2, 0.2, 0.4]} /><meshStandardMaterial color={color} /></mesh>
            <mesh position={[0, 0.15, 0.2]}><boxGeometry args={[0.15, 0.15, 0.15]} /><meshStandardMaterial color={color} /></mesh>
        </group>
    )
}

const Pedestrian: React.FC<{ type: 'adult' | 'kid' | 'pet', position: [number, number, number], boundary: {x: [number, number], z: [number, number]} }> = ({ type, position, boundary }) => {
    const ref = useRef<THREE.Group>(null);
    const speed = useRef(Math.random() * 0.03 + 0.015);
    const direction = useRef(new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize());

    const colors = useMemo(() => ({
        clothes: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6366f1'][Math.floor(Math.random() * 6)],
        skin: ['#fca5a5', '#fdba74', '#d4d4d8'][Math.floor(Math.random() * 3)],
        pants: ['#1e293b', '#334155', '#475569', '#1f2937'][Math.floor(Math.random() * 4)],
        pet: ['#a8a29e', '#78716c', '#d6d3d1'][Math.floor(Math.random() * 3)]
    }), []);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.position.add(direction.current.clone().multiplyScalar(speed.current));
        const angle = Math.atan2(direction.current.x, direction.current.z);
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        ref.current.quaternion.slerp(q, 0.1);

        const pos = ref.current.position;
        if (pos.x < boundary.x[0] || pos.x > boundary.x[1] || pos.z < boundary.z[0] || pos.z > boundary.z[1]) {
             direction.current.negate();
             direction.current.x += (Math.random() - 0.5) * 0.8;
             direction.current.z += (Math.random() - 0.5) * 0.8;
             direction.current.normalize();
        }
    });

    return (
        <group ref={ref} position={position}>
            {type === 'pet' ? <Pet color={colors.pet} speed={speed.current} /> : 
            <Humanoid type={type} colorClothes={colors.clothes} colorSkin={colors.skin} colorPants={colors.pants} speed={speed.current} />}
        </group>
    )
}

const Pedestrians = () => {
    const plazaPedestrians = useMemo(() => {
        const items = [];
        for(let i=0; i<30; i++) {
             items.push({
                 id: i,
                 type: Math.random() > 0.3 ? 'adult' : (Math.random() > 0.5 ? 'kid' : 'pet') as 'adult'|'kid'|'pet',
                 position: [randomInt(-40, 40), 0, randomInt(20, 100)] as [number, number, number],
                 boundary: { x: [-50, 50], z: [10, 110] }
             });
        }
        return items;
    }, []);

    const corridorPedestrians = useMemo(() => {
        const items = [];
        for(let i=0; i<10; i++) {
             items.push({
                 id: i + 100,
                 type: 'adult' as const,
                 position: [randomInt(60, 80), 0, randomInt(30, 50)] as [number, number, number],
                 boundary: { x: [55, 85], z: [25, 55] }
             });
        }
        return items;
    }, []);

    return <>{plazaPedestrians.map(({id, ...p}) => <Pedestrian key={id} {...p} />)}{corridorPedestrians.map(({id, ...p}) => <Pedestrian key={id} {...p} />)}</>
}

export const World: React.FC<WorldProps> = ({ gameStatus }) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[100, 200, 50]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}
      />
      
      {/* 真實感天空光照 */}
      <Environment preset="city" /> 
      <mesh position={[0, 200, 0]}>
          <sphereGeometry args={[800, 32, 32]} />
          <meshBasicMaterial color="#87ceeb" side={THREE.BackSide} />
      </mesh>

      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[1500, 1500]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      <CKSMemorialHall />
      <LibertyGate />
      <Plaza />
      <Trees />
      <Pedestrians />
      
      {/* 遠景城市與山脈 */}
      <CitySkyline />
      <Taipei101 />
      <ShinKongTower />
    </>
  );
};