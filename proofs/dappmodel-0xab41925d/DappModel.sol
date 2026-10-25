// Submitted by EthereumHistory (ethereumhistory.com)
contract EternalDB {
  address public admin;
  mapping (uint => uint[])[] data;

  modifier restricted { if (msg.sender == admin) _ }

  function EternalDB() {
    admin = msg.sender;
    data.length = 1; // 1-indexed, so things like mappings to ids will work
  }

  function transfer_ownership(address _admin) restricted {
    admin = _admin;
  }

  function count() constant returns(uint) {
    return data.length - 1;
  }

  function has(uint id) constant returns(bool) {
    return id <= count();
  }

  function new_entry() restricted returns(uint) {
    return data.length++;
  }

  function add(uint id, uint key, uint value) restricted {
    uint[] attribute = data[id][key];
    attribute[attribute.length++] = value;
  }

  function get_length(uint id, uint key) constant returns(uint) {
    return data[id][key].length;
  }

  function get_entry(uint id, uint key, uint index) constant returns(uint) {
    return data[id][key][index];
  }

  function get_all(uint id, uint key) constant returns(uint[]) {
    return data[id][key];
  }

  function clear(uint id, uint key) restricted {
    data[id][key].length = 0;
  }

  function delete_entry(uint id, uint key, uint index) restricted {
    uint[] attribute = data[id][key];

    for (uint i = index; i + 1 < attribute.length; i++) {
      attribute[i] = attribute[i + 1];
    }

    attribute.length--;
  }
}


contract AbstractModel {
  function set_db(EternalDB _db);
  function replace(address replacement);
}

contract ModelCoordinator {
  mapping(uint => address) public models;
  address public admin;

  function ModelCoordinator() {
    admin = msg.sender;
  }

  function register(uint name, AbstractModel model, EternalDB db) {
    if (msg.sender == admin) {
      if (models[name] != 0) {
        AbstractModel old_model = AbstractModel(models[name]);
        old_model.replace(model);
      }

      models[name] = address(model);

      if (address(db) == 0) {
        db = new EternalDB();
        db.transfer_ownership(address(model));
      }

      model.set_db(db);
    }
  }
}


