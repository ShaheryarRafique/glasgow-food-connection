document.addEventListener('DOMContentLoaded', () => {
    // Fetch all items on page load
    fetchAllItems();

    document.getElementById('applyFilters').addEventListener('click', fetchFilteredItems);
    console.log(document.getElementById('applyFilters'))
});

function fetchAllItems() {
    toggleLoader(true);
    fetch('/api/v1/food')
        .then(response => response.json())
        .then(data => {
            updateGallery(data.foods);
            toggleLoader(false);
        })
        .catch(error => {
            console.error('Error fetching all foods:', error);
            toggleLoader(false);
        });
}

function fetchFilteredItems() {
    console.log("Press button")
    toggleLoader(true);
    const quantity = document.getElementById('quantity').value;
    const categories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
                            .map(checkbox => checkbox.value);
    const expiryDate = document.getElementById('expiryDate').value;

    let query = `/api/v1/food?`;
    if (quantity) query += `quantity=${quantity}&`;
    if (expiryDate) query += `expiry=${expiryDate}&`;
    if (categories.length > 0) query += `foodCategory=${categories.join(',')}`;

    fetch(query)
        .then(response => response.json())
        .then(data => {
            updateGallery(data.foods);
            toggleLoader(false);
        })
        .catch(error => {
            console.error('Error fetching filtered foods:', error);
            toggleLoader(false);
        });
}

function updateGallery(items) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing items
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

    items.forEach(item => {

        const isExpired = item.expiry < today;
        const expiryClass = isExpired ? 'line-through' : '';

        const cardHTML = `
            <div class='flex items-center justify-normal min-h-screen'>
                <div class='w-full max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden'>
                    <div class='max-w-md mx-auto'>
                        <div class='h-[236px]' style='background-image:url(https://img.freepik.com/free-photo/pasta-spaghetti-with-shrimps-sauce_1220-5072.jpg?w=2000&t=st=1678041911~exp=1678042511~hmac=e4aa55e70f8c231d4d23832a611004f86eeb3b6ca067b3fa0c374ac78fe7aba6);background-size:cover;background-position:center'>
                        </div>
                        <div class='p-4 sm:p-6'>
                            <p class='font-bold text-gray-700 text-[22px] leading-7 mb-1'>${item.name}</p>
                            <div class='flex flex-row justify-between'>
                                <p class='text-[17px] font-bold text-[#0FB478]'>${item.foodCategory}</p>
                                <p class='text-[#3C3C4399] text-[17px] mr-2'> <span class="font-semibold text-yellow-900">Quantity: </span> ${item.quantity}</p>
                            </div>
                            <p class='text-yellow-900 text-[15px] mt-3 h-16'>${item.description}</p>
                            <p class='text-yellow-900 text-[15px] pt-4 ${expiryClass}'> <span class="text-base font-semibold text-yellow-900">Expiry Date: </span> ${item.expiry}</p>
                            <p class='text-yellow-900 text-[15px] pt-4'> <span class="text-base font-semibold">Location: </span> ${item.locationName}</p>
                            <a target='_blank' href='/food/${item._id}' class='block mt-10 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform bg-[#FFC933] rounded-[14px] hover:bg-[#FFC933DD] focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80'>
                                View on foodies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const cardContainer = document.createElement('div');
        cardContainer.className = 'w-full p-2';
        cardContainer.innerHTML = cardHTML;
        gallery.appendChild(cardContainer);
    });
}


function toggleLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) { // Ensure loader exists
        if (show) {
            loader.classList.remove('hidden'); // Explicitly show
        } else {
            loader.classList.add('hidden'); // Explicitly hide
        }
    } else {
        console.error('Loader element not found!');
    }
}
