const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");

const cpucheck = document.getElementById("cpucheck");
const scoreboard = document.getElementById("scoreboard");

function updateScore(model) {
    scoreboard.innerHTML = `${model.scoreL} : ${model.scoreR}`;
}

function draw_game(model) {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

    let frame = model.frame % (4 * 8);

    let imgx = (frame % 4) * 480 + 480 / 4;
    let imgy = Math.floor(frame / 4) % 8 * 480
    ctx.drawImage(image, imgx, imgy, 240, 480, 0, 0, BOARD_WIDTH, BOARD_HEIGHT);


    draw_ball(ctx, model.ball);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);
}

function draw_ball(ctx, ball) {
    ctx.fillStyle = "hotpink";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;


    // ctx.beginPath();
    // ctx.arc(ball.posx, ball.posy, BALL_RADIUS, 0, 2 * Math.PI);
    // ctx.stroke();
    // ctx.fill();

    let frame = model.frame % (4 * 8);

    let imgx = (frame % 4) * 480 + 480 / 4;
    let imgy = Math.floor(frame / 4) % 8 * 480
    ctx.drawImage(image, imgx, imgy, 480 / 2, 480 / 2, ball.posx - BALL_RADIUS, ball.posy - BALL_RADIUS, BALL_RADIUS * 2, BALL_RADIUS * 2);
}

let image = new Image();
function get_image() {
    fetch("rr.png")
        .then(res => res.blob())
        .then(res =>
            image.src = URL.createObjectURL(res))
        .then(_ => console.log(image)
        )
}
get_image()

function draw_paddle(ctx, paddle) {
    ctx.fillStyle = paddle.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    let frame = model.frame % (4 * 8);

    let imgx = (frame % 4) * 480 + 480 / 4;
    let imgy = Math.floor(frame / 4) % 8 * 480

    // if (image.frames)
    ctx.drawImage(image, imgx, imgy, 480 / 2, 480, paddle.posx, paddle.posy, PADDLE_WIDTH, PADDLE_HEIGHT);
    // ctx.fillRect(paddle.posx, paddle.posy, PADDLE_WIDTH, PADDLE_HEIGHT);
    // ctx.strokeRect(paddle.posx, paddle.posy, PADDLE_WIDTH, PADDLE_HEIGHT);

}