const INCOMPLETE_BOOK = 'incompleteBookshelfList';
const COMPLETE_BOOK = 'completeBookshelfList';
const BOOK_ITEM_ID = 'itemid';
const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('bookSubmit');
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');

    submitForm.addEventListener('click', function (event) {
        event.preventDefault();
        addBook();
        // deleteForm();
    });

    inputBookIsComplete.addEventListener('input', function (event) {
        event.preventDefault();
        createCheckButton();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan");
});
document.addEventListener("ondataloaded", () => {
    refreshDataFromList();
});

const inputBookIsComplete = document.getElementById('inputBookIsComplete');
inputBookIsComplete.addEventListener('click', function () {
    if (inputBookIsComplete.checked) {
        document.getElementById('typeBook').innerHTML = '<strong>Selesai Dibaca</strong>';
        document.getElementById('editTypeBook').innerHTML = '<strong>Selesai Dibaca</strong>';

    } else {
        document.getElementById('typeBook').innerHTML = '<strong>Belum Dibaca</strong>';
        document.getElementById('editTypeBook').innerHTML = '<strong>Belum Dibaca</strong>';
    }
});


function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null)
        books = data;
    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function composeBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };
}
function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0;
    for (const book of books) {
        if (book.id === bookId)
            return index;

        index++;
    }
    return -1;
}

function refreshDataFromList() {
    const incompleteBookShelfList = document.getElementById(INCOMPLETE_BOOK);
    let completeBookShelfList = document.getElementById(COMPLETE_BOOK);
    document.getElementById('editBook').style.display = 'none';
    for (const book of books) {
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        newBook[BOOK_ITEM_ID] = book.id;
        if (book.isComplete) {
            completeBookShelfList.append(newBook);
        } else {
            incompleteBookShelfList.append(newBook);
        }
    }
}

function makeBook(title, author, year, isComplete) {
    const bookTitle = document.createElement('h3');
    const Title = document.createElement('span');
    Title.classList.add('book_title');
    Title.innerText = title;
    bookTitle.append(Title);

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis : ';
    const Author = document.createElement('span');
    Author.classList.add('book_author');
    Author.innerText = author;
    bookAuthor.append(Author);

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun : ';
    const Year = document.createElement('span');
    Year.classList.add('book_year');
    Year.innerText = year;
    bookYear.append(Year);

    const infoBook = document.createElement('div');
    infoBook.classList.add('info');
    infoBook.append(bookTitle, bookAuthor, bookYear);

    const bookAction = document.createElement('div');
    bookAction.classList.add('action');

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(infoBook, bookAction);

    const check = createCheckButton();
    check.innerText = 'Selesai';
    const edit = createEditButton();
    edit.innerText = 'Edit';
    const trash = createDeleteButton();
    trash.innerText = 'Hapus';
    const undo = createUndoButton();
    undo.innerText = 'Restart';

    if (isComplete) {
        bookAction.append(edit, undo, trash);
    } else {
        bookAction.append(edit, check, trash);
    }
    return container;
}

function addBook() {
    const incompleteBookShelfList = document.getElementById(INCOMPLETE_BOOK);
    const completeBookShelfList = document.getElementById(COMPLETE_BOOK);

    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');

    if (!inputBookIsComplete.checked) {
        const book = makeBook(inputBookTitle, inputBookAuthor, inputBookYear, false);
        const bookObject = composeBookObject(inputBookTitle, inputBookAuthor, inputBookYear, false);
        book[BOOK_ITEM_ID] = bookObject.id;
        books.push(bookObject);
        incompleteBookShelfList.append(book);
    } else {
        const book = makeBook(inputBookTitle, inputBookAuthor, inputBookYear, true);
        const bookObject = composeBookObject(inputBookTitle, inputBookAuthor, inputBookYear, true);
        book[BOOK_ITEM_ID] = bookObject.id;
        books.push(bookObject);
        completeBookShelfList.append(book);
    }
    updateDataToStorage();
}

function deleteForm() {
    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement('button');
    button.classList.add(buttonTypeClass);
    button.addEventListener('click', function (event) {
        eventListener(event);
    });

    return button;
}

