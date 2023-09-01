// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract BookDatabase {
    struct Book {
        string title;
        uint16 year;
    }

    mapping(uint32 => Book) public books;
    address private immutable owner;
    uint32 private nextId = 0;
    uint32 public count = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier restricted() {
        require(owner == msg.sender, "You don't have permission!");
        _;
    }

    function compare(
        string memory strA,
        string memory strB
    ) private pure returns (bool) {
        bytes memory arrA = bytes(strA);
        bytes memory arrB = bytes(strB);
        return arrA.length == arrB.length && keccak256(arrA) == keccak256(arrB);
    }

    function addBook(Book memory newBook) public {
        nextId++;
        books[nextId] = newBook;
        count++;
    }

    function editBook(uint32 id, Book memory newBook) public {
        Book memory oldBook = books[id];

        if (
            !compare(newBook.title, oldBook.title) &&
            !compare(newBook.title, "")
        ) books[id].title = newBook.title;

        if (newBook.year != oldBook.year && newBook.year > 0)
            books[id].year = newBook.year;
    }

    function removeBook(uint32 id) public restricted {
        if (books[id].year > 0) {
            delete books[id];
            count--;
        }
    }
}
