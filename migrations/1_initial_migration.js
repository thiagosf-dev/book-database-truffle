const BookDatabase = artifacts.require("BookDatabase");

module.exports = function(deployer) {
  deployer.deploy(BookDatabase);
};
