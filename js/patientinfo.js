document.getElementById("patientForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission for validation

  function getCheckedMedicalHistory() {
    const checkedBoxes = document.querySelectorAll(
      'input[name="medicalHistory"]:checked'
    );
    const medicalHistory = Array.from(checkedBoxes).map((box) => box.value); // Get the values of checked boxes
    return medicalHistory; // Return an array of checked values
  }

  let errors = []; // Array to store error messages

  // Get form field values
  const idNumber = document.getElementById("idNumber").value;
  const firstName = document.getElementById("firstName").value;
  const address = document.getElementById("address").value;
  const contactNumber = document.getElementById("contactNumber").value;
  const place_of_birth = document.getElementById("placeOfBirth").value;
  const gender = document.querySelector('input[name="gender"]:checked'); // Radio buttons
  const status = document.getElementById("status").value;
  const medicalHistory = getCheckedMedicalHistory();

  // Validate First Name (Required)
  if (firstName.trim() === "") {
    errors.push("First Name is required.");
  }

  // Validate Contact Number (Required and Format)
  const contactPattern = /^\+966\s?\d{3}\s?\d{3}\s?\d{3}$/; // Assuming the format +966 xxx xxx xxx
  if (contactNumber.trim() === "") {
    errors.push("Contact Number is required.");
  } else if (!contactPattern.test(contactNumber)) {
    errors.push("Contact Number should match the format +966 xxx xxx xxx.");
  }

  // Validate ID Number (Required and Must be digits)
  if (idNumber.trim() === "") {
    errors.push("ID Number is required.");
  } else if (!/^\d{10}$/.test(idNumber)) {
    errors.push("ID Number should be exactly 10 digits.");
  }

  // Validate Gender (Required)
  if (!gender) {
    errors.push("Gender is required.");
  }

  // Validate Status (Required)
  if (status === "") {
    errors.push("Status is required.");
  }

  // If there are errors, display them
  if (errors.length > 0) {
    alert(errors.join("\n"));
  } else {
    // Create formDataObject from the form values
    const formDataObject = {
      firstname: firstName.trim(),
      address: address.trim(),
      contact: contactNumber.trim(),
      id: idNumber.trim(),
      place_of_birth: place_of_birth.trim(),
      gender: gender ? gender.value : null, // Get the value of the checked radio button
      marital_status: status,
      doctor_fname: sessionStorage.getItem("Firstname"),
      doctor_lname: sessionStorage.getItem("Lastname"),
    };

    // Make a POST request to register endpoint
    fetch("http://localhost:3000/patient_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObject),
    })
      .then((response) => {
        if (response.ok) {
          fetch("http://localhost:3000/patient_history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patient_id: idNumber,
              diseases: medicalHistory,
            }),
          })
            .then((response) => {
              if (response.ok) {
                sessionStorage.setItem("patient_id", idNumber.trim());
                alert("Your Information have been saved!");
                window.location.href = "./symptoms.html";
              } else {
                // Handle error responses
                response.json().then((data) => {
                  alert(
                    "Failed to save medical history. " +
                      (data.error || "Please try again.")
                  );
                });
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("An error occurred. Please try again later.");
            });
        } else {
          // Registration failed
          response
            .json()
            .then((data) => {
              if (data.error === "Patient with same id already exists") {
                alert(
                  "This Patient ID already exist. Please try different one!"
                );
              } else {
                alert("Registration failed. Please try again.");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("An error occurred. Please try again later.");
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  }
});

// Cancel button functionality to reset the form
document.getElementById("cancel-btn").addEventListener("click", function () {
  document.getElementById("patientForm").reset();
});
