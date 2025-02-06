const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const gameOverWindow = document.getElementById("gameOver")
const pointText = document.querySelector(".pointText")
const movingBtn = document.getElementById("movingBtn")
//imagenes
ctx.imageSmoothingEnabled = false

const images = {
  headTube: new Image(),
  lineTube: new Image(),
  background1: new Image(),
  background2: new Image(),
  birt: new Image(),
}
images.headTube.src = "./headTube.png"
images.lineTube.src = "./lineTube.png"
images.background1.src = "./background-1.png"
images.background2.src = "./background-2.png"
images.birt.src = "./birt.png"

let imagesLoader = 0;
const totalImages = Object.keys(images).length

for (let key in images) {
  images[key].onload = function () {
    imagesLoader++
    if (imagesLoader === totalImages) {
      loop()
    }
  }
}



space = {
  gravity:.08,
}

birt = {
  x:50,
  y:canvas.height/2,
  vY:0,
  size:32,
  color:"transparent",
  jump:3,
  staticPoss:true,
}

obst1 = {
  x:canvas.width-200,
  vX:1,
  sizeX:96,
  sizeY:canvas.height/2,
  color:"transparent",
  gap: 160,
  active:false,
}
obst2 = {
  x:canvas.width,
  vX:1,
  sizeX:96,
  sizeY:canvas.height/2,
  color:"transparent",
  gap: 160,
  active:false,
}
//activar posiciones aleatorias
obst1.sizeY = Math.floor(Math.random()*(canvas.height-(2*obst1.gap))+(obst1.gap/2))
obst1.sizeY = Math.floor(Math.random()*(canvas.height-(2*obst2.gap))+(obst2.gap/2))

point = {
  current:0,
  max:localStorage.getItem("record"),
}

back1 = {
  x1:0,
  x2:canvas.width,
  vX:.5,
}

back2 = {
  x1:0,
  x2:canvas.width,
  vX:.2,
}

