// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventRegistry is ERC721 {
    struct Event {
        string name;              // Name of the event
        string image;             // Image associated with the event
        uint256[] childEvents;    // Array of child event IDs
    }

    mapping(uint256 => Event) public events;   // Mapping of event ID to Event struct
    uint256 public totalEvents;                // Total number of events created

    constructor() ERC721("EventNFT", "EVENT") {}

    /**
     * @dev Create a new event.
     * @param _name The name of the event.
     * @param _image The image associated with the event.
     * @return The ID of the newly created event.
     */
    function createEvent(string memory _name, string memory _image) public returns (uint256) {
        uint256 eventId = totalEvents + 1;    // Increment the event ID
        events[eventId] = Event(_name, _image, new uint256[](0));   // Create a new Event struct
        totalEvents++;   // Increment the total number of events
        _safeMint(msg.sender, eventId);   // Mint the event NFT to the caller
        return eventId;
    }

    /**
     * @dev Add a child event to a parent event.
     * @param _parentId The ID of the parent event.
     * @param _name The name of the child event.
     * @param _image The image associated with the child event.
     * @return The ID of the newly created child event.
     */
    function addChildEvent(uint256 _parentId, string memory _name, string memory _image) public returns (uint256) {
        require(_exists(_parentId), "Parent event does not exist");
        uint256 childEventId = createEvent(_name, _image);    // Create a new child event
        events[_parentId].childEvents.push(childEventId);     // Add the child event ID to the parent's childEvents array
        return childEventId;
    }

    /**
     * @dev Set the image for an event.
     * @param _eventId The ID of the event.
     * @param _image The image to be set for the event.
     */
    function setEventImage(uint256 _eventId, string memory _image) public {
        require(_exists(_eventId), "Event does not exist");
        events[_eventId].image = _image;
    }

    /**
     * @dev Set the image for a child event and its parent event.
     * @param _childEventId The ID of the child event.
     * @param _parentId The ID of the parent event.
     * @param _image The image to be set for the events.
     */
    function setChildEventImage(uint256 _childEventId, uint256 _parentId, string memory _image) public {
        require(_exists(_childEventId), "Child event does not exist");
        require(_exists(_parentId), "Parent event does not exist");
        events[_parentId].image = _image;     // Set the image for the parent event
        events[_childEventId].image = _image;  // Set the image for the child event
    }

    /**
     * @dev Get the image for an event.
     * @param _eventId The ID of the event.
     * @return The image associated with the event.
     */
    
     function getEventImage(uint256 _eventId) public view returns (string memory) {
        require(_exists(_eventId), "Event does not exist");
        return events[_eventId].image;
    }


    /**
    * @dev Get the image for a child event.
    * @param _childEventId The ID of the child event.
    * @return The image associated with the child event.
    */
    function getChildEventImage(uint256 _childEventId) public view returns (string memory) {
        require(_exists(_childEventId), "Child event does not exist");
        uint256 parentId = getParentEventId(_childEventId);  // Get the parent event ID
        require(parentId != 0, "Parent event not found");
        return events[_childEventId].image;
    }

    /**
    * @dev Get the parent event ID for a child event.
    * @param _childEventId The ID of the child event.
    * @return The ID of the parent event.
    */
    function getParentEventId(uint256 _childEventId) public view returns (uint256) {
        for (uint256 i = 1; i <= totalEvents; i++) {
            if (events[i].childEvents.length > 0) {
                for (uint256 j = 0; j < events[i].childEvents.length; j++) {
                    if (events[i].childEvents[j] == _childEventId) {
                        return i;  // Return the parent event ID
                    }
                }
            }
        }
        return 0;  // If parent event not found, return 0
    }

    /**
    * @dev Get the child events for a parent event.
    * @param _parentId The ID of the parent event.
    * @return An array of child event IDs.
    */
    function getChildEvents(uint256 _parentId) public view returns (uint256[] memory) {
        require(_exists(_parentId), "Parent event does not exist");
        return events[_parentId].childEvents;
    }
}