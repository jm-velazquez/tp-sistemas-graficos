import dat from "dat.gui"

export class AppParameters {
    generate: () => void
    lights: number
    columns: number

    constructor(generate: () => void, lights: number, columns: number) {
        this.generate = generate
        this.lights = lights
        this.columns = columns

        const gui = new dat.GUI()
        const f1 = gui.addFolder('Generate')
        f1.add(this, 'generate').name('Generate Scenery')
        f1.open()

        const f2 = gui.addFolder('Parameters')
        f2.add(this, 'lights', 4, 25).name('Lights')
        f2.add(this, 'columns', 4, 25).name('Columns')
        f2.open()
    }
}