addPoint1 = true
addPoint2 = true
//juego
function loop() {
  if (!birt.staticPoss) {
    obst1.vX += 0.0001
    obst2.vX += 0.0001
  }
  ctx.clearRect( 0, 0, canvas.width, canvas.height)
  //dibujar fondo
  ctx.fillStyle = "#1C3F8AFF"
  ctx.fillRect(0,0,canvas.width,canvas.height)
  //fondo 2
  ctx.drawImage(images.background2, back2.x1, 0, canvas.width,(canvas.height/4)*3)
  ctx.drawImage(images.background2, back2.x2, 0, canvas.width,(canvas.height/4)*3)
  //fondo 1
  ctx.drawImage(images.background1, back1.x1, 0, canvas.width,canvas.height)
  ctx.drawImage(images.background1, back1.x2, 0, canvas.width,canvas.height)
  //mover fondo
  //mover fondo 1
  if (!birt.staticPoss) {
      back1.x1 -= back1.vX
      back1.x2 -= back1.vX
    if (back1.x1 <= -canvas.width) {
      back1.x1 = canvas.width
    }
    if (back1.x2 <= -canvas.width) {
      back1.x2 = canvas.width
    }
  }
  //mover fondo 2
  if (!birt.staticPoss) {
    back2.x1 -= back2.vX
    back2.x2 -= back2.vX
    if (back2.x1 < -canvas.width) {
      back2.x1 = canvas.width
    }
    if (back2.x2 <= -canvas.width) {
      back2.x2 = canvas.width
    }
  }
  
  //dibujar jugador
  //esta mas abjo
  
  //simular caida
  if (!birt.staticPoss) {
    birt.vY += space.gravity
    birt.y += birt.vY
  }
  //dibujae obstaculo 1
  ctx.fillStyle = obst1.color
  ctx.fillRect(obst1.x, 0, obst1.sizeX, obst1.sizeY)
  ctx.fillRect(obst1.x, obst1.sizeY+obst1.gap, obst1.sizeX, canvas.height-obst1.sizeY-obst1.gap)
  
  ctx.drawImage(images.lineTube, obst1.x, 0,obst1.sizeX, obst1.sizeY)
  ctx.drawImage(images.headTube, obst1.x, obst1.sizeY-obst1.sizeX/2,obst1.sizeX,obst1.sizeX/2)
  
  ctx.drawImage(images.lineTube, obst1.x, obst1.sizeY+obst1.gap,obst1.sizeX,canvas.height-obst1.gap-obst1.sizeY)
  ctx.drawImage(images.headTube, obst1.x, obst1.sizeY+obst1.gap,obst1.sizeX,obst1.sizeX/2)
  
  //mover obstaculo 1
  if (obst1.active) {
    obst1.x-=obst1.vX
  }
  //detectar recorrido final1
  if (obst1.x <= -obst1.sizeX) {
    obst1.x = canvas.width
    obst1.sizeY = Math.floor(Math.random()*(canvas.height-(2*obst1.gap))+(obst1.gap/2))
    addPoint1 = true
  }
  //dibujae obstaculo 2
  ctx.fillStyle = obst2.color
  ctx.fillRect(obst2.x, 0, obst2.sizeX, obst2.sizeY)
  ctx.fillRect(obst2.x, obst2.sizeY+obst2.gap, obst2.sizeX, canvas.height-obst2.sizeY-obst2.gap)
  ctx.drawImage(images.lineTube, obst2.x, 0,obst2.sizeX, obst2.sizeY)
  ctx.drawImage(images.headTube, obst2.x, obst2.sizeY-obst2.sizeX/2,obst2.sizeX,obst2.sizeX/2)
  
  ctx.drawImage(images.lineTube, obst2.x, obst2.sizeY+obst1.gap,obst2.sizeX,canvas.height-obst2.gap-obst2.sizeY)
  ctx.drawImage(images.headTube, obst2.x, obst2.sizeY+obst1.gap,obst2.sizeX,obst2.sizeX/2)
  //mover obstaculo 2
  if ((canvas.width-obst1.sizeX)/2 >= obst1.x) {
    obst2.active = true
  }
  if (obst2.active) {
    obst2.x-=obst2.vX
  }
  //detectar recorrido final2
  if (obst2.x <= -obst2.sizeX) {
    obst2.x = canvas.width
    obst2.sizeY = Math.floor(Math.random()*(canvas.height-(2*obst2.gap))+(obst2.gap/2))
    addPoint2 = true
  }
  //detectar coliciones 1//
  if (
    (birt.x >= obst1.x-birt.size && birt.x <= obst1.x+obst1.sizeX) &&
    (birt.y <= obst1.sizeY || birt.y >= obst1.sizeY+obst1.gap-birt.size)) {
    gameOver()
  }
  //detectar coliciones 2//
  if (
    (birt.x >= obst2.x-birt.size && birt.x <= obst2.x+obst2.sizeX) &&
    (birt.y <= obst2.sizeY || birt.y >= obst2.sizeY+obst2.gap-birt.size)) {
    gameOver()
  }
  //dibujar pajaro
  ctx.fillStyle = birt.color
  
  ctx.fillRect(birt.x ,birt.y ,birt.size, birt.size)
  
  
  ctx.drawImage(images.birt,birt.x-birt.size/2,birt.y-birt.size/2,birt.size*2,birt.size*2)
  //detectar puntaje 
  if (birt.x >= obst1.x+obst1.sizeX && addPoint1) {
    addPoint1 = false
    point.current++
  }
  if (birt.x >= obst2.x+obst2.sizeX && addPoint2) {
    addPoint2 = false
    point.current++
  }
  if (point.current >= point.max) {
    point.max = point.current
  }
  //texto puntaje
  ctx.font = "20px gameboy"
  ctx.fillStyle = "white"
  ctx.fillText(`puntos: ${point.current}`, 8, 40)
  ctx.fillText(`Record: ${point.max}`, 8, 65)
  //texto datos
  ctx.font = "12px monospace"
  ctx.fillStyle = "#fff9"
  ctx.fillText(`velocity:${Math.round(birt.vY)}|Position:${Math.round(birt.y)}|velocidad de Obs:${Math.round(obst1.vX*1000)/1000}`, 8, 16)
  //almacenar informacion de puntaje
  localStorage.setItem("record",point.max)
  requestAnimationFrame(loop)
}

function up() {
  birt.staticPoss = false
  birt.vY=-birt.jump
  obst1.active = "true"
}


const gameOver = () => {
  pointText.textContent = `~Puntaje: ${point.current} - ~Record: ${point.max}`
  gameOverWindow.style.display = "block"
  birt.color = "transparent"
  obst1.vX = -.1
  obst2.vX = -.1
  back1.vX = -.05
  back2.vX = -.02
  movingBtn.disabled = true
}


//reiniciar partida
const reboot = () => {
  //div
  gameOverWindow.style.display = "none"
  //puntos
  point.current = 0
  //boton
  movingBtn.disabled = false
  //jugador
  birt = {
    x: 50,
    y: canvas.height / 2,
    vY: 0,
    size: 32,
    color: "transparent",
    jump: 3,
    staticPoss: true,
  }
  //obstaculos
  obst1 = {
    x: canvas.width - 100,
    vX: 1,
    sizeX: 96,
    sizeY: canvas.height / 2,
    color: "transparent",
    gap: 160,
    active:false,
  }
  obst2 = {
    x:canvas.width,
    vX:1,
    sizeX:96,
    sizeY:canvas.height/2,
    color:"transparent",
    gap: 160,
    active:false,
  }
  back1 = {
  x1:0,
  x2:canvas.width,
  vX:.5,
}

back2 = {
  x1:0,
  x2:canvas.width,
  vX:.2,
}
}

