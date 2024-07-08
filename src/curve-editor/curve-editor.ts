import { Bezier2 } from '../curves/bezier'

type Resolution = { width: number; height: number }
type EditorMode = 'agregar' | 'mover' | 'eliminar'

export class CurveEditor {
    container: HTMLElement
    isVisible = false
    resolution: Resolution
    mode: EditorMode
    nodeRadius: number
    nodes: HTMLDivElement[]
    canvas: HTMLCanvasElement
    toolbar: HTMLDivElement
    currentMovingNode: HTMLDivElement | null

    constructor(containerId: string, resolution: Resolution) {
        // Contenedor del editor
        this.container = document.getElementById(containerId)!

        // Resolución del panel
        this.resolution = resolution

        // Modos de edición: "agregar", "mover" y "eliminar"
        this.mode = 'agregar'

        // Radio de los nodos (parametrizable)
        this.nodeRadius = 4

        // Lista de nodos
        this.nodes = []

        // Elemento para dibujar en el panel
        this.canvas = this.createCanvas()
        this.container.appendChild(this.canvas)

        // Barra de herramientas
        this.toolbar = this.createToolbar()
        this.container.appendChild(this.toolbar)

        // Evento para cambiar el modo de edición
        this.toolbar.addEventListener('click', (event: MouseEvent) => {
            if (
                event.target instanceof HTMLElement &&
                event.target.tagName === 'BUTTON'
            ) {
                if (event.target.dataset.hasOwnProperty('mode'))
                    this.mode = event.target.dataset.mode as EditorMode
            }
        })

        this.currentMovingNode = null

        // Evento de clic en el panel
        this.canvas.addEventListener('click', (event) => {
            const x = Math.floor(
                event.clientX - this.canvas.getBoundingClientRect().left
            )
            const y = Math.floor(
                event.clientY - this.canvas.getBoundingClientRect().top
            )

            if (this.mode === 'agregar') {
                this.addNode(x, y)
                this.computeCurve()
            } else if (this.mode === 'eliminar') {
                const targetNode = this.findNodeAt(x, y)
                if (targetNode) {
                    this.removeNode(targetNode)
                }
                this.computeCurve()
            }
        })

        // Evento de arrastrar nodos
        this.canvas.addEventListener('mousedown', (event) => {
            const x = Math.floor(
                event.clientX - this.canvas.getBoundingClientRect().left
            )
            const y = Math.floor(
                event.clientY - this.canvas.getBoundingClientRect().top
            )

            if (this.mode === 'mover') {
                this.currentMovingNode = this.findNodeAt(x, y)
            }
        })

        window.addEventListener('mouseup', () => {
            this.currentMovingNode = null
            this.computeCurve()
        })

        this.canvas.addEventListener('mousemove', (event) => {
            if (this.currentMovingNode) {
                const x = Math.min(
                    this.canvas.width - this.nodeRadius * 2,
                    Math.floor(event.offsetX - this.nodeRadius)
                )
                const y = Math.min(
                    this.canvas.height - this.nodeRadius * 2,
                    Math.floor(event.offsetY - this.nodeRadius)
                )

                //console.log(x + " " + y)
                this.currentMovingNode.style.left = x + 'px'
                this.currentMovingNode.style.top = y + 'px'
            }
        })

        this.setControlPoints([
            [0, 0],
            [300, 50],
            [50, 300],
            [300, 300],
        ])
        window.addEventListener('keydown', (e) => {
            if (e.key === 'h') this.toggleVisibility()
        })
    }

    computeCurve() {
        const ctx = this.canvas.getContext('2d')!
        let r = this.canvas.getBoundingClientRect()
        ctx.clearRect(0, 0, r.width, r.height)
        if (this.nodes.length < 3) return

        let curve = new Bezier2()
        let controlPoints = this.getControlPoints()
        // duplico primer y ultimo punto
        let newControlPoints: number[][] = []
        controlPoints.forEach((p, i) => {
            let cantidad = i == 0 || i == controlPoints.length - 1 ? 2 : 1
            for (let k = 1; k <= cantidad; k++) newControlPoints.push(p)
        })

        curve.setControlPoints(newControlPoints)
        let polygon = curve.getPolygon()
        this.drawCurve(polygon)
    }

