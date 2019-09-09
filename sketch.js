var cols = 80, rows = 80
var grid = new Array(cols)
var openSet = [], closedSet = []
var start, end, w, h, path = []



function heuristic(a, b) {
  // let d = abs(a.i - b.i) + abs(a.j - b.j)
  let d = dist(a.i, a.j, b.i, b.j)
  return d
}



function removeFromArray(arr, el) {
  for (let i = arr.length - 1; i >= 0; i--)
    if (arr[i] == el) arr.splice(i, 1)
}



function Spot(i, j) {
  this.i = i; this.j = j
  this.f = 0; this.g = 0
  this.h = 0; this.neighbors = []
  this.previous = undefined
  this.wall = false

  if (random(1) < 0.4) this.wall = true

  this.show = function(col) {
    if (this.wall) {
      fill(0)
      noStroke()
      ellipse(this.i * w + w/2, this.j * h + h/2, w - 1, h - 1)
    }
    else {
      fill(col)
      noStroke()
      ellipse(this.i * w + w/2, this.j * h + h/2, w - 1, h - 1)
    }
  }

  this.addNeighbors = function(grid) {
    let i = this.i, j = this.j

    if (i < cols - 1) this.neighbors.push(grid[i + 1][j])
    if (i > 0) this.neighbors.push(grid[i - 1][j])
    if (j < rows - 1) this.neighbors.push(grid[i][j + 1])
    if (j > 0) this.neighbors.push(grid[i][j - 1])
    if (i > 0 && j > 0) this.neighbors.push(grid[i - 1][j - 1])
    if (i < cols - 1 && j > 0) this.neighbors.push(grid[i + 1][j - 1])
    if (i > 0 && j < rows - 1) this.neighbors.push(grid[i - 1][j + 1])
    if (i < cols - 1 && j < rows - 1) this.neighbors.push(grid[i + 1][j + 1])
  }
}



function setup() {
  createCanvas(700, 700)
  console.log('A*')
  w = width / cols
  h = height / rows

  for (let i = 0; i < cols; i++)
    grid[i] = new Array(rows)

  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      grid[i][j] = new Spot(i, j)

  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      grid[i][j].addNeighbors(grid)

  start = grid[0][0]; start.wall = false
  end = grid[cols - 1][rows - 1]; end.wall = false

  openSet.push(start)
}



function draw() {
  if (openSet.length > 0) {
    let winner = 0
    for (let i = 0; i < openSet.length; i++)
      if (openSet[i].f < openSet[winner].f)
        winner = i

    var current = openSet[winner]
    if (current === end) {
      noLoop()
      alert("DONE!")
    }

    removeFromArray(openSet, current)
    closedSet.push(current)

    let neighbors = current.neighbors
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i]

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let tempG = current.g + 1
        var newPath = false

        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG
            newPath = true
          }
        }
        else {
          neighbor.g = tempG
          newPath = true
          openSet.push(neighbor)
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, end)
          neighbor.f = neighbor.g + neighbor.h
          neighbor.previous = current
        }
      }
    }
  }
  else {
    alert("No Solution!")
    noLoop()
    return
  }

  background(255)
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      grid[i][j].show(color(255))

  for (let i = 0; i < closedSet.length; i++)
    closedSet[i].show(color(255, 0, 0))

  for (let i = 0; i < openSet.length; i++)
    openSet[i].show(color(0, 255, 0))

  path = []
  let temp = current
  path.push(temp)

  while (temp.previous) {
    path.push(temp.previous)
    temp = temp.previous
  }

  noFill()
  stroke(0, 0, 255)
  strokeWeight(w/2)
  beginShape()
  for (let i = 0; i < path.length; i++)
    vertex(path[i].i * w + w/2, path[i].j * h + h/2)
  endShape()
}
