const ul = document.querySelector(".ul-symptoms"),
  input = document.querySelector(".input"),
  tagNumb = document.querySelector(".details span");

let maxTags = 30;
let minTags = 5;
let tags = [];

const data = {
  Asthma: [
    "cough",
    "breathlessness",
    "chest_tightness",
    "Wheezing",
    "chest-pain",
    "Trouble sleeping",
  ],
  Anemia: [
    "fatigue",
    "breathlessness",
    "Pale",
    "yellowish skin",
    "Irregular heartbeat",
    "Dizziness",
    "lightheadedness",
    "Headaches",
    "Chest pain",
    "Cold hands",
  ],
  "covid-19": [
    "Dry_cough",
    "breathlessness",
    "fatigue",
    "Anosmia",
    "Ageusia",
    "vomiting",
    "diarrhea",
    "headaches",
    "muscle aches",
    "high fever",
    "runny nose",
    "sore throat",
  ],
  Migraine: [
    "Sensitivity to light",
    "throbbing headache",
    "Nausea",
    "vomiting",
    "excessive_hunger",
    "depression",
    "Neck stiffness",
    "Sensitivity  to sound",
    "visual_disturbances",
    "polyuria",
  ],
  Diabetes: [
    "fatigue",
    "obesity",
    "irregular_sugar_level",
    "blurred_vision",
    "Frequent urination",
    "Excessive thirst",
    "excessive hunger",
    "vaginal infections",
    "weight_loss",
    "irritability",
    "slow-healing sore",
  ],
 
};


const examination = {
  Asthma: "spirometer",
  Anemia: "complete blood count (CBC)",
  "covid-19": "PCR and Molecular COVID-19",
  Migraine: "Magnetic resonance imaging (MRI)",
  Diabetes: "hemoglobin A1C (HbA1C)",
};

countTags();
createTag();

function countTags() {
  input.focus();
  tagNumb.innerText = maxTags - tags.length;
}

function handleSubmit() {
  if (tags.length >= minTags) {
    fetch("http://127.0.0.1:4000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptoms: tags,
      }),
    })
      .then((response) => {
        console.log("Response", response);
        if (response.ok) {
         
          return response.json(); // Parse the response as JSON
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        console.log(
          "Response Data:",
          data.disease,
          data.examination,
          sessionStorage.getItem("patient_id")
        );
        fetch("http://localhost:3000/patient_result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: sessionStorage.getItem("patient_id"),
            disease: data.disease,
            examination: data.examination,
          }),
        })
          .then((response) => {
            if (response.ok) {
              window.location.href = "./diagnoseresult.html";
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
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  } else {
    alert(`Please add at least ${minTags} tags.`);
  }
}

function createTag() {
  ul.querySelectorAll("li").forEach((li) => li.remove());
  tags
    .slice()
    .reverse()
    .forEach((tag) => {
      let liTag = `<li>${tag} <i class="uit uit-multiply" onclick="remove(this, '${tag}')"></i></li>`;
      ul.insertAdjacentHTML("afterbegin", liTag);
    });
  countTags();
}

function remove(element, tag) {
  let index = tags.indexOf(tag);
  tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
  element.parentElement.remove();
  countTags();

  // Uncheck the corresponding checkbox
  const items = document.querySelectorAll(".item");
  items.forEach((item) => {
    if (item.querySelector(".item-text").innerText.trim() === tag) {
      item.classList.remove("checked");
    }
  });

  updateSelectedCount();
}

function addTag(e) {
  if (e.key == "Enter") {
    let tag = e.target.value.replace(/\s+/g, " ");
    if (tag.length > 1 && !tags.includes(tag)) {
      if (tags.length < maxTags) {
        tag.split(",").forEach((tag) => {
          tags.push(tag);
          createTag();
        });
      }
    }
    e.target.value = "";
  }
}

input.addEventListener("keyup", addTag);

const removeBtn = document.querySelector(".reset-btn");
removeBtn.addEventListener("click", () => {
  tags.length = 0;
  ul.querySelectorAll("li").forEach((li) => li.remove());
  countTags();

  // Uncheck all checkboxes
  const items = document.querySelectorAll(".item");
  items.forEach((item) => {
    item.classList.remove("checked");
  });

  updateSelectedCount();
});

//  CUSTOM DROPDOWN
const selectBtn = document.querySelector(".select-btn"),
  items = document.querySelectorAll(".item");

selectBtn.addEventListener("click", () => {
  selectBtn.classList.toggle("open");
});

items.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("checked");

    const tagLabel = item.querySelector(".item-text").innerText.trim();
    if (item.classList.contains("checked")) {
      if (!tags.includes(tagLabel) && tags.length < maxTags) {
        tags.push(tagLabel);
        createTag();
      }
    } else {
      removeTagByLabel(tagLabel);
    }

    updateSelectedCount();
  });
});

function removeTagByLabel(tagLabel) {
  let index = tags.indexOf(tagLabel);
  if (index > -1) {
    tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
    createTag();
  }
}

function updateSelectedCount() {
  let checked = document.querySelectorAll(".checked"),
    btnText = document.querySelector(".btn-text");

  if (checked && checked.length > 0) {
    btnText.innerText = `${checked.length} Selected`;
  } else {
    btnText.innerText = "Select Language";
  }
}
