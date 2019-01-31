const baseURL = 'http://localhost:3000/a_cappella_groups'
const tableEl = document.querySelector('#table-body')
const winnerEl = document.querySelector('#winner')
let trophyIMGs
let deleteBtns

const state = {
  groups: [],
  winner: null
}

const getGroups = () => {

  return fetch(baseURL)
    .then(res => res.json())
    .then(groups => {
      state.groups = groups
      renderAllGroups()
    })
}

const winnerClickHandler = (group) => {
  state.winner = state.groups.find(group => group.id == event.target.dataset.id)
  winnerEl.innerHTML = ''
  winnerEl.innerHTML += `
    <h2>Winner: ${state.winner.name}</h2>
    `
  renderAllGroups()
}

const renderAllGroups = () => {
  tableEl.innerHTML = ""
  state.groups.forEach( group => groupInfo(group) )
  trophyIMGs = document.querySelectorAll('#trophy')
  deleteBtns = document.querySelectorAll('#delete')
  trophyIMGs.forEach(trophy => trophy.addEventListener('click', winnerClickHandler))
  deleteBtns.forEach(deleteBtn => deleteBtn.addEventListener('click', deleteClickHandler))
}

const groupInfo = (group) => {
  if (group != state.winner){
    tableEl.innerHTML += `
      <tr><td>${group.college.name}</td>
      <td>${group.name}</td>
      <td>${group.membership}</td>
      <td>${group.college.division}</td>
      <td><img src='./assets/trophy.png' id='trophy' data-id='${group.id}'/>
      <button id='delete' data-id='${group.id}'>Delete</button></td>
      </tr>
    `
  }
}

const deleteClickHandler = (event) => {
  const selectedGroupId = event.target.dataset.id
  const selectedGroup = state.groups.find(group => group.id == selectedGroupId)
  deleteGroup(selectedGroup)
}

const deleteGroup = (group) => {
  return fetch(`http://localhost:3000/a_cappella_groups/${group.id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(group)
  }).then(res => getGroups())
}

getGroups()
