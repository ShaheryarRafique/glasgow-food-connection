document.addEventListener('DOMContentLoaded', async () => {
    try {
        await Promise.all([fetchAllUsers(), fetchAllFoods()]);
        // Any code here will run after both fetchAllUsers and fetchAllFoods have completed
        console.log('Both users and foods have been fetched and displayed.');
    } catch (error) {
        console.error('Error fetching users or foods:', error);
    }
});

// Food JS
async function fetchAllFoods() {
    try {
        const response = await fetch('/api/v1/food') // Adjust this endpoint to match your backend API
            ;
        const data = await response.json();
        return populateFoodsTable(data.foods);
    } catch (error) {
        return console.error('Error fetching foods:', error);
    }
}

// Function to populate the food table with fetched food items
function populateFoodsTable(foods) {

    const tbody = document.getElementById('foodItemsTable');
    tbody.innerHTML = '';
    console.log("Foods :: ", foods);

    foods.forEach(food => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-200 hover:bg-gray-100';

        // Adjust the innerHTML structure to match the food item properties you want to display
        tr.innerHTML = `
            <td class="py-3 px-6 text-left whitespace-nowrap text-gray-900 font-normal">${food._id}</td>
            <td class="py-3 px-6 text-left text-gray-900 font-normal">${food.name}</td>
            <td class="py-3 px-6 text-center text-gray-900 font-normal">${food.quantity}</td>
            <td class="py-3 px-6 text-center text-gray-900 font-normal">${food.expiry}</td>
            <td class="py-3 px-6 text-center text-gray-900 font-normal">${food.foodCategory}</td>
            <td class="py-3 px-6 text-center text-gray-900 font-normal">${food.locationName}</td>
            <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center">
                    <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer" onclick="openEditFoodItemModal('${food._id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                    </div>
                    <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer" onclick="deleteFood('${food._id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                    </div>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Function to open the edit food item modal and populate it with data
function openEditFoodItemModal(foodItemId) {
    fetch(`/api/v1/food/${foodItemId}`) // Adjust to your API endpoint
        .then(response => response.json())
        .then(foodItem => {
            console.log("Food Item", foodItem)
            document.getElementById('editFoodItemId').value = foodItem.food._id;
            document.getElementById('editFoodItemName').value = foodItem.food.name;
            document.getElementById('editFoodItemQuantity').value = foodItem.food.quantity;
            document.getElementById('editFoodItemExpiry').value = foodItem.food.expiry;
            document.getElementById('editFoodItemModal').classList.remove('hidden');
        })
        .catch(error => console.error('Error fetching food item details:', error));
}

// Close the edit food item modal
document.getElementById('cancelEditFoodItemButton').addEventListener('click', () => {
    document.getElementById('editFoodItemModal').classList.add('hidden');
});

// Handle the edit food item form submission
document.getElementById('editFoodItemForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const foodItemId = document.getElementById('editFoodItemId').value;

    const updatedFoodItemData = {
        name: document.getElementById('editFoodItemName').value,
        quantity: document.getElementById('editFoodItemQuantity').value,
        expiry: document.getElementById('editFoodItemExpiry').value,
    };

    fetch(`/api/v1/food/${foodItemId}`, { // Adjust to your API endpoint
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFoodItemData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Food item updated successfully!');
        document.getElementById('editFoodItemModal').classList.add('hidden');
        fetchAllFoods(); // Refresh the food items list
    })
    .catch(error => {
        console.error('Error updating food item:', error);
        alert('Failed to update food item.');
    });
});

function deleteFood(foodId) {
    // Confirm before deleting
    if (confirm('Are you sure you want to delete this food?')) {
        fetch(`/api/v1/food/${foodId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) throw new Error('Error deleting food');
                fetchAllFoods(); // Refresh the list after deletion
            })
            .catch(error => console.error('Error:', error));
    }
}


// ==============================================================

// User JS
async function fetchAllUsers() {
    try {
        const response = await fetch('/api/v1/user');
        const data = await response.json();
        return populateUsersTable(data.users);
    } catch (error) {
        return console.error('Error fetching users:', error);
    }
}

function populateUsersTable(users) {
    console.log(users)
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-200 hover:bg-gray-100';

        tr.innerHTML = `
            <td class="py-3 px-6 text-left whitespace-nowrap text-gray-900 font-normal">${user._id}</td>
            <td class="py-3 px-6 text-left text-gray-900 font-normal">${user.name}</td>
            <td class="py-3 px-6 text-center text-gray-900 font-normal">${user.email}</td>
            <td class="py-3 px-6 text-gray-900 text-center font-normal">${user.phone}</td>
            <td class="py-3 px-6 text-center text-yellow-700 font-normal"><span class="px-2 py-1 bg-yellow-300 rounded-lg font-medium shadow-sm" >${user.accountType}</span></td>
            <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center">
                    <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer" onclick="openEditModal('${user._id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                    </div>
                    <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer" onclick="deleteUser('${user._id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                    </div>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function deleteUser(userId) {
    // Confirm before deleting
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/v1/user/${userId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) throw new Error('Error deleting user');
                fetchAllUsers(); // Refresh the list after deletion
            })
            .catch(error => console.error('Error:', error));
    }
}

function openEditModal(userId) {
    // Fetch user details and populate the form in the modal
    fetch(`/api/v1/user/${userId}`)
        .then(response => response.json())
        .then(user => {
            console.log("user :::: ", user.user)
            document.getElementById('editUserId').value = user.user._id;
            document.getElementById('editUserName').value = user.user.name;
            document.getElementById('editUserEmail').value = user.user.email;
            document.getElementById('editUserPhone').value = user.user.phone;
            // Show the modal
            document.getElementById('editUserModal').classList.remove('hidden');
        })
        .catch(error => console.error('Error fetching user details:', error));
}

// Close the modal and clear the form
function closeModal() {
    document.getElementById('editUserModal').classList.add('hidden');
    document.getElementById('editUserForm').reset();
}

document.getElementById('editUserForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const userId = document.getElementById('editUserId').value;

    const updatedUserData = {
        name: document.getElementById('editUserName').value,
        email: document.getElementById('editUserEmail').value,
        phone: document.getElementById('editUserPhone').value,
    };

    fetch(`/api/v1/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('User updated successfully', data);
            alert('User updated successfully!');
            closeModal();
            fetchAllUsers(); // Refresh the users list
        })
        .catch(error => {
            console.error('Error updating user:', error);
            alert('Failed to update user.');
        });
});

// Optional: Add an event listener for a cancel button to close the modal
document.getElementById('cancelButtonId').addEventListener('click', closeModal);