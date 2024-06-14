// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Voting
 * @dev Smart contract for decentralized voting system.
 */

contract Voting {
    // Mapping to store votes for each party
    mapping(string => uint256) private votes;

    // Mapping to track whether an address has voted
    mapping(address => bool) public hasVoted;

    // Array of party names
    string[] public parties = ["Awami League", "Jatiya Party", "Bangladesh National Party", "Jatiya Samajtantrik Dal"];

    /**
     * @dev Vote for a party.
     * @param party The name of the party to vote for.
     */
    function vote(string memory party) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        bool validParty = false;

        // Validate the party name
        for (uint256 i = 0; i < parties.length; i++) {
            if (keccak256(abi.encodePacked(parties[i])) == keccak256(abi.encodePacked(party))) {
                validParty = true;
                votes[party]++;
                hasVoted[msg.sender] = true;
                break;
            }
        }

        require(validParty, "Invalid party.");
    }

    /**
     * @dev Get the number of votes for a party.
     * @param party The name of the party.
     * @return The number of votes received by the party.
     */
    function getVotes(string memory party) public view returns (uint256) {
        return votes[party];
    }
}
