balls = []
newVels = []
restitution = 0.75;
maxBalls = 4;

function setup() {
createCanvas(720,480);
balls.push(new Ball(50, 'red', 300,  100));
balls.push(new Ball(50, 'blue', 100,200))

balls[0].vel.x = -5;

}

function draw() {
  background(51);

  if((frameCount % 10 == 0) && balls.length < 5) {

    balls.push(new Ball(50, 'black', Math.random()*width, 0));
  }
  //balls[0].pos.x = mouseX;
  //balls[0].pos.y = mouseY;
  newVels = [];
  for(i = 0; i < balls.length; i++) {

    b = balls[i];
    v = new Vec2(b.vel.x, b.vel.y);
    v.y += 0.2; //gravity

    wallColl(balls[i], v);



    for(j = 0; j < balls.length; j++) {
      if(j != i) {
        if(isColliding(b, balls[j])) {

          solveCollision(b, balls[j], v);


        }
      }
    }

    newVels[i] = v;
  }
  for(i = 0; i < balls.length; i++){
    b = balls[i];
    b.vel = newVels[i];
    b.pos.add(newVels[i]);
    b.render();
  }



}



function wallColl(b1, v) {
  //bottom first

  if(b1.pos.y + b1.radius > height) {
    //if(b1.vel.y > -0.01) {
    v.y = -Math.abs(restitution * b1.vel.y)
  //}
  }


  if(b1.pos.x - b1.radius < 0) {
    if(b1.vel.x < 0) {
      v.x = Math.abs(restitution * b1.vel.x)

    }

  }

  if(b1.pos.x + b1.radius > width) {
    if(b1.vel.x > 0) {
      v.x = -Math.abs(restitution * b1.vel.x)

    }

  }

  return v;




}

function isColliding(b1, b2, v) {
  lenSqr = (b1.pos.x-b2.pos.x)**2 + (b1.pos.y-b2.pos.y)**2
  minRadSqr = (b1.radius + b2.radius)**2

  if(lenSqr < minRadSqr) return true;
}

function solveCollision(b1, b2, v) { //only solves for b1
colDir = new Vec2(b2.pos.x - b1.pos.x, b2.pos.y - b1.pos.y);
colDir.normalize();


//gets components in collision direciton
b1V = new Vec2(colDir.x, colDir.y)
ua = b1V.dot(b1.vel)


b2V = new Vec2(colDir.x, colDir.y)
ub = b2V.dot(b2.vel)

if(ua < -0.1 && ub > 0.1) { //makes sure collision is right direction not trying to get apart
  return v;
}

ma = b1.mass;
mb = b2.mass;

//size of final vel:
va = (ma * ua + mb * ub + mb * restitution* (ub-ua) ) / (ma + mb);

if(dist < (b1.radius + b2.radius)*0.95) {
  va -= 0.1;
}
//vb = (ma * ua + mb * ub + ma * restitution * (ua-ub) ) / (ma + mb);
v.add(colDir.mul(va-ua ));

return v;
//b2.vel.add(colDir.mul(ub-vb))


}




class Ball {
  constructor(rad, colour, xPos, yPos) {
    this.radius = rad;
    this.colour = colour;

    this.mass = rad*rad;
    this.pos = new Vec2(xPos, yPos);
    this.vel = new Vec2(0,0);


  }

  render() {
    fill(this.colour);
    noStroke();
    circle(this.pos.x, this.pos.y, this.radius*2);
  }

  applyForce(Vec) {

  }
}

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y
  }
  add(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }

  add(v2) {
    this.x += v2.x;
    this.y += v2.y;
    return this;
  }

  mul(a) {
    this.x *= a;
    this.y *= a;
    return this;
  }

  dot(v2) {
    return (this.x*v2.x + this.y*v2.y);
  }

  len() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  normalize() {
    var s = this.len();
    this.x =  this.x / s;
    this.y = this.y / s;
    return this;

  }


}