contract Model {
  EternalDB public db;
  uint[2][] public keys;
  uint[2][] public associations;
  uint[2][] public read_only;

  ModelCoordinator public coordinator;

  uint constant INTEGER = 0x696e7465676572;       // "integer"
  uint constant NUMBER = 0x6e756d626572;          // "number"
  uint constant ADDRESS = 0x61646472657373;       // "address"
  uint constant STRING = 0x737472696e67;          // "string"
  uint constant DATETIME = 0x6461746574696d65;    // "datetime"
  uint constant BOOL = 0x626f6f6c;                // "bool"
  uint constant INTEGER_ARRAY = 0x696e74656765725f6172726179; // "integer_array"
  uint constant STRING_ARRAY = 0x737472696e675f6172726179;    // "string_array"

  // References are a single pointer to another model, and that
  // model type is inferred by the key name. i.e., "version_id" -> VersionModel
  // References should not be confused with associations. Associations
  // have a "has_many" relationship whereas references point to a single instance.
  // Note: All reference keys must end in "_id".
  uint constant REFERENCE = 0x7265666572656e6365; // "reference"

  // Used to designate polymorphic associations on your models.
  // These are like references, except that the type is pulled from the
  // associated key which has the polymorphic type specified. Note the
  // id must come first in the keys list, and the type must follow
  // immediately after the id.
  uint constant POLYMORPHIC_REFERENCE = 0x706f6c796d6f72706869635f7265666572656e6365; // "polymorphic_reference"
  uint constant POLYMORPHIC_TYPE = 0x706f6c796d6f72706869635f74797065;                // "polymorphic_type"

  // Constants used for saving the created and last udpated blocks for each entry.
  // With these blocks, you can garner a lot of information about when the entry
  // was created and updated, and what happened during.
  uint constant CREATED_BLOCK = 0x637265617465645f626c6f636b; // "created_block"
  uint constant LAST_UPDATED_BLOCK = 0x6c6173745f757064617465645f626c6f636b; // "last_updated_block"

  uint constant OWNERS = 0x6f776e657273; // "owners"

  // Constant for marking a model entry as destroyed.
  uint constant DESTROYED = 0x64657374726f796564; // "destroyed"

  // Note: If you change the signature of any of these events,
  // the Javascript library needs to be updated accordingly.
  event Log(string reason);
  event Create(uint256 id);
  event Update(uint256 id);
  event Destroy(uint256 id);
  event ValidationError(uint256 indexed key, string reason);
  event GeneralError(string reason);

  function Model() {
    coordinator = ModelCoordinator(msg.sender);
  }

  function get_keys() constant returns(uint[2][]) {
    return keys;
  }

  function get_read_only_keys() constant returns(uint[2][]) {
    return read_only;
  }

  function get_associations() constant returns(uint[2][]) {
    return associations;
  }

  function get_default_keys() returns(uint[2][4]) {
    uint[2][4] memory defaults;

    defaults[0][0] = CREATED_BLOCK;
    defaults[0][1] = INTEGER;
    defaults[1][0] = LAST_UPDATED_BLOCK;
    defaults[1][1] = INTEGER;
    defaults[2][0] = OWNERS;
    defaults[2][1] = INTEGER_ARRAY; // Need to implement address arrays.
    defaults[3][0] = DESTROYED;
    defaults[3][1] = BOOL;

    return defaults;
  }

  function set_db(EternalDB _db) {
    if (address(db) == 0) {
      db = _db;
    }
  }

  function set_coordinator(ModelCoordinator _coordinator) {
    if (msg.sender == address(coordinator)) {
      coordinator = _coordinator;
    }
  }

  function create(uint[101][] attributes) returns(uint) {
    Log("create started");

    if (validate(msg.sender, 0, attributes) == true) {
      uint id = db.new_entry();

      for (uint i = 0; i < keys.length; i++) {
        for (uint j = 1; j <= attributes[i][0]; j++) {
          db.add(id, keys[i][0], attributes[i][j]);
        }
      }

      add_owner(id, msg.sender);
      db.add(id, DESTROYED, 0); // false
      db.add(id, CREATED_BLOCK, block.number);
      db.add(id, LAST_UPDATED_BLOCK, block.number);

      Create(id);

      return id;
    }
  }

  function update(uint id, uint[101][] attributes) returns(bool) {
    if (validate(msg.sender, id, attributes) == true) {

      for (uint i = 0; i < keys.length; i++) {
        db.clear(id, keys[i][0]);

        for (uint j = 1; j <= attributes[i][0]; j++) {
          db.add(id, keys[i][0], attributes[i][j]);
        }
      }

      db.clear(id, LAST_UPDATED_BLOCK);
      db.add(id, LAST_UPDATED_BLOCK, block.number);

      Update(id);

      return true;
    }
    return false;
  }

  function has_owners(uint id) constant returns(bool) {
    return db.get_length(id, OWNERS) != 0;
  }

  function is_owner(uint id, address to_check) constant returns(bool) {
    for (var i = 0; i < db.get_length(id, OWNERS); i++) {
      uint owner = db.get_entry(id, OWNERS, i);
      if (address(owner) == to_check) {
        return true;
      }
    }

    return false;
  }

  function add_owner(uint id, address owner) {
    if (has_owners(id) == false) {
      db.add(id, OWNERS, uint(owner));
      return;
    }

    if (is_owner(id, msg.sender)) {
      db.add(id, OWNERS, uint(owner));
    }
  }

  function destroy(uint id) {
    if (is_owner(id, msg.sender)) {
      db.clear(id, DESTROYED);
      db.add(id, DESTROYED, 1); // true
      Destroy(id);
    }
  }

  function is_destroyed(uint id) constant returns(bool) {
    return db.get_entry(id, DESTROYED, 0) == 1;
  }

  function validate(address sender, uint id, uint[101][] attributes) returns(bool) {
    return true;
  }

  function get_blocks_for(uint id) constant returns (uint[2]) {
    uint[2] memory blocks;
    blocks[0] = db.get_entry(id, CREATED_BLOCK, 0);
    blocks[1] = db.get_entry(id, LAST_UPDATED_BLOCK, 0);
    return blocks;
  }

  // Example:
  //
  // id               = id of this model (say, Dapp)
  // association_name = VERSIONS (association on Dapp that holds the association)
  // association_id   = id of Version to associate with
  //
  // The association_type is inferred from the name and will be used to ensure
  // the association is being set by the right model.
  function add_to_association(uint id, uint association_name, uint association_id) {
    if (db.has(id) == false) {
      return;
    }

    uint association_type = 0x0;

    // Find the type matching the association_name.
    for (uint i = 0; i < associations.length; i++) {
      if (associations[i][0] == association_name) {
        association_type = associations[i][1];
        break;
      }
    }

    // Only accept associations from the type specified.
    if (association_type == 0x0 || msg.sender != coordinator.models(association_type)) {
      return;
    }

    // Since we found the type with the right name, then can just go ahead and add the association.
    db.add(id, association_name, association_id);

    // Update timestamp
    db.clear(id, LAST_UPDATED_BLOCK);
    db.add(id, LAST_UPDATED_BLOCK, block.number);
  }

  function set_reference(uint id, uint reference_name, uint reference_id) {
    if (db.has(id) == false) {
      return;
    }

    // Here, we use a little "hack" to get the reference type. Since
    // the reference type is string data packed into an integer, we can
    // "pop off" the "_id" part of the reference name using division,
    // which will give us the type.
    // Note: 16777216 is 16 ^ 6, or 3 ASCII characters.
    uint reference_type = reference_name / 16777216;

    if (msg.sender != coordinator.models(reference_type)) {
      return;
    }

    // Since we found the type with the right name, then can just go ahead and set the reference.
    db.clear(id, reference_name);
    db.add(id, reference_name, reference_id);

    // Update timestamp
    db.clear(id, LAST_UPDATED_BLOCK);
    db.add(id, LAST_UPDATED_BLOCK, block.number);
  }

  /*function paged(uint start_id, uint page_size) constant returns(uint[102]) {
    uint[102] memory page;

    if (page_size > 100) {
      page_size = 100;
    }

    uint found = 0;
    uint next = 0;
    uint current_id = start_id;

    while(db.has(current_id) && found < 100) {
      if (is_destroyed(current_id) == false) {
        found += 1;
        next = current_id + 1;
        page[found+1] = current_id;
      }

      current_id += 1;
    }

    if (db.has(next) == false) {
      next = 0;
    }

    page[0] = found;
    page[1] = next;

    return page;
  }*/

  function replace(address replacement) {
    if (msg.sender == address(coordinator)) {
      db.transfer_ownership(replacement);
    }
  }
}

