const toggleBtn = document.getElementById("drawToggle");
const drawPopup = document.getElementById("drawPopup");
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
const controls = document.getElementById("drawControls");
const drawBtn = document.getElementById("drawBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");

let drawEnabled = false;
let currentTool = "draw";
let drawing = false;

// Resize canvas to square of its container
function resizeCanvas() {
    const size = Math.min(drawPopup.clientWidth, drawPopup.clientHeight);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();

// Toggle popup and drawing
toggleBtn.addEventListener("click", () => {
    drawEnabled = !drawEnabled;

    // Show/hide popup and controls
    drawPopup.style.display = drawEnabled ? "block" : "none";
    controls.style.display = drawEnabled ? "flex" : "none";
    canvas.classList.toggle("active", drawEnabled);

    // Toggle active state on the button
    toggleBtn.classList.toggle("active", drawEnabled);

    // Reset tool to draw
    currentTool = "draw";
    drawBtn.classList.add("active");
    eraserBtn.classList.remove("active");

    resizeCanvas();
});


// Tool selection
function selectTool(tool) {
    currentTool = tool;
    drawBtn.classList.toggle("active", tool === "draw");
    eraserBtn.classList.toggle("active", tool === "erase");
}
drawBtn.addEventListener("click", () => selectTool("draw"));
eraserBtn.addEventListener("click", () => selectTool("erase"));

// Clear canvas
clearBtn.addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// Drawing logic
canvas.addEventListener("pointerdown", e => {
    if (!drawEnabled) return;
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove", e => {
    if (!drawing || !drawEnabled) return;
    ctx.globalCompositeOperation = currentTool === "erase" ? "destination-out" : "source-over";
    ctx.strokeStyle = "#0059ffff";
    ctx.lineWidth = currentTool === "erase" ? 20 : 3;
    ctx.lineCap = "round";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

canvas.addEventListener("pointerup", e => {
    drawing = false;
    canvas.releasePointerCapture(e.pointerId);
});

// Prevent text selection while drawing
canvas.addEventListener("pointerdown", () => { if(drawEnabled) document.body.style.userSelect="none"; });
canvas.addEventListener("pointerup", () => { document.body.style.userSelect=""; });

// Resize canvas when window resizes
window.addEventListener("resize", resizeCanvas);

// Optional: close popup when clicking outside canvas
drawPopup.addEventListener("click", (e) => {
    if(e.target === drawPopup) { 
        drawEnabled = false;
        drawPopup.style.display = "none";
        controls.style.display = "none";
        canvas.classList.remove("active");
    }
});
