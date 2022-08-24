//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _setOwner(_msgSender());
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        _setOwner(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _setOwner(newOwner);
    }

    function _setOwner(address newOwner) private {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient,uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Bridge is Ownable {
    uint256 hardCap = 500000 * 10 ** 18;
    address public busdContractAddress;

    constructor(address _busdContractAddress) {
        busdContractAddress = _busdContractAddress;
    }

    function presale(address recipient, uint256 amount) external payable {
        uint256 balanceOfRecipient = IERC20(busdContractAddress).balanceOf(recipient);
        require(balanceOfRecipient < hardCap, "Hard cap is full.");
        require(balanceOfRecipient + amount <= hardCap, string(abi.encodePacked("The amount should be ", hardCap - amount)));

        IERC20(busdContractAddress).transferFrom(msg.sender, recipient, amount);
    }

    function getHardCap() external view returns (uint256) {
        return hardCap;
    }

    function setHardCap(uint256 newHardCap) external onlyOwner{
        hardCap = newHardCap;
    }
}