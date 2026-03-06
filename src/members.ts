import type { Member } from "./types";

const list = document.getElementById("member-list");

let allMembers: Member[] = [];

export async function loadMembers() {
  const res = await fetch("http://localhost:3000/members");
  const members: Member[] = await res.json();
  allMembers = members;

  list!.innerHTML = ""; 
  
  members.forEach(member => {
    const li = document.createElement("li");
    li.textContent = `${member.name} - ${member.category}`;
    list?.appendChild(li);
  });
}

export function getAllMembers() {
  return allMembers;
}