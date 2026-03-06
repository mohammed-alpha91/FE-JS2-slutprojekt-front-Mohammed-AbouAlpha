import { loadMembers } from "./members";

export const URL = "http://localhost:3000/members";

const form = document.querySelector("#member-form") as HTMLFormElement;

if (form) {
  console.log("Member form found:", form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log('Submitting member form');

    await addMember();
  });
}

async function addMember() {
  try {
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonData)
    });

    if (!response.ok) {
      throw new Error("Server returned an error when adding member");
    }

    const result = await response.json();
    console.log("Member added:", result);

    //  Ladda om members-listan direkt efter POST
    await loadMembers();

  } catch (error) {
    console.error("Error adding member:", error);
  }
}

