const apiUrl = 'https://jsonplaceholder.typicode.com/users';
const userTable = document.querySelector('#userTable tbody');
const cityFilter = document.querySelector('#cityFilter');
const addUserBtn = document.querySelector('#addUserBtn');
const modal = document.querySelector('.modal');
const formTitle = document.querySelector('#formTitle');
const closeModalBtn = document.querySelector('.close');
const saveUserBtn = document.querySelector('#saveUserBtn');
let editingUserIndex = null;
let users = [];

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    users = data;
    populateTable(users);
    populateCityFilter(users);
  });


function populateTable(users) {
  userTable.innerHTML = '';
  users.forEach((user, index) => {
    const row = userTable.insertRow();
    row.insertCell().textContent = user.name;
    row.insertCell().textContent = user.email;
    row.insertCell().textContent = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
    row.insertCell().textContent = user.address.city;
    
    const actionCell = row.insertCell();
    actionCell.innerHTML = `
      <button onclick="editUser(${index})">Edit</button>
      <button onclick="deleteUser(${index})">Delete</button>
    `;
  });
}

function populateCityFilter(users) {
  const cities = new Set(users.map(user => user.address.city));
  cityFilter.innerHTML = '';
  cities.forEach(city => {
    const option = document.createElement('option');
    option.textContent = city;
    cityFilter.appendChild(option);
  });
  cityFilter.addEventListener('change', event => {
    const selectedCity = event.target.value;
    const filteredUsers = selectedCity ? users.filter(user => user.address.city === selectedCity) : users;
    populateTable(filteredUsers);
  });
}


function showUserFormModal() {
  modal.style.display = 'block';
}

closeModalBtn.onclick = () => {
  modal.style.display = 'none';
  clearForm();
};

function clearForm() {
  document.getElementById('userName').value = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('userAddress').value = '';
  document.getElementById('userCity').value = '';
  editingUserIndex = null;
}

addUserBtn.onclick = () => {
  formTitle.textContent = 'Add User';
  showUserFormModal();
};

function editUser(index) {
  formTitle.textContent = 'Edit User';
  editingUserIndex = index;
  const user = users[index];
  document.getElementById('userName').value = user.name;
  document.getElementById('userEmail').value = user.email;
  document.getElementById('userAddress').value = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
  document.getElementById('userCity').value = user.address.city;
  showUserFormModal();
}

saveUserBtn.onclick = () => {
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const address = document.getElementById('userAddress').value;
  const city = document.getElementById('userCity').value;

  const newUser = {
    name,
    email,
    address: {
      street: address.split(', ')[0],
      suite: address.split(', ')[1] || '',
      city,
      zipcode: address.split(', ')[3] || '',
    },
  
  };

  if (editingUserIndex !== null) {
    users[editingUserIndex] = newUser;
  } else {
    users.push(newUser);
  }

  populateTable(users);
  populateCityFilter(users);
  modal.style.display = 'none';
  clearForm();
};

function deleteUser(index) {
  users.splice(index, 1);
  populateTable(users);
  populateCityFilter(users);
}
