// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract Proxy {
    bytes32 private constant logicContractSlot =
        keccak256("logic.contract.address");

    bytes32 private constant adminSlot = keccak256("admin.address");

    event LogicContractUpdated(address newLogic);

    modifier onlyAdmin() {
        bytes32 slot = adminSlot;
        address admin;
        assembly {
            admin := sload(slot)
        }
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(address _logic, address _admin) {
        bytes32 slot = logicContractSlot;
        assembly {
            sstore(slot, _logic)
        }

        slot = adminSlot;
        assembly {
            sstore(slot, _admin)
        }
    }

    function updateLogic(address _newLogic) external onlyAdmin {
        require(_newLogic != address(0), "Invalid logic contract address");
        bytes32 slot = logicContractSlot;
        assembly {
            sstore(slot, _newLogic)
        }
        emit LogicContractUpdated(_newLogic);
    }

    fallback() external payable {
        bytes32 slot = logicContractSlot;
        address logic;
        assembly {
            logic := sload(slot)
        }
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), logic, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {}
}
