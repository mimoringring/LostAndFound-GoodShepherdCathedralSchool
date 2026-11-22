const items = [
  {
    id: 1, name: "My Brain", brand: "broken spine",
    image: "images/im-tired.jpg", location: "Home", date: "November 22, 2026",
    description: "Absolutely not, I just want to take a shower guys.",
    status: "Available", archived: false
  },
  {
    id: 2, name: "Yoko Na", brand: "eto na",
    image: "images/tapon.jpg", location: "Pwet", date: "November 22, 2026",
    description: "wag na wag na wag na",
    status: "Archived", archived: true
  },
  {
    id: 3, name: "YO IM DA GOAT", brand: "heheheh",
    image: "images/goat.jpg", location: "Chararareng", date: "October 9, 1999 eme",
    description: "May pag-asa pa pala sis",
    status: "Archived", archived: true
  },
  {
    id: 4, name: "Test", brand: "broken spine",
    image: "images/filler.jpg", location: "", date: "November 22, 2026",
    description: "",
    status: "Available", archived: false
  },
  {
    id: 5, name: "Hahaha", brand: "broken spine",
    image: "images/filler1.jpg", location: "", date: "November 22, 2026",
    description: "",
    status: "Available", archived: false
  },
  {
    id: 6, name: "Yuh", brand: "broken spine",
    image: "images/filler2.jpg", location: "", date: "November 22, 2026",
    description: "Di pako nag-aaral hehe",
    status: "Available", archived: false
  },
];

const gallery = document.getElementById("itemGallery");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const resultsLabel = document.getElementById("resultsLabel");
const modal = document.getElementById("itemModal");
const closeModalButton = document.getElementById("closeModal");
const claimButton = document.getElementById("claimButton");
const toast = document.getElementById("toast");

let activeTab = "home";
let selectedItem = null;
let lastFocusedElement = null;
let toastTimer;

function renderItems() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleItems = items.filter(item => {
    const matchesTab = activeTab === "archived" ? item.archived : !item.archived;
    const searchable = `${item.name} ${item.brand} ${item.location} ${item.description}`.toLowerCase();
    return matchesTab && searchable.includes(query);
  });

  gallery.innerHTML = visibleItems.map(item => `
    <button class="item-card" type="button" data-item-id="${item.id}" aria-label="View details for ${item.name}">
      <img class="item-photo" src="${item.image}" alt="${item.name}" loading="lazy">
      <span class="item-name">${item.name}</span>
      <span class="item-location">Found at ${item.location}</span>
      <span class="item-status ${item.archived ? "archived" : ""}">${item.status}</span>
    </button>
  `).join("");

  emptyState.hidden = visibleItems.length > 0;
  resultsLabel.textContent = activeTab === "archived" ? "Previously listed items (NOTE: Archived Items last 3 days before expiry)" : "Recently surrendered";
  document.getElementById("homeCount").textContent = items.filter(item => !item.archived).length;
  document.getElementById("archivedCount").textContent = items.filter(item => item.archived).length;
}

function setActiveTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".tab").forEach(button => {
    const selected = button.dataset.tab === tab;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  renderItems();
}

function openModal(item) {
  selectedItem = item;
  lastFocusedElement = document.activeElement;
  document.getElementById("modalImage").src = item.image;
  document.getElementById("modalImage").alt = item.name;
  document.getElementById("modalItemName").textContent = item.name;
  document.getElementById("modalBrand").textContent = item.brand;
  document.getElementById("modalDate").textContent = item.date;
  document.getElementById("modalLocation").textContent = item.location;
  document.getElementById("modalStatus").textContent = item.status;
  document.getElementById("modalStatus").classList.toggle("archived", item.archived);
  document.getElementById("modalDescription").textContent = item.description;
  claimButton.disabled = item.archived;
  claimButton.textContent = item.archived ? "Item archived" : "Request to claim ↗";
  claimButton.classList.toggle("disabled", item.archived);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeModalButton.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});
searchInput.addEventListener("input", renderItems);
gallery.addEventListener("click", event => {
  const card = event.target.closest("[data-item-id]");
  if (!card) return;
  const item = items.find(entry => entry.id === Number(card.dataset.itemId));
  if (item) openModal(item);
});
closeModalButton.addEventListener("click", closeModal);
modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});
claimButton.addEventListener("click", () => {
  if (!selectedItem || selectedItem.archived) return;
  showToast("Ngek, di pa talaga");
});

renderItems();
