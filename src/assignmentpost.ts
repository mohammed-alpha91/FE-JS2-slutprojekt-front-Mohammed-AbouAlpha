// assignmentpost.ts
import { loadAssignments } from "./assignments";

export const assignmentURL = "http://localhost:3000/assignments";

const form = document.querySelector("#assignment-form") as HTMLFormElement;

if (form) {
  console.log("Assignment form found:", form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log('Submitting assignment form');

    await addAssignment();
  });
}

async function addAssignment() {
  try {
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    const response = await fetch(assignmentURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonData)
    });

    if (!response.ok) {
      throw new Error("Server returned an error when adding assignment");
    }

    const result = await response.json();
    console.log("Assignment added:", result);

    //Ladda om assignments-listan direkt efter POST
    await loadAssignments();

  } catch (error) {
    console.error("Error adding assignment:", error);
  }
}





