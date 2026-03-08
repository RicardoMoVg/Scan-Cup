declare module '@react-three/fiber';
declare module '@react-three/drei';
declare module 'jsqr';
declare module 'three-stdlib';

declare namespace JSX {
    interface IntrinsicElements {
        ambientLight: any;
        directionalLight: any;
        hemisphereLight: any;
        group: any;
        primitive: any;
    }
}
