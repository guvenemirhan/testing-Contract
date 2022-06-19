require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
describe("contract", function () {
    before(async function () {
        this.Contract = await ethers.getContractFactory('Contract');
    });

    beforeEach(async function () {
        this.testContract = await this.Contract.deploy();
        await this.testContract.deployed();
    });

    it("isExist?", async function () {

        const wallet = ethers.Wallet.createRandom().address;
        const addkey = await this.testContract.set(wallet, 10000);
        const isExist = await this.testContract.exist(wallet);
        expect(await isExist).to.equal(true);
        const deleteItem = await this.testContract.deleteItem(wallet);
        const notExist = await this.testContract.exist(wallet);
        expect(await notExist).to.equal(false);
    });
    it("Edit?", async function () {

        let addresses = [];
        for(let i = 0 ; i <10 ; i++) {
            const wallet = ethers.Wallet.createRandom().address;
            addresses.push(wallet);
            const addkey = await this.testContract.set(wallet, 10000);
            const getValue = await this.testContract.get(wallet);
            expect(await getValue).to.equal(10000);
            const indexOf = await this.testContract.indexOf(addresses[i]);
            expect(await indexOf).to.equal(i);

        }
        let key;
        //is correct index of edited keys?
        for(let i = 9 ; i >= 0 ; i--) {
            const addkey = await this.testContract.edit(addresses[i], 11000);
            const getValue = await this.testContract.get(addresses[i]);
            expect(await getValue).to.equal(11000);

        }
        const lastKeyIndexOf = await this.testContract.indexOf(addresses[0]);
        expect(await lastKeyIndexOf).to.equal(addresses.length-1);

        const newAddress = ethers.Wallet.createRandom().address;
        await expect(
            this.testContract.edit(newAddress,10000)
        ).to.be.revertedWith("Key not found.");




    });
    it("Set?", async function () {

        const wallet = ethers.Wallet.createRandom().address;
        const addkey = await this.testContract.set(wallet, 10000);
        await expect(this.testContract.set(wallet,10000)).to.be.revertedWith("Key already exists.");
        const newWallet = ethers.Wallet.createRandom().address;
        await expect(this.testContract.set(newWallet,0)).to.be.revertedWith("Value must be greater than 0");


    });
    it("Get?", async function () {

        for(let i = 0 ; i <100 ; i++) {
            //is correct value of a key?
            const wallet = ethers.Wallet.createRandom().address;
            const addkey = await this.testContract.set(wallet, 10000);
            const get = await this.testContract.get(wallet);
            expect(await get).not.equal(0);
            expect(await get).to.equal(10000);
            const newAddress = ethers.Wallet.createRandom().address;
            await expect(this.testContract.get(newAddress)).to.be.revertedWith("Key not found.");


        }

    });
    it("Delete?", async function () {
        //Work correctly?
        const wallet = ethers.Wallet.createRandom().address;
        const addkey = await this.testContract.set(wallet, 10000);
        const indexOf = await this.testContract.indexOf(wallet);
        expect(await indexOf).to.equal(0);
        //Is the modifier working correctly?
        const deleteKey = await this.testContract.deleteItem(wallet);
        await expect(this.testContract.indexOf(wallet)).to.be.revertedWith("Key not found.");

        //Does it return correct index after deletion?
        const addnewkey = await this.testContract.set(wallet, 10000);
        let lastAddress;
        for(let i = 0 ; i < 3 ; i++){
            const newWallet = ethers.Wallet.createRandom().address;
            const addkey = await this.testContract.set(newWallet, 10000);
            lastAddress = newWallet;
        }
        const deleteNewKey = await this.testContract.deleteItem(wallet);
        const lastKeyIndexOf = await this.testContract.indexOf(lastAddress);
        expect(await lastKeyIndexOf).to.equal(2);
        //For Gas profiler -> Max: 60557 wei
        for(let i = 0 ; i < 100 ; i++){
            const newWallet = ethers.Wallet.createRandom().address;
            const addkey = await this.testContract.set(newWallet, 10000);
        }
        const addLastkey = await this.testContract.set(wallet, 10000);
        const deleteLastKey = await this.testContract.deleteItem(wallet);

    });
    it("totalNumber", async function () {
        const wallet = ethers.Wallet.createRandom().address;
        const addkey = await this.testContract.set(wallet, 10000);
        const counter = await this.testContract.totalNumber();
        expect(await counter).to.equal(1);
        //after deleting the item
        const deleteItem = await this.testContract.deleteItem(wallet);
        const a = await this.testContract.totalNumber();
        expect(await a).to.equal(0);
    });
    it("totalBalance", async function () {
        const wallet = ethers.Wallet.createRandom().address;
        const set = await this.testContract.set(wallet,10000);
        const balance = await this.testContract.totalBalance();
        expect(await balance).to.equal(10000);
        let randomNumbers = 10000;
        for(let i = 0 ; i < 10; i++){
            let number = randomInt(1,10000);
            randomNumbers += number;
            const newWallet = ethers.Wallet.createRandom().address;
            const set = await this.testContract.set(newWallet,number);
            const totalBalance = await this.testContract.totalBalance();
        }
        const totalBalance = await this.testContract.totalBalance();
        expect(await totalBalance).to.equal(randomNumbers);
        //after deleting the item
        const deleteItem = await this.testContract.deleteItem(wallet);
        const a = await this.testContract.totalBalance();
        expect(await a).to.equal(randomNumbers-10000);

    });
});
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
