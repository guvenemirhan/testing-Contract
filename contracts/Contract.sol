// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Contract {

    uint256 totalIndex;
    uint256 balances;
    uint256 counter;
    struct Struct{
        uint256 index;
        uint256 value;
    }
    mapping(address => Struct) _set;
    uint256[] _deletedIndexes;


    constructor () {
        counter=0;
        balances = 0;
    }
    modifier isExist(address key) { //Checks for key existence.
        require(_set[key].value != 0, "Key not found.");
        _;
    }
    function exist(address key) public view returns(bool){ //Checks for key existence
        return(_set[key].value != 0);
    }

    function get(address key) external view isExist(key) returns(uint256){
        return(_set[key].value);
    }
    function set(address key, uint256 value) public {
        require(_set[key].value == 0, "Key already exists."); //every element must be unique
        require(value>0, "Value must be greater than 0");
        _set[key].value = value;
        balances+= value;
        totalIndex +=1;
        _set[key].index = counter;
        counter += 1;


    }
    function edit(address key, uint256 value) external isExist(key) { //Clears the previous value of the key. Defines new value for key in last index.
        require(value>0, "Value must be greater than 0");
        uint256 _value= _set[key].value;
        balances -= _value;
        balances += value;
        deleteItem(key);
        set(key,value);

    }

    function deleteItem(address key) public isExist(key){ //Resets the value of the key.
        uint256 _value = _set[key].value;
        balances -= _value;
        uint256 _index = _set[key].index;
        _deletedIndexes.push(_index);
        delete _set[key];
        totalIndex -=1;

    }


    function indexOf(address key) public view isExist(key) returns(uint256){ //Counts all address(0) and substract from key's index.
        uint256 _counter = 0;
        for(uint256 i =0; i < _deletedIndexes.length; i++){
            if(_set[key].index > _deletedIndexes[i]){
                _counter += 1;
            }

        }
        return(_set[key].index - _counter);
    }

    function totalNumber() external view returns(uint256){ //Returns total number of keys
        return(totalIndex);
    }
    function totalBalance() external view returns(uint256){
        return(balances);
    }

}
