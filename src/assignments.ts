


import type { Assignment, Member } from "./types";
import { getAllMembers } from "./members";

const newList = document.getElementById("new-list");
const doingList = document.getElementById("doing-list");
const doneList = document.getElementById("done-list");

// Hämta och rendera assignments
export async function loadAssignments() {
  try {
    // Hämta assignments
    const res = await fetch("http://localhost:3000/assignments");
    const data = await res.json();
    const assignments: Assignment[] = data.assignments || data;

    // Hämta alla medlemmar
    const allMembers: Member[] = await getAllMembers();

    // Rendera assignments med members
    renderAssignments(assignments, allMembers);
  } catch (err) {
    console.error("Error loading assignments:", err);
  }
}

// Assign-task med assignedId
export async function assignTask(taskId: string, member: Member) {
  await fetch(`http://localhost:3000/assignments/${taskId}/assign`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assignedId: member.id,
      assignedTo: member.name,
    }),
  });

  await loadAssignments(); // refresha listorna
}

// Update status
export async function updateAssignmentStatus(
  taskId: string,
  status: "new" | "doing" | "done"
) {
  const res = await fetch(`http://localhost:3000/assignments/${taskId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return true;
}

// Render assignments
function renderAssignments(assignments: Assignment[], allMembers: Member[]) {
  newList!.innerHTML = "";
  doingList!.innerHTML = "";
  doneList!.innerHTML = "";

  assignments.forEach((task) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${task.title}</strong><br/>
      ${task.description}<br/>
      Category: ${task.category}<br/>
      ${task.timestamp}<br/>
    `;

    if (task.status === "new") {
      const select = document.createElement("select");

      // Filtrera members baserat på kategori
      const filteredMembers = allMembers.filter(
        (m) => {
          console.log(m.category.trim().toLowerCase(), task.category.trim().toLowerCase())
        return   m.category.trim().toLowerCase() === task.category.trim().toLowerCase()
        
        }
      );

      filteredMembers.forEach((member) => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = member.name;
        select.appendChild(option);
      });

      const assignBtn = document.createElement("button");
      assignBtn.textContent = "Assign";

      assignBtn.onclick = async () => {
        const memberId = select.value;
        const member = allMembers.find((m) => m.id === memberId);
        if (!member) return;
        await assignTask(task.id, member);
      };

      li.appendChild(select);
      li.appendChild(assignBtn);
      newList?.appendChild(li);
    } else if (task.status === "doing") {
      const doneBtn = document.createElement("button");
      doneBtn.textContent = "Done";

      const assigned = document.createElement("p");
      assigned.textContent = `Assigned to: ${task.assignedTo || "None"}`;

      doneBtn.onclick = async () => {
        try {
          await updateAssignmentStatus(task.id, "done");
          await loadAssignments();
        } catch (err) {
          console.error("Error updating assignment:", err);
        }
      };

      li.appendChild(assigned);
      li.appendChild(doneBtn);
      doingList?.appendChild(li);
    } else if (task.status === "done") {
      const assigned = document.createElement("p");
      assigned.textContent = `Done by: ${task.assignedTo || "None"}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";

      deleteBtn.onclick = async () => {
        try {
          const res = await fetch(`http://localhost:3000/assignments/${task.id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error(`Failed to delete task: ${res.status}`);
          await loadAssignments();
          alert(`Task "${task.title}" deleted!`);
        } catch (err) {
          console.error(err);
          alert("Could not delete task.");
        }
      };

      li.appendChild(assigned);
      li.appendChild(deleteBtn);
      doneList?.appendChild(li);
    }
  });
}










