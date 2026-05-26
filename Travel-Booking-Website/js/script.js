const destinationPrices = {
  Kerala: 18000,
  Dubai: 38000,
  Bali: 42000,
  Singapore: 45000,
  Maldives: 58000,
  Paris: 72000
};

const destinations = [
  { name: "Bali", country: "Indonesia", image: "images/destination-bali.jpg", tag: "Beach escapes from ₹42,000", price: destinationPrices.Bali },
  { name: "Maldives", country: "Island Resort", image: "images/destination-maldives.jpg", tag: "Crystal stays from ₹58,000", price: destinationPrices.Maldives },
  { name: "Paris", country: "France", image: "images/destination-paris.jpg", tag: "City breaks from ₹72,000", price: destinationPrices.Paris },
  { name: "Kerala", country: "India", image: "images/destination-kerala.jpg", tag: "Backwater trips from ₹18,000", price: destinationPrices.Kerala },
  { name: "Dubai", country: "UAE", image: "images/destination-dubai.jpg", tag: "Family tours from ₹38,000", price: destinationPrices.Dubai },
  { name: "Singapore", country: "Singapore", image: "images/destination-singapore.jpg", tag: "Urban holidays from ₹45,000", price: destinationPrices.Singapore }
];

function renderDestinations() {
  const strip = document.getElementById("destinationStrip");
  if (!strip) return;
  strip.innerHTML = destinations.map(place => `
    <article class="destination-card">
      <img src="${place.image}" alt="${place.name}">
      <div class="destination-text">
        <p>${place.country}</p>
        <h3>${place.name}</h3>
        <small>${place.tag}</small>
      </div>
    </article>
  `).join("");
}

function showError(input, message) {
  const wrapper = input.closest(".field-wrap");
  const error = wrapper ? wrapper.querySelector(".error-message") : null;
  if (error) {
    error.textContent = message;
    error.style.display = "block";
  }
  input.classList.add("is-invalid");
}

function clearError(input) {
  const wrapper = input.closest(".field-wrap");
  const error = wrapper ? wrapper.querySelector(".error-message") : null;
  if (error) error.style.display = "none";
  input.classList.remove("is-invalid");
}

function formatINR(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

function getSelectedBasePrice() {
  const destination = document.getElementById("destination");
  if (!destination || !destination.value) return 0;
  const selectedOption = destination.options[destination.selectedIndex];
  return Number((selectedOption && selectedOption.dataset.price) || destinationPrices[destination.value] || 0);
}

function calculateBookingPrice() {
  const basePrice = getSelectedBasePrice();
  const personsInput = document.getElementById("persons");
  const personCount = Math.max(1, Number(personsInput && personsInput.value ? personsInput.value : 1));
  const addOns = ["includeStay", "includeFood", "includeTravel"];

  let addOnPerPerson = 0;
  addOns.forEach(id => {
    const input = document.getElementById(id);
    if (input && input.checked) {
      addOnPerPerson += Number(input.dataset.price || 0);
    }
  });

  const addonsPrice = addOnPerPerson * personCount;
  const totalPrice = (basePrice * personCount) + addonsPrice;

  const baseEl = document.getElementById("basePackagePrice");
  const addonsEl = document.getElementById("addonsPrice");
  const totalEl = document.getElementById("totalPrice");
  if (baseEl) baseEl.textContent = basePrice ? `${formatINR(basePrice)} / person` : "Select destination";
  if (addonsEl) addonsEl.textContent = formatINR(addonsPrice);
  if (totalEl) totalEl.textContent = basePrice ? formatINR(totalPrice) : "₹0";

  return { personCount, addonsPrice, totalPrice };
}

function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  ["destination", "persons", "includeStay", "includeFood", "includeTravel"].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener("input", calculateBookingPrice);
    if (input) input.addEventListener("change", calculateBookingPrice);
  });
  calculateBookingPrice();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;
    const name = document.getElementById("fullName");
    const destination = document.getElementById("destination");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const persons = document.getElementById("persons");
    const pickupLocation = document.getElementById("pickupLocation");
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");

    [name, destination, email, phone, persons, pickupLocation, fromDate, toDate].forEach(clearError);

    if (name.value.trim().length < 3) {
      showError(name, "Please enter at least 3 characters.");
      isValid = false;
    }
    if (!destination.value) {
      showError(destination, "Please select your destination place.");
      isValid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      isValid = false;
    }
    if (!/^[6-9]\d{9}$/.test(phone.value.trim())) {
      showError(phone, "Enter a valid 10-digit phone number.");
      isValid = false;
    }
    const personCount = Number(persons.value);
    if (!personCount || personCount < 1 || personCount > 20) {
      showError(persons, "Enter a valid number between 1 and 20.");
      isValid = false;
    }
    if (pickupLocation.value.trim().length < 3) {
      showError(pickupLocation, "Please enter your pickup location.");
      isValid = false;
    }
    if (!fromDate.value) {
      showError(fromDate, "Select a starting date.");
      isValid = false;
    }
    if (!toDate.value) {
      showError(toDate, "Select an ending date.");
      isValid = false;
    }
    if (fromDate.value && toDate.value && new Date(toDate.value) < new Date(fromDate.value)) {
      showError(toDate, "Ending date cannot be before starting date.");
      isValid = false;
    }

    const success = document.getElementById("bookingSuccess");
    if (isValid) {
      const price = calculateBookingPrice();
      const selectedOptions = [
        document.getElementById("includeStay").checked ? "hotel stay" : null,
        document.getElementById("includeFood").checked ? "food plan" : null,
        document.getElementById("includeTravel").checked ? "local travel" : null
      ].filter(Boolean).join(", ") || "base package only";

      success.innerHTML = `<strong>Booking confirmed!</strong> Your ${destination.value} trip for ${personCount} traveller(s) is booked from pickup location: <strong>${pickupLocation.value.trim()}</strong>. Selected options: ${selectedOptions}. Estimated total: <strong>${formatINR(price.totalPrice)}</strong>. Details and receipt are sent to your mail (${email.value.trim()}) and phone number (${phone.value.trim()}).`;
      success.style.display = "block";
      form.reset();
      calculateBookingPrice();
    } else {
      success.style.display = "none";
    }
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const message = document.getElementById("contactSuccess");
    message.style.display = "block";
    form.reset();
  });
}

renderDestinations();
setupBookingForm();
setupContactForm();
