// contracts/Token.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ballot {
    // Create Voter type
    struct Voter {
        bool registered;
        bytes32 voterName;
        bool voted;
        int256 proposalId;
    }

    // Create proposal type
    struct Proposal {
        uint256 proposalId;
        bytes32 name;
        uint256 voteCount;
    }

    // Create state variables
    address public chairperson;
    uint256 public voterCount;
    uint256 public proposalCount;
    mapping(address => Voter) public voters;
    mapping(uint256 => Proposal) public proposals;

    // Create events
    event VoterRegistered(bool registered, bytes32 voterName, bool voted);

    event ProposalCreated(uint256 proposalId, bytes32 name, uint256 voteCount);

    event VoteCast(address voterAddress, uint256 proposalId);

    constructor(bytes32[] memory initialProposals) {
        voterCount = 0;
        proposalCount = 0;
        chairperson = msg.sender;

        // Create initial proposals
        for (uint256 i = 0; i < initialProposals.length; i++) {
            // Increment proposal count
            proposalCount += 1;

            Proposal memory newProposal = Proposal({
                proposalId: proposalCount,
                name: initialProposals[i],
                voteCount: 0
            });
            proposals[proposalCount] = newProposal;
        }
    }

    function createProposal(bytes32 proposalName) external {
        // Check person creating proposal is the chairperson
        require(
            msg.sender == chairperson,
            "Only the chairperson can create a proposal"
        );
        proposalCount += 1;

        // Create proposal
        Proposal memory newProposal = Proposal({
            proposalId: proposalCount,
            name: proposalName,
            voteCount: 0
        });

        // Add proposal to proposal list
        proposals[proposalCount] = newProposal;

        // Emit proposal created event
        emit ProposalCreated(
            newProposal.proposalId,
            newProposal.name,
            newProposal.voteCount
        );
    }

    function registerVoter(bytes32 voterName) external {
        address senderAddress = msg.sender;

        // Check if voter is already registered
        require(
            voters[senderAddress].registered,
            "This voter is already registered"
        );

        // Increment voter count
        voterCount += 1;

        // Create new voter
        Voter memory voter = Voter({
            registered: true,
            voterName: voterName,
            voted: false,
            proposalId: 0
        });

        // Add voter to voter mapping
        voters[senderAddress] = voter;

        // Emit voter created event
        emit VoterRegistered(voter.registered, voter.voterName, voter.voted);
    }

    function vote(int256 proposalId) external {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");

        sender.voted = true;
        sender.proposalId = proposalId;

        proposals[uint256(proposalId)].voteCount += 1;
        emit VoteCast(msg.sender, uint256(proposalId));
    }

    function getWinningProposal()
        public
        view
        returns (uint256 winningProposal_)
    {
        uint256 winningVoteCount = 0;
        for (uint256 p = 1; p <= proposalCount; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
        return winningProposal_;
    }
}
