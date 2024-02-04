import * as THREE from 'three';

interface Props {
    gameWindow: Element | null;
    startPosition: THREE.Vector3;
}

export interface ICamera {
    object: THREE.PerspectiveCamera | null,
    moveCamera: (position: THREE.Vector3) => void;
}

export const Camera: (props: Props) => ICamera = (props: Props) => {
    let isCameraMoving = false;
    const camera: THREE.PerspectiveCamera | null = props.gameWindow && new THREE.PerspectiveCamera(75, props.gameWindow.clientWidth/ props.gameWindow.clientHeight, 0.1, 1000);
    camera && camera.position.set(props.startPosition.x, props.startPosition.y, props.startPosition.z);

    const moveCamera = (position: THREE.Vector3) => {
        camera && camera.position.lerp(position, 0.05);
    };
    
    return {
        object: camera,
        moveCamera
    }
}