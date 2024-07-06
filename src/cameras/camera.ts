import { mat4 } from 'gl-matrix'

export interface Camera {
    handleMouseMove(event: MouseEvent): void
    handleMouseWheel(event: WheelEvent): void
    handleMouseDown(event: MouseEvent): void
    handleMouseUp(event: MouseEvent): void
    handleKeyDown(event: KeyboardEvent): void
    handleKeyUp(event: KeyboardEvent): void
    animate(): mat4
}
