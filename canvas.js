// Canvas setup
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

// Toolbar and buttons
const toggleBtn = document.getElementById("drawToggle");
const controls = document.getElementById("drawControls");
// Hide toolbar on initial load
controls.style.display = "none";

const drawBtn = document.getElementById("drawBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");

let drawEnabled = false;
let currentTool = "draw"; // "draw" | "erase"
let drawing = false;

// Resize canvas to full page
function resizeCanvas() {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);

  canvas.width = document.documentElement.scrollWidth;
  canvas.height = document.documentElement.scrollHeight;

  ctx.drawImage(tempCanvas, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Toggle main drawing mode
toggleBtn.addEventListener("click", () => {
  drawEnabled = !drawEnabled;

  // Show/hide toolbar
  controls.style.display = drawEnabled ? "flex" : "none";

  // Show/hide canvas
  canvas.classList.toggle("hidden", !drawEnabled);

  // Reset tool to draw when enabling
  currentTool = "draw";
  drawBtn.classList.add("active");
  eraserBtn.classList.remove("active");

  // Active state on main toggle
  toggleBtn.classList.toggle("active", drawEnabled);
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
clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Drawing logic
window.addEventListener("pointerdown", e => {
  if (!drawEnabled) return;
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
});

window.addEventListener("pointermove", e => {
  if (!drawing || !drawEnabled) return;

  ctx.globalCompositeOperation =
    currentTool === "erase" ? "destination-out" : "source-over";

  ctx.strokeStyle = "#0059ffff"; // change color if you want
  ctx.lineWidth = currentTool === "erase" ? 20 : 3;
  ctx.lineCap = "round";

  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
});

window.addEventListener("pointerup", () => {
  drawing = false;
});

// Prevent text selection while drawing
window.addEventListener("pointerdown", () => {
  if (drawEnabled) document.body.style.userSelect = "none";
});
window.addEventListener("pointerup", () => {
  document.body.style.userSelect = "";
});
