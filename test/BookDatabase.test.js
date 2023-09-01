"use strict"

const BookDatabase = artifacts.require("BookDatabase");

contract('BookDatabase', function (accounts) {

  const bookTitle = "Test";

  beforeEach(async () => {
    contract = await BookDatabase.new();
  });

  it("Should get count==0", async () => {
    const count = await contract.count();
    assert(count.toNumber() === 0, "Count is not ZERO.");
  });

  it("Should add book", async () => {
    await contract.addBook({
      title: bookTitle,
      year: 1970,
    });

    const count = await contract.count();
    assert(count.toNumber() === 1, "Count is not ONE.");
  });

  it("Should get book", async () => {
    await contract.addBook({
      title: bookTitle,
      year: 1970,
    });

    const book = await contract.books(1);
    assert(book.title === bookTitle, "The book doesn't exist.");
  });

  it("Should edit book", async () => {
    await contract.addBook({
      title: bookTitle,
      year: 1970,
    });

    await contract.editBook(
      1,
      {
        title: "",
        year: 2970,
      }
    );

    const book = await contract.books(1);
    assert(book.year.toNumber() === 2970 && book.title === bookTitle, "The book didn't edit.");
  });

  it("Should remove book", async () => {
    await contract.addBook({
      title: bookTitle,
      year: 1970,
    });

    await contract.removeBook(1, { from: accounts[0] });

    const count = await contract.count();
    assert(count.toNumber() === 0, "The book didn't remove.");
  });

  it("Shouldn't remove book", async () => {
    try {
      await contract.removeBook(1, { from: accounts[1] });
      assert.fail("The book was removed without permission.")
    } catch (err) {
      assert.include(err.message, "revert", "The error should revert the transaction.");
    }
  });

});
