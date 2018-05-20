pragma solidity ^0.4.17;

contract CompaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(uint minimumContribution) public {
    address newCampaign = new Campaign(minimumContribution, msg.sender);

    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() view public returns (address[]) {
    return deployedCampaigns;
  }
}

contract Campaign {
  /*
  * Variables
  */
  struct Request {
    string description;
    bool complete;
    uint value;
    address recipient;
    mapping(address => bool) approvals;
    uint approvalCount;
  }

  Request[] public requests;
  address public manager;
  uint public minimumContribution;
  mapping(address => bool) public approvers;
  uint public approversCount;

  /*
  * Setters
  */
  function Campaign(uint _minimumContribution, address _manager) public {
    manager = _manager;
    minimumContribution = _minimumContribution;
    approversCount = 0;
  }

  function contribute() public payable {
    require(msg.value >= minimumContribution);
    approvers[msg.sender] = true;
    approversCount++;
  }

  function createRequest(
    string description,
    uint value,
    address recipient
  ) public restricted {
    Request memory newRequest = Request({
      description: description,
      value: value,
      recipient: recipient,
      complete: false,
      approvalCount: 0
    });

    requests.push(newRequest);
  }

  function approveRequest(uint index) public {
    Request storage request = requests[index];

    require(approvers[msg.sender]);
    require(!request.approvals[msg.sender]);

    request.approvalCount++;
    request.approvals[msg.sender] = true;
  }

  function finalizeRequest(uint index) public restricted {
    Request storage request = requests[index];

    require(!request.complete);
    require(request.approvalCount > (approversCount / 2));

    request.recipient.transfer(request.value);
    request.complete = true;
  }

  /*
  * Modifiers
  */
  modifier restricted() {
    require(msg.sender == manager);
    _;
  }
}