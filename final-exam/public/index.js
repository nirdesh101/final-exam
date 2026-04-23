let selectedCustomerId = null;

async function loadCustomers() {
  const container = document.getElementById("customer-list");

  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    data.forEach(person => {
      const div = document.createElement("div");

      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      // CLICK CUSTOMER
      div.addEventListener("click", () => {
        selectCustomer(person);
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}

// SELECT CUSTOMER
function selectCustomer(person) {

  selectedCustomerId = person.id;

  document.getElementById("firstName").value =
    person.first_name || "";

  document.getElementById("lastName").value =
    person.last_name || "";

  document.getElementById("email").value =
    person.email || "";

  document.getElementById("phone").value =
    person.phone || "";

  document.getElementById("birthDate").value =
    person.birth_date
      ? person.birth_date.split("T")[0]
      : "";
}

// ADD CUSTOMER
document
  .getElementById("customerManagementForm")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const customerData = {
      first_name: document.getElementById("firstName").value,
      last_name: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      birth_date: document.getElementById("birthDate").value
    };

    try {

      const res = await fetch("/api/persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(customerData)
      });

      if (!res.ok) {
        throw new Error("Failed to add customer");
      }

      clearForm();
      loadCustomers();

    } catch (err) {
      console.error(err);
      alert("Error adding customer");
    }
  });

// UPDATE CUSTOMER
document
  .getElementById("updateBtn")
  .addEventListener("click", async () => {

    if (!selectedCustomerId) {
      alert("Select a customer first");
      return;
    }

    const customerData = {
      first_name: document.getElementById("firstName").value,
      last_name: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      birth_date: document.getElementById("birthDate").value
    };

    try {

      const res = await fetch(`/api/persons/${selectedCustomerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(customerData)
      });

      if (!res.ok) {
        throw new Error("Failed to update customer");
      }

      clearForm();
      loadCustomers();

    } catch (err) {
      console.error(err);
      alert("Error updating customer");
    }
  });

// DELETE CUSTOMER
document
  .getElementById("deleteBtn")
  .addEventListener("click", async () => {

    if (!selectedCustomerId) {
      alert("Select a customer first");
      return;
    }

    try {

      const res = await fetch(`/api/persons/${selectedCustomerId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete customer");
      }

      clearForm();
      loadCustomers();

    } catch (err) {
      console.error(err);
      alert("Error deleting customer");
    }
  });

// CLEAR FORM
function clearForm() {

  selectedCustomerId = null;

  document
    .getElementById("customerManagementForm")
    .reset();
}

// INITIAL LOAD
loadCustomers();