const wardrobe = [
  { title: "Ivory Silk Blouse", tags: ["Workwear", "Minimal"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80" },
  { title: "Tailored Navy Blazer", tags: ["Workwear"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=60" },
  { title: "Satin Slip Dress", tags: ["Evening", "Minimal"], image: "https://images.unsplash.com/photo-1520975913164-6f2b6d6f3b31?w=600&q=60" },
  { title: "Wide-Leg Trousers", tags: ["Casual", "Minimal"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=50" }
];

const tags = ["Casual", "Workwear", "Evening", "Sustainable", "Minimal", "Bold"];

const tagsContainer = document.getElementById("tagsContainer");
const wardrobeContainer = document.getElementById("wardrobeContainer");
const outfitsContainer = document.getElementById("outfitsContainer");

let selectedTags = [];

function renderTags() {
  tagsContainer.innerHTML = "";
  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.onclick = () => {
      btn.classList.toggle("active");
      if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
      } else {
        selectedTags.push(tag);
      }
    };
    tagsContainer.appendChild(btn);
  });
}

function renderWardrobe() {
  wardrobeContainer.innerHTML = "";
  wardrobe.forEach(item => {
    const div = document.createElement("div");
    div.className = "wardrobe-item";
    div.innerHTML = `<img src="${item.image}" alt="${item.title}">
                     <div style="padding: 0.5rem;">
                       <strong>${item.title}</strong>
                     </div>`;
    wardrobeContainer.appendChild(div);
  });
}

document.getElementById("findFitsBtn").onclick = () => {
  const outfits = wardrobe
    .filter(item => selectedTags.length === 0 || selectedTags.some(t => item.tags.includes(t)))
    .slice(0, 3);
  
  if (outfits.length === 0) {
    outfitsContainer.innerHTML = "No outfits found.";
    return;
  }

  outfitsContainer.innerHTML = "";
  outfits.forEach(o => {
    const div = document.createElement("div");
    div.innerHTML = `<img src="${o.image}" style="width:100%; border-radius:8px;"><p>${o.title}</p>`;
    outfitsContainer.appendChild(div);
  });
};

// Modal handling
const modal = document.getElementById("measurementsModal");
document.getElementById("openMeasurements").onclick = () => modal.style.display = "flex";
document.getElementById("closeModal").onclick = () => modal.style.display = "none";
document.getElementById("saveMeasurements").onclick = () => {
  alert("Measurements saved!");
  modal.style.display = "none";
};

renderTags();
renderWardrobe();
