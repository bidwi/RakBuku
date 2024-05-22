document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value);
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const book = {
      id: +new Date(),
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    const bookshelfList = isComplete
      ? completeBookshelfList
      : incompleteBookshelfList;

    const bookInfo = createBookInfo(book);
    bookInfo.setAttribute("data-id", book.id);
    bookshelfList.appendChild(bookInfo);

    updateStorage();
  }

  function createBookInfo(book) {
    const bookInfo = document.createElement("article");
    bookInfo.classList.add("book_item");
    bookInfo.setAttribute("data-id", book.id);

    const title = document.createElement("h3");
    title.innerText = book.title;

    const author = document.createElement("p");
    author.innerText = "Penulis: " + book.author;

    const year = document.createElement("p");
    year.innerText = "Tahun: " + book.year;

    const action = document.createElement("div");
    action.classList.add("action");

    const actionButton = document.createElement("button");
    actionButton.classList.add("green");
    actionButton.innerText = book.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    actionButton.addEventListener("click", function () {
      changeStatus(book, bookInfo);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      deleteBook(book, bookInfo);
    });

    action.appendChild(actionButton);
    action.appendChild(deleteButton);

    bookInfo.appendChild(title);
    bookInfo.appendChild(author);
    bookInfo.appendChild(year);
    bookInfo.appendChild(action);

    return bookInfo;
  }

  function changeStatus(book, bookInfo) {
    book.isComplete = !book.isComplete;

    const actionButton = bookInfo.querySelector(".action > button");
    actionButton.classList.toggle("green");
    actionButton.classList.toggle("green");
    actionButton.innerText = book.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";

    const currentBookshelfList = book.isComplete
      ? completeBookshelfList
      : incompleteBookshelfList;
    currentBookshelfList.appendChild(bookInfo);

    updateStorage();
  }

  function deleteBook(book, bookInfo) {
    const confirmation = confirm('Tekan "OK" untuk menghapus buku ini');
    if (confirmation) {
      bookInfo.remove();
      updateStorage();
    }
  }

  function searchBook() {
    const searchBookTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const bookInfos = document.querySelectorAll(".book_item");

    bookInfos.forEach(function (bookInfo) {
      const title = bookInfo.querySelector("h3").innerText.toLowerCase();
      if (title.includes(searchBookTitle)) {
        bookInfo.style.display = "block";
      } else {
        bookInfo.style.display = "none";
      }
    });
  }

  function updateStorage() {
    const incompleteBooks = [];
    const completeBooks = [];

    document.querySelectorAll(".book_item").forEach(function (bookInfo) {
      const book = {
        id: parseInt(bookInfo.getAttribute("data-id")),
        title: bookInfo.querySelector("h3").innerText,
        author: bookInfo
          .querySelector("p:nth-of-type(1)")
          .innerText.replace("Penulis: ", ""),
        year: parseInt(
          bookInfo
            .querySelector("p:nth-of-type(2)")
            .innerText.replace("Tahun: ", "")
        ),
        isComplete:
          bookInfo.querySelector(".action > button").innerText ===
          "Belum selesai dibaca",
      };

      if (book.isComplete) {
        completeBooks.push(book);
      } else {
        incompleteBooks.push(book);
      }
    });

    localStorage.setItem("incompleteBooks", JSON.stringify(incompleteBooks));
    localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
  }

  function loadStorage() {
    let incompleteBooks =
      JSON.parse(localStorage.getItem("incompleteBooks")) || [];
    let completeBooks = JSON.parse(localStorage.getItem("completeBooks")) || [];

    if (incompleteBooks.length === 0 && completeBooks.length === 0) {
      const defaultIncompleteBooks = [];
      const defaultCompleteBooks = [];

      localStorage.setItem(
        "incompleteBooks",
        JSON.stringify(defaultIncompleteBooks)
      );
      localStorage.setItem(
        "completeBooks",
        JSON.stringify(defaultCompleteBooks)
      );

      incompleteBooks = defaultIncompleteBooks;
      completeBooks = defaultCompleteBooks;
    }

    incompleteBooks.forEach(function (book) {
      const bookInfo = createBookInfo(book);
      bookInfo.setAttribute("data-id", book.id);
      incompleteBookshelfList.appendChild(bookInfo);
    });

    completeBooks.forEach(function (book) {
      const bookInfo = createBookInfo(book);
      bookInfo.setAttribute("data-id", book.id);
      completeBookshelfList.appendChild(bookInfo);
    });
  }

  loadStorage();
});
