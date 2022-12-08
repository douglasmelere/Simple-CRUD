const endpointURL = "http://localhost:3000/user"

function formatDateBrTime(rawDate) {
  const date = new Date(rawDate)

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

async function deleteUser(userId) {
  const deleteResult = await fetch(`${endpointURL}/${userId}`, {
    method: "DELETE",
  })

  const deleteResultJson = await deleteResult.json()

  if (deleteResultJson.deleteUsersCount < 1) {
    console.error("Nenhum usuário foi deletado")
    return
  }

  const userToBeDeleted = document.getElementById(`user-id-${userId}`)
  userToBeDeleted.remove()

  return deleteResultJson
}

async function editUser(userId) {
  const modalTitle = document.getElementById("change-user-modal-title")
  modalTitle.textContent = "Editar Usuário"

  const userIdInput = document.getElementById("user-id")
  userIdInput.setAttribute("value", userId)

  const user = await fetch(`${endpointURL}/${userId}`)
  const userJson = await user.json()

  const nameInput = document.getElementById("name")
  const usernameInput = document.getElementById("username")
  const emailInput = document.getElementById("email")
  const aboutInput = document.getElementById("about")

  nameInput.value = userJson.name
  usernameInput.value = userJson.username
  emailInput.value = userJson.email
  aboutInput.value = userJson.about
}

async function getAllUsers() {
  const allUsers = await fetch(endpointURL)

  const allUsersJson = await allUsers.json()

  return allUsersJson
}

async function renderAllUsers() {
  const allUsers = await getAllUsers()

  const listItemsArray = allUsers.map(
    (user, index) => `
  <tr id="user-id-${user.id}">
    <td class="align-middle">
      <div
        class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top"
      >
        <input
          type="checkbox"
          class="custom-control-input"
          id="item-${index}"
        />
        <label
          class="custom-control-label"
          for="item-${index}"
        ></label>
      </div>
    </td>
    <td class="align-middle text-center">
      <div
        class="bg-light d-inline-flex justify-content-center align-items-center align-top"
        style="
          width: 35px;
          height: 35px;
          border-radius: 3px;
        "
      >
        <i
          class="fa fa-fw fa-photo"
          style="opacity: 0.8"
        ></i>
      </div>
    </td>
    <td class="text-nowrap align-middle">
      ${user.name}
    </td>
    <td class="text-nowrap align-middle">
      <span>${formatDateBrTime(user.createdAt)}</span>
    </td>
    <td class="text-center align-middle">
      <i
        class="fa fa-fw text-secondary cursor-pointer fa-toggle-on"
      ></i>
    </td>
    <td class="text-center align-middle">
      <div class="btn-group align-top">
        <button
          class="btn btn-sm btn-outline-secondary badge"
          type="button"
          data-toggle="modal"
          data-target="#user-form-modal"
          onclick="editUser(${user.id})"
        >
          Editar
        </button>
        <button
          class="btn btn-sm btn-outline-secondary badge"
          type="button"
          onclick="deleteUser(${user.id})"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </td>
  </tr>
  `
  )

  const listItemsUnique = listItemsArray.reduce(
    (accumulatedValue, currentValue) => accumulatedValue + currentValue,
    ""
  )

  const listWrapperElement = document.createElement("tbody")
  listWrapperElement.innerHTML = listItemsUnique

  const tableElement = document.querySelector(".table")
  tableElement.append(listWrapperElement)
}

async function reRenderAllUsers() {
  const userListElement = document.querySelector("tbody")
  userListElement.remove()
  await renderAllUsers()
}

async function createUser(newUser) {
  const result = await fetch(endpointURL, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(newUser),
  })

  const resultJson = await result.json()

  return resultJson
}

async function updateUser(user) {
  const { id, ...userBody } = user

  const result = await fetch(`${endpointURL}/${user.id}`, {
    method: "PUT",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(userBody),
  })

  const resultJson = await result.json()

  return resultJson
}

const newUserButton = document.getElementById("new-user")

newUserButton.addEventListener("click", () => {
  const modalTitle = document.getElementById("change-user-modal-title")
  modalTitle.textContent = "Criar Usuário"

  const userIdInput = document.getElementById("user-id")
  const nameElement = document.getElementById("name")
  const usernameElement = document.getElementById("username")
  const emailElement = document.getElementById("email")
  const aboutElement = document.getElementById("about")

  userIdInput.setAttribute("value", "")
  nameElement.value = ""
  usernameElement.value = ""
  emailElement.value = ""
  aboutElement.value = ""
})

const saveUserButton = document.getElementById("save-user")

saveUserButton.addEventListener("click", async (event) => {
  event.preventDefault()

  const idElement = document.getElementById("user-id")
  const nameElement = document.getElementById("name")
  const usernameElement = document.getElementById("username")
  const emailElement = document.getElementById("email")
  const aboutElement = document.getElementById("about")

  const userInfo = {
    name: nameElement.value,
    username: usernameElement.value,
    email: emailElement.value,
    about: aboutElement.value,
  }

  const user = idElement.value
    ? {
        ...userInfo,
        id: idElement.value,
      }
    : userInfo

  if (user.id) {
    await updateUser(user)
  } else {
    await createUser(user)
  }

  $("#user-form-modal").modal("hide")
  await reRenderAllUsers()
})

renderAllUsers()