    getControlPoints() {
        let controlPoints: number[][] = []
        this.nodes.forEach((n, i) => {
            let r = n.getBoundingClientRect()
            controlPoints.push([
                n.offsetLeft + n.offsetWidth / 2,
                n.offsetTop + n.offsetHeight / 2,
            ])
        })
        return controlPoints
    }

    setControlPoints(points: number[][]) {
        points.forEach((p) => {
            this.addNode(p[0], p[1])
        })
        this.computeCurve()
    }

    drawCurve(points: number[][]) {
        const ctx = this.canvas.getContext('2d')!
        ctx.resetTransform()
        //ctx.transform(1, 0, 0, -1, 0, this.canvas.height);
        ctx.lineWidth = 3 // Establece el grosor de la línea
        ctx.strokeStyle = '#00CC00'

        ctx.beginPath()
        ctx.moveTo(points[0][0], points[0][1])

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1])
        }

        ctx.stroke()
    }

    createCanvas() {
        // Crea y devuelve un elemento canvas para dibujar
        const canvas = document.createElement('canvas')
        canvas.width = this.resolution.width
        canvas.height = this.resolution.height
        return canvas
    }

    createToolbar() {
        // Crea y devuelve la barra de herramientas
        const toolbar = document.createElement('div')
        toolbar.className = 'toolbar'

        const addButton = document.createElement('button')
        addButton.textContent = 'Agregar'
        addButton.dataset.mode = 'agregar'

        const moveButton = document.createElement('button')
        moveButton.textContent = 'Mover'
        moveButton.dataset.mode = 'mover'

        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Eliminar'
        deleteButton.dataset.mode = 'eliminar'

        const eraseButton = document.createElement('button')
        eraseButton.textContent = 'Borrar'

        toolbar.appendChild(addButton)
        toolbar.appendChild(moveButton)
        toolbar.appendChild(deleteButton)
        toolbar.appendChild(eraseButton)

        eraseButton.addEventListener(
            'click',
            this.onClickInicializar.bind(this)
        )

        return toolbar
    }

    onClickInicializar() {
        this.nodes.forEach((n, i) => this.container.removeChild(n))
        this.nodes = []
        this.computeCurve()
    }

    addNode(x: number, y: number) {
        // Agrega un nodo al panel// Crea un nuevo nodo como un div
        const node = document.createElement('div')
        node.className = 'node'
        node.style.width = `${this.nodeRadius * 2}px`
        node.style.height = `${this.nodeRadius * 2}px`
        node.style.backgroundColor = 'red'
        node.style.borderRadius = '50%'
        node.style.position = 'absolute'
        node.style.left = `${x - this.nodeRadius}px`
        node.style.top = `${y - this.nodeRadius}px`
        node.style.pointerEvents = 'none'

        node.addEventListener
        // Agrega el nodo al panel
        this.container.appendChild(node)

        // Guarda el nodo en la lista de nodos
        this.nodes.push(node)
    }

    removeNode(node: HTMLDivElement) {
        // Elimina el nodo del DOM y del array nodes
        this.container.removeChild(node)
        this.nodes = this.nodes.filter((n) => n !== node)
    }

    findNodeAt(x: number, y: number) {
        // Distancia mínima para considerar un nodo como seleccionado (en píxeles)
        const minDistance = 20 // Puedes ajustar esta distancia según tus necesidades

        // Función para calcular la distancia entre dos puntos
        function calculateDistance(
            x1: number,
            y1: number,
            x2: number,
            y2: number
        ) {
            return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
        }

        // Encuentra el nodo más cercano dentro de la distancia mínima
        let closestNode = null
        let closestDistance = minDistance

        for (const node of this.nodes) {
            const nodeX = parseFloat(node.style.left)
            const nodeY = parseFloat(node.style.top)
            const distance = calculateDistance(
                x,
                y,
                nodeX + this.nodeRadius,
                nodeY + this.nodeRadius
            )

            if (distance < closestDistance) {
                closestNode = node
                closestDistance = distance
            }
        }

        return closestNode
    }

    toggleVisibility() {
        this.container.style.visibility = this.isVisible ? 'visible' : 'hidden'
        this.isVisible = !this.isVisible
    }
}
