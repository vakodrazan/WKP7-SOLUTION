let books = [];

// add an element to the list with the form
// The element is added on the list
// reset the form after submission
// Not add an empty element
// delete an element
// edit the state of an element
// save new element to local storage
// save the new state of object in local storage
// form validation?

const tableList = document.querySelector('tbody');
const form = document.querySelector('form');

const showBooks = () => {
    const html = books
        .map(book => {
            return `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.genre}</td>
                    <td>${book.pages}</td>
                    <td>
                        <button value="${book.id}" class="check" aria-label="update read attribute of ${book.title}">
                            <img ${book.read ? '' : 'hidden'} src="./assets/icons/checked.svg" alt="The book ${book.title} is read">
                            <img ${book.read ? 'hidden' : ''} src="./assets/icons/unchecked.svg" alt="The book ${book.title} is not read">
                        </button>
                    </td>
                    <td>
                    <button value="${book.id}" class="delete" aria-label="Delete book ${book.title}">
                        <img src="./assets/icons/trash.svg" alt="Delete ${book.title} from the list">
                    </button>
                    </td>
                </tr>
                
            `
        })
        .join('');
        tableList.innerHTML = html;
};

const addBook = e => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const newBook = {
        title: formEl.title.value,
        author: formEl.author.value,
        genre: formEl.genre.value,
        pages: formEl.pages.value,
        read: formEl.read.value === 'true',
        id: Date.now(),
    }
    books.push(newBook);
    tableList.dispatchEvent(new CustomEvent('listUpdated'));
    formEl.reset();
};

// event delegation 
const handleClick = e => {
    // update read attribute
    const checkBtn = e.target.closest("button.check");
    // if the check button was clicked
    if (checkBtn) {
        const id = Number(checkBtn.value);
        updateRead(id);
    }
    // if the delete button was clicked
    const deleteBtn = e.target.closest("button.delete")
    if (deleteBtn) {
        const id = Number(deleteBtn.value);
        deleteBook(id);
    }
};

const deleteBook = idToDelete => {
    books = books.filter(book => book.id !== idToDelete);
    tableList.dispatchEvent(new CustomEvent('listUpdated'));
};

const updateRead = id => {
    const bookToUpdate = books.find(book => book.id === id);
    // objects and arrays are passed by reference (but not by value)
    bookToUpdate.read = !bookToUpdate.read;
    // if we just update the attribute here, it will also be updates the list
    console.log(bookToUpdate);
    tableList.dispatchEvent(new CustomEvent('listUpdated'));
};

// when we reload, we want to look the inside local storage
const initLocalStorage = () => {
    const bookLs = JSON.parse(localStorage.getItem('books'));
    console.log("Hello",  bookLs)
    if (bookLs) {
        books = bookLs;
    }
    tableList.dispatchEvent(new CustomEvent('listUpdated'));
};

const updateLocalStorage = () => {
    localStorage.setItem('books', JSON.stringify(books));
};



form.addEventListener('submit', addBook);
tableList.addEventListener('listUpdated', showBooks);
tableList.addEventListener('listUpdated', updateLocalStorage)
tableList.addEventListener('click', handleClick);

initLocalStorage();