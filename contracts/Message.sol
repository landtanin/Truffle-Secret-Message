// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Message {
    string public myMessage;

    function setMessage(string memory x) public {
        myMessage = x;
    }

    function getMessage() public view returns (string memory) {
        return myMessage;
    }
}