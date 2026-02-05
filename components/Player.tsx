import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerControls } from './Controls';
import { ViewMode, GameStatus } from '../types';

interface PlayerProps {
  viewMode: ViewMode;
  gameStatus: GameStatus;
  onGameOver: (reason: string) => void;
  setScore: (score: (prev: number) => number) => void;
  setLaps: (laps: (prev: number) => number) => void;
  setIsFlying: (isFlying: boolean) => void;
  setSpeed: (speed: number) => void;
}

// 8字形路徑 - 地面高度
const pathCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 45),     // 中央
  new THREE.Vector3(-90, 0, -20),  // 劇院側
  new THREE.Vector3(0, 0, -130),   // 紀念堂後
  new THREE.Vector3(90, 0, -20),   // 音樂廳側
  new THREE.Vector3(0, 0, 45),     // 回中央
  new THREE.Vector3(-100, 0, 130), // 往牌樓
  new THREE.Vector3(0, 0, 230),    // 牌樓前
  new THREE.Vector3(100, 0, 130),  // 回程
], true); 

// --- 物理常數調整 ---
// 走路加速減半再減半 (原 0.000004 -> 0.000002)
const BASE_ACCEL = 0.000002; 
const BOOST_ACCEL = 0.000015; 
// 提高起飛門檻 (需要跑更快)
const FLY_THRESHOLD = 0.0012; 
const MAX_SPEED = 0.0028; 
// 減速力度減半 (原 0.00004 -> 0.00002)
const BRAKE_POWER = 0.00002; 

// 角色模型
const CharacterModel = ({ speed, isFlying }: { speed: number, isFlying: boolean }) => {
  const group = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const cape = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.getElapsedTime();

    // 姿態切換
    const targetRotationX = isFlying ? -Math.PI / 2 : 0.2;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.1);

    // 跑步動畫
    if (!isFlying) {
        // 擺動速度 x1.5 (原 8000 -> 12000)
        const runFreq = time * speed * 12000; 
        if(leftArm.current && rightArm.current && leftLeg.current && rightLeg.current) {
            leftArm.current.rotation.x = Math.sin(runFreq) * 0.8;
            rightArm.current.rotation.x = -Math.sin(runFreq) * 0.8;
            leftLeg.current.rotation.x = -Math.sin(runFreq) * 0.8;
            rightLeg.current.rotation.x = Math.sin(runFreq) * 0.8;
            
            leftArm.current.rotation.z = 0; 
            rightArm.current.rotation.z = 0;
        }
    } 
    // 飛行動畫
    else {
        if(leftArm.current && rightArm.current && leftLeg.current && rightLeg.current) {
            leftArm.current.rotation.x = Math.PI; 
            rightArm.current.rotation.x = Math.PI;
            leftLeg.current.rotation.x = 0;
            rightLeg.current.rotation.x = 0;
        }
    }

    // 披風動畫
    if (cape.current) {
      const flutter = isFlying ? Math.sin(time * 20) * 0.1 : Math.sin(time * 5 + speed*1000) * 0.2;
      const baseRot = isFlying ? 0.2 : 0.1;
      cape.current.rotation.x = baseRot + flutter;
    }
  });

  const skinColor = "#fca5a5"; 
  const suitColor = "#2563eb"; 
  const pantsColor = "#ef4444"; 
  const capeColor = "#dc2626"; 

  return (
    <group ref={group}>
      <group position={[0, 0.9, 0]}>
        <mesh position={[0, 0.7, 0]}><boxGeometry args={[0.3, 0.3, 0.3]} /><meshStandardMaterial color={skinColor} /></mesh>
        <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.4, 0.8, 0.25]} /><meshStandardMaterial color={suitColor} /></mesh>
        <mesh ref={cape} position={[0, 0.5, 0.15]} rotation={[0.1, 0, 0]}><planeGeometry args={[0.6, 1.2]} /><meshStandardMaterial color={capeColor} side={THREE.DoubleSide} /></mesh>
        <mesh ref={leftArm} position={[-0.25, 0.4, 0]}> 
           <boxGeometry args={[0.12, 0.8, 0.12]} />
           <meshStandardMaterial color={suitColor} />
           <mesh position={[0, -0.4, 0]}><boxGeometry args={[0.13, 0.13, 0.13]} /><meshStandardMaterial color={skinColor}/></mesh>
        </mesh>
        <mesh ref={rightArm} position={[0.25, 0.4, 0]}>
           <boxGeometry args={[0.12, 0.8, 0.12]} />
           <meshStandardMaterial color={suitColor} />
           <mesh position={[0, -0.4, 0]}><boxGeometry args={[0.13, 0.13, 0.13]} /><meshStandardMaterial color={skinColor}/></mesh>
        </mesh>
        <group ref={leftLeg} position={[-0.1, -0.25, 0]}>
           <mesh position={[0, -0.3, 0]}><boxGeometry args={[0.14, 0.7, 0.14]} /><meshStandardMaterial color={suitColor} /></mesh>
           <mesh position={[0, -0.65, 0]}><boxGeometry args={[0.15, 0.3, 0.15]} /><meshStandardMaterial color={pantsColor} /></mesh>
        </group>
        <group ref={rightLeg} position={[0.1, -0.25, 0]}>
           <mesh position={[0, -0.3, 0]}><boxGeometry args={[0.14, 0.7, 0.14]} /><meshStandardMaterial color={suitColor} /></mesh>
           <mesh position={[0, -0.65, 0]}><boxGeometry args={[0.15, 0.3, 0.15]} /><meshStandardMaterial color={pantsColor} /></mesh>
        </group>
      </group>
    </group>
  );
};