function addBookToCompleted(bookElemen) {
    const bookTitle = bookElemen.querySelector('.book_title').innerText;
    const bookAuthor = bookElemen.querySelector('.book_author').innerText;
    const bookYear = bookElemen.querySelector('.book_year').innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const completeBookShelfList = document.getElementById(COMPLETE_BOOK);
    const book = findBook(bookElemen[BOOK_ITEM_ID]);
    book.isComplete = true;
    newBook[BOOK_ITEM_ID] = book.id;
    completeBookShelfList.append(newBook);

    bookElemen.remove();
    updateDataToStorage();
}

function createCheckButton() {
    return createButton('check', function (event) {
        const parent = event.target.parentElement;
        addBookToCompleted(parent.parentElement);
    });
}

function createDeleteButton() {
    return createButton('trash', function (event) {
        const parent = event.target.parentElement;
        deleteBookFromCompleted(parent.parentElement);
    });
}

function createUndoButton() {
    return createButton('undo', function (event) {
        const parent = event.target.parentElement;
        undoBookFromCompleted(parent.parentElement);
    });
}

function createEditButton() {
    return createButton('edit', function (event) {
        const parent = event.target.parentElement;
        editBook(parent.parentElement);
    });
}

function deleteBookFromCompleted(bookElemen) {
    const positionBook = findBookIndex(bookElemen[BOOK_ITEM_ID]);
    books.splice(positionBook, 1);

    bookElemen.remove();
    updateDataToStorage();
}

function undoBookFromCompleted(bookElemen) {
    const bookTitle = bookElemen.querySelector('.book_title').innerText;
    const bookAuthor = bookElemen.querySelector('.book_author').innerText;
    const bookYear = bookElemen.querySelector('.book_year').innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
    const incompleteBookShelfList = document.getElementById(INCOMPLETE_BOOK);

    const book = findBook(bookElemen[BOOK_ITEM_ID]);
    book.isComplete = false;
    newBook[BOOK_ITEM_ID] = book.id;
    incompleteBookShelfList.append(newBook);
    bookElemen.remove();

    updateDataToStorage();
}

function editBook(bookElemen) {
    document.getElementById('bookSubmit').style.display = 'none';
    const editBook = document.getElementById('editBook');
    editBook.style.display = 'block';

    document.getElementById('inputBookTitle').value = bookElemen.querySelector('.book_title').innerText;
    document.getElementById('inputBookAuthor').value = bookElemen.querySelector('.book_author').innerText;
    document.getElementById('inputBookYear').value = bookElemen.querySelector('.book_year').innerText;

    editBook.addEventListener('click', function (event) {
        event.preventDefault();
        addBookEdit(bookElemen);
    });
}

function addBookEdit(bookElemen) {
    bookElemen.remove();
    deleteBookFromCompleted(bookElemen);
    const incompleteBookShelfList = document.getElementById(INCOMPLETE_BOOK);
    const completeBookShelfList = document.getElementById(COMPLETE_BOOK);


    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');

    if (!inputBookIsComplete.checked) {
        const book = makeBook(inputBookTitle, inputBookAuthor, inputBookYear, false);
        const bookObject = composeBookObject(inputBookTitle, inputBookAuthor, inputBookYear, false);
        book[BOOK_ITEM_ID] = bookObject.id;
        books.push(bookObject);
        incompleteBookShelfList.append(book);
    } else {
        const book = makeBook(inputBookTitle, inputBookAuthor, inputBookYear, true);
        const bookObject = composeBookObject(inputBookTitle, inputBookAuthor, inputBookYear, true);
        book[BOOK_ITEM_ID] = bookObject.id;
        books.push(bookObject);
        completeBookShelfList.append(book);
    }

    updateDataToStorage();
    deleteForm();
    backButton();
}

function backButton() {
    document.getElementById('bookSubmit').style.display = 'block';
    document.getElementById('editBook').style.display = 'none';
}

document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();

    const caribuku = document.getElementById('searchBookTitle').value.toLowerCase();
    const listBuku = document.querySelectorAll('.book_item');
    for (let book of listBuku) {
        const title = book.firstElementChild.innerText.toLowerCase();
        if (title.includes(caribuku)) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    }
})