contract SimpleIndex {
  mapping(uint => uint) data;
  address public admin;

  modifier restricted { if (msg.sender == admin) _ }

  function SimpleIndex() {
    admin = msg.sender;
  }

  function set(uint key, uint value) restricted {
    data[key] = value;
  }

  function transfer_ownership(address _admin) restricted {
    admin = _admin;
  }

  function lookup(uint key) returns(uint) {
    return data[key];
  }
}


contract DappModel is Model {
  SimpleIndex public nym_index;

  uint constant NYM = 0x6e796d;
  uint constant NAME = 0x6e616d65;
  uint constant DEVELOPER_ID = 0x646576656c6f7065725f6964;
  uint constant LOGO = 0x6c6f676f;

  uint constant ADDRESS = 0x61646472657373;
  uint constant DEVELOPER = 0x646576656c6f706572;
  uint constant SHORT_DESCRIPTION = 0x73686f72745f6465736372697074696f6e;
  uint constant LONG_DESCRIPTION = 0x6c6f6e675f6465736372697074696f6e;
  uint constant VERSION = 0x76657273696f6e;
  uint constant VERSIONS = 0x76657273696f6e73;
  uint constant VERSION_ID = 0x76657273696f6e5f6964; // "version_id"

  uint constant DAPPS = 0x6461707073;

  uint constant ATTRIBUTE = 0x617474726962757465; // "attribute"
  uint constant ATTRIBUTES = 0x61747472696275746573; // "attributes"

  function DappModel(SimpleIndex _nym_index) {
    if (address(_nym_index) == 0) {
      _nym_index = new SimpleIndex();
    }

    nym_index = _nym_index;

    keys.length = 6;
    keys[0][0] = NYM;
    keys[1][0] = NAME;
    keys[2][0] = DEVELOPER_ID;
    keys[3][0] = LOGO;
    keys[4][0] = SHORT_DESCRIPTION;
    keys[5][0] = LONG_DESCRIPTION;

    keys[0][1] = STRING;
    keys[1][1] = STRING;
    keys[2][1] = REFERENCE;
    keys[3][1] = STRING;
    keys[4][1] = STRING;
    keys[5][1] = STRING;

    associations.length = 2;
    associations[0][0] = VERSIONS;
    associations[0][1] = VERSION;
    associations[1][0] = ATTRIBUTES;
    associations[1][1] = ATTRIBUTE;

    read_only.length = 1;
    read_only[0][0] = VERSION_ID;
    read_only[0][1] = REFERENCE;
  }

  function create(uint[101][] attributes) returns(uint) {
    uint id = super.create(attributes);

    if (id != 0) {
      uint nym = attributes[0][1];
      nym_index.set(nym, id);

      Model developer_model = Model(coordinator.models(DEVELOPER));
      uint dev_id = attributes[2][1];
      developer_model.add_to_association(dev_id, DAPPS, id);
    }

    return id;
  }

  function validate(address sender, uint id, uint[101][] attributes) returns(bool) {
    // Require nym to be present, and fit into one data slot
    if (attributes[0][0] != 1) {
      ValidationError(NYM, "must be present");
      return false;
    }

    // Require display name to be present
    if (attributes[1][0] == 0) {
      ValidationError(NAME, "must be present");
      return false;
    }

    // Require developer ID to be present, and fit into one data slot
    if (attributes[2][0] != 1) {
      ValidationError(DEVELOPER_ID, "must be present");
      return false;
    }

    // Require logo to be present, and fit into one data slot
    if (attributes[3][0] != 1) {
      ValidationError(LOGO, "must be present");
      return false;
    }

    // Require short description to be present
    if (attributes[4][0] == 0) {
      ValidationError(SHORT_DESCRIPTION, "must be present");
      return false;
    }

    // Require long description to be present
    if (attributes[5][0] == 0) {
      ValidationError(LONG_DESCRIPTION, "must be present");
      return false;
    }

    // Require developer ID to be valid
    Model developer_model = Model(coordinator.models(DEVELOPER));
    EternalDB dev_db = EternalDB(developer_model.db());
    uint dev_id = attributes[2][1];
    if (dev_db.count() < dev_id) {
      ValidationError(DEVELOPER_ID, "is invalid");
      return false;
    }

    // Require sender to be the developer's address
    address developer = address(dev_db.get_entry(dev_id, ADDRESS, 0));
    if (developer != sender) {
      ValidationError(DEVELOPER_ID, "is not the sender of this transaction");
      return false;
    }

    if (id == 0) {
      // Create only

      // Require nym to be unique
      if (nym_index.lookup(attributes[0][1]) != 0) {
        ValidationError(NYM, "must be unique");
        return false;
      }

    } else {
      // Update only

      // Require developer_id to be unchanged
      uint current_dev_id = db.get_entry(id, DEVELOPER_ID, 0);
      if (current_dev_id != dev_id) {
        ValidationError(DEVELOPER_ID, "should be unchanged on update()");
        return false;
      }

      // Require nym to be unchanged
      if (nym_index.lookup(attributes[0][1]) != id) {
        ValidationError(NYM, "should be unchanged on update()");
        return false;
      }
    }

    return true;
  }

  function id_for_nym(uint nym) returns(uint) {
    return nym_index.lookup(nym);
  }

  function replace(address replacement) {
    if (msg.sender == address(coordinator)) {
      nym_index.transfer_ownership(replacement);
      super.replace(replacement);
    }
  }
}

