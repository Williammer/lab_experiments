document.addEventListener('touchmove', function(e) {
    e.preventDefault();
});
var c = document.getElementsByTagName('canvas')[0],
    shape = c.getContext('2d'),
    pr = window.devicePixelRatio || 1,
    w = window.innerWidth,
    h = window.innerHeight,
    f = 90, // PI/2
    q,
    m = Math,
    r = 0,  // radius
    u = m.PI * 2,   // 2PI
    fcos = m.cos,  
    rand = m.random;
c.width = w * pr;
c.height = h * pr;
shape.scale(pr, pr);
shape.globalAlpha = 0.6;// set transparency value

// KEY
function boom() {
    shape.clearRect(0, 0, w, h);
    q = [{
        x: 0,
        y: h * .7 + f
    }, {
        x: 0,
        y: h * .7 - f
    }];// each segment line // ?[0.7]
    while (q[1].x < w + f) draw(q[0], q[1]);   // stop drawing at the right edge of window.
}

// draw line
function draw(i, j) {
    shape.beginPath();
    shape.moveTo(i.x, i.y);
    shape.lineTo(j.x, j.y);
    var k = j.x + (rand() * 2 - 0.25) * f, // ?[0.25]
        n = y(j.y); //randomly produce y coordinate of next dot
    shape.lineTo(k, n); // draw to another dot
    shape.closePath();
    r -= (u / -50); // ??
    shape.fillStyle = '#' + (fcos(r) * 127 + 128 << 16 | fcos(r + u / 3) * 127 + 128 << 8 | fcos(r + u / 3 * 2) * 127 + 128).toString(16);// ???????
    shape.fill();
    // pass to next dot
    q[0] = q[1];
    q[1] = {
        x: k,
        y: n
    };
}

// generate random next y coordinate
function y(coord) {
    var t = coord + (rand() * 2 - 1.1) * f; // ?[1.1]
    return (t > h || t < 0) ? y(coord) : t;
}
document.onclick = boom;
document.ontouchstart = boom;
boom();
