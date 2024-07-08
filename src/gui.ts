import dat from "dat.gui"

export interface AppParameters {
    generate: () => void,
    lights: number,
    columns: number,
}

export function setGUI(props: AppParameters) {
    const gui = new dat.GUI()

    const f1 = gui.addFolder('Generate')
    f1.add(props, 'generate').name('Generate Scenery')
    f1.open()

    const f2 = gui.addFolder('Parameters')
    f2.add(props, 'lights', 4, 25).name('Lights')
    f2.add(props, 'columns', 4, 25).name('Columns')
    f2.open()
}