export const Player: React.FC<PlayerProps> = ({ viewMode, gameStatus, onGameOver, setScore, setLaps, setIsFlying, setSpeed }) => {
  const group = useRef<THREE.Group>(null);
  const controls = usePlayerControls();
  
  const progress = useRef(0); 
  const speed = useRef(0);    
  const cameraDistance = useRef(15); 
  const cameraHeight = useRef(5);
  const frameCount = useRef(0); // 用來控制 UI 更新頻率

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      cameraDistance.current = Math.max(5, Math.min(400, cameraDistance.current + e.deltaY * 0.1));
      cameraHeight.current = Math.max(2, cameraDistance.current * 0.4); 
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);
  
  useFrame((state) => {
    if (!group.current) return;
    
    if (gameStatus === GameStatus.PLAYING) {
      const { forward, backward } = controls;
      
      // 物理加速邏輯
      if (forward) {
        let accel = BASE_ACCEL;
        if (speed.current > FLY_THRESHOLD * 0.8) {
            accel = BOOST_ACCEL; 
        }
        speed.current = Math.min(speed.current + accel, MAX_SPEED);
      } else if (backward) {
        speed.current = Math.max(speed.current - BRAKE_POWER, 0);
      }
      
      const newProgress = progress.current + speed.current;
      if (Math.floor(newProgress) > Math.floor(progress.current)) {
         setLaps(l => l + 1);
      }
      progress.current = newProgress % 1;
      setScore(s => s + Math.floor(speed.current * 10000));
    } else {
        speed.current = 0;
    }

    // 狀態更新 (限流以優化效能)
    frameCount.current += 1;
    if (frameCount.current % 5 === 0) { // 每 5 幀更新一次 React State
        setSpeed(speed.current);
        setIsFlying(speed.current > FLY_THRESHOLD);
    }

    const flying = speed.current > FLY_THRESHOLD;
    
    // 位置與方向計算
    const position = pathCurve.getPointAt(progress.current);
    const lookAtPoint = pathCurve.getPointAt((progress.current + 0.01) % 1); 
    
    // 高度平滑過渡
    const targetY = flying ? 6 : 0; 
    const currentY = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.05);
    
    group.current.position.set(position.x, currentY, position.z);
    group.current.lookAt(lookAtPoint.x, currentY, lookAtPoint.z);

    // 相機跟隨
    if (viewMode === ViewMode.THIRD_PERSON) {
      const tangent = pathCurve.getTangentAt(progress.current).normalize();
      const camOffset = tangent.clone().multiplyScalar(-cameraDistance.current);
      camOffset.y += cameraHeight.current; 

      const targetCamPos = group.current.position.clone().add(camOffset);
      state.camera.position.lerp(targetCamPos, 0.1);
      state.camera.lookAt(group.current.position); 
    } else {
      const headPos = group.current.position.clone().add(new THREE.Vector3(0, 1.6, 0));
      if (flying) {
         headPos.y -= 0.5;
      }
      state.camera.position.lerp(headPos, 0.5);
      state.camera.lookAt(lookAtPoint.x, currentY, lookAtPoint.z);
    }
  });

  return (
    <group ref={group}>
      {viewMode === ViewMode.THIRD_PERSON && (
        <CharacterModel speed={speed.current} isFlying={speed.current > FLY_THRESHOLD} />
      )}
    </group>
  );
};