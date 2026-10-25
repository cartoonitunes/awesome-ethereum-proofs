// Submitted by EthereumHistory (ethereumhistory.com)
contract GameStub {
  function valid_creature(address _creature) returns(bool) {}
}

contract Board {
  bool[] public obstacles;
  uint[] public gas;
  address[] public creatures;
  uint[2] public dimensions;
  uint public harvest_amount;
  bool public in_loop;
  GameStub public game;
  address public admin;

  function Board() {
    admin = msg.sender;
    game = GameStub(msg.sender);
  }

  modifier auth(address authorized_user) { if (msg.sender == authorized_user) _ }

  function num_squares() returns(uint) {
    return creatures.length;
  }

  function all_gas() returns(uint[]) {
    return gas;
  }

  function all_creatures() returns(address[]) {
    return creatures;
  }

  function set_admin(address _admin) auth(admin) {
    admin = _admin;
  }

  function set_harvest_amount(uint _harvest_amount) auth(admin) {
    harvest_amount = _harvest_amount;
  }

  function set_game(address _game) auth(admin) { 
    game = GameStub(_game);
  }

  function replace_square(uint location, bool obstacle, uint _gas, address creature) auth(admin) {
    obstacles[location] = obstacle;
    gas[location] = _gas;
    creatures[location] = creature;
  }

  function add_creature(uint location, address creature) {
    creatures[location] = creature;
  }

  function leave_square(uint location) {
    if (game.valid_creature(msg.sender) == true) {
      creatures[location] = 0;
    }
  }

  function enter_square(uint location) {
    if (game.valid_creature(msg.sender) == true) {
      creatures[location] = msg.sender;
    }
  }

  function spawn(uint location, address creature) {
    if (game.valid_creature(msg.sender) == true || msg.sender == admin) {
      creatures[location] = creature;
    }
  }

  function report_death(uint location, uint _gas) {
    if (creatures[location] == msg.sender) {
      creatures[location] = 0;
      gas[location] += _gas;
    }
  }

  function neighbor(uint location, uint8 direction) returns(uint result){
    // The crazy conditions keep it from going off the edge.
    if (direction == 0 && ((location % dimensions[0]) != 0)) {
      return location - 1;
    }
    if (direction == 1 && ((location % dimensions[0]) != (dimensions[0] - 1))) {
      return location + 1;
    }
    if (direction == 2 && (location > dimensions[0])) {
      return location - dimensions[0];
    }
    if (direction == 3 && (location < ((dimensions[0] * dimensions[1] - 1)))) {
      return location + dimensions[0];
    }

    return 0;
  }

  function set_dimensions(uint x, uint y) auth(admin) {
    dimensions[0] = x;
    dimensions[1] = y;
    gas.length = x * y;
    creatures.length = x * y;
    obstacles.length = x * y;
  }

  function deposit_gas(uint8 num_deposits, uint amount_per_deposit) auth(admin) {
    // Max num_deposits is 32. Does not produce an even distribution. Will come back to.
    uint randomness = uint(block.blockhash(block.number - 1));
    for (uint8 i = 0; i < num_deposits; i++) {
      uint random_num = randomness % 255;
      randomness = randomness / (2**8);
      uint location = (random_num * gas.length) / 255;
      gas[location] += amount_per_deposit;
    }
  }

  function harvest(uint location) returns (uint result) {
    if (game.valid_creature(msg.sender) == true) {
      if (gas[location] > harvest_amount) {
        gas[location] -= harvest_amount;
        msg.sender.send(harvest_amount);
        return(harvest_amount);
      } else {
        result = gas[location];
        gas[location] = 0;
        msg.sender.send(result);
        return result;
      }
    }
  }

  function all_obstacles() returns(bool[]) {
    return obstacles;
  }

}


contract CreatureBuilderStub {
  function build_creature() returns (Creature result) {}
}

contract BrainStub {
  function ping();
}

contract Creature {
  address public admin;
  uint public gas;
  uint public hp;
  bool public dead;
  uint public species;
  address public brain;
  CreatureBuilderStub public creature_builder;
  bool public turn_active;
  Board public board;
  GameStub public game;
  uint public location;
  uint public last_turn;
  uint public max_gasprice;

  modifier auth(address authorized_user) { if (msg.sender == authorized_user) _ }
  modifier requires_turn {
    if (turn_active && (msg.sender == brain)) {
      turn_active = false;
      _
    }
  }

  function Creature() {
    admin = msg.sender;
    max_gasprice = 100 * 10 ** 9; // 100 Shannon, 2x the minimum
  }

  function validate() returns (uint8 result) {
    return 42;
  }

  function ping() {
    if (last_turn < block.number && tx.gasprice <= max_gasprice) {
      turn_active = true;
      uint max_gas = gas / (tx.gasprice * 11/10);

      uint starting_gas = msg.gas;
      BrainStub brain_contract = BrainStub(brain);
      brain_contract.ping();

      uint total_gas = starting_gas - msg.gas;
      uint spent_gas = (total_gas * (tx.gasprice * 11/10));

      gas -= spent_gas;
      msg.sender.send(spent_gas);
    }
  }

  function set_hp(uint _hp) auth(admin) {
    hp = _hp;
  }

  function set_species(uint _species) auth(admin) {
    species = _species;
  }

  function set_brain(address _brain) auth(admin) {
    brain = _brain;
  }

  function set_admin(address _admin) auth(admin) {
    admin = _admin;
  }

  function set_gas(uint _gas) auth(admin) {
    gas = _gas;
  }

  function set_creature_builder(address _creature_builder) auth(admin) {
    creature_builder = CreatureBuilderStub(_creature_builder);
  }

  function set_board(Board _board) auth(admin) {
    board = _board;
  }

  function set_game(address _game) auth(admin) {
    game = GameStub(_game);
  }

  function set_location(uint _location) auth(admin) {
    location = _location;
  }

  function move(uint8 direction) requires_turn {
    uint target = board.neighbor(location, direction);
    if (board.creatures(target) == 0) {
      board.leave_square(location);
      board.enter_square(target);
      location = target;
    }
  }

  function harvest() requires_turn {
    gas += board.harvest(location);
  }

  function attack(uint8 direction) requires_turn {
    uint target = board.neighbor(location, direction);
    Creature target_creature = Creature(board.creatures(target));
    target_creature.damage();
  }

  function reproduce(uint8 direction, address new_brain, uint endowment) requires_turn {
    uint target = board.neighbor(location, direction);
    if ((board.creatures(target) == 0) && (endowment <= gas)) {
      Creature new_creature = creature_builder.build_creature();

      new_creature.set_location(target);
      new_creature.set_hp(3);
      new_creature.set_species(species);
      new_creature.set_board(board);
      new_creature.set_game(game);
      new_creature.set_gas(endowment);
      new_creature.set_creature_builder(creature_builder);

      new_creature.set_admin(admin);

      new_creature.send(endowment);
      board.spawn(target, address(new_creature));
    }
  }

  function damage() {
    if (game.valid_creature(msg.sender) == true) {
      hp -= 1;
      if (hp == 0) {
        dead = true;
        board.report_death(location, gas);
        suicide(board);
      }
    }
  }
}


contract CreatureBuilder {
  function build_creature() returns (Creature result) {
    result = new Creature();
    result.set_admin(msg.sender);
    return result;
  }
}


contract Game {
  Board public board;
  CreatureBuilder public creature_builder;
  address public admin;
  uint8 public gas_deposits;
  uint public gas_amount;
  uint public starting_gas;
  uint public num_species;
  mapping (address => bool) public valid_creature;
  struct Species { string name; address[] creatures; }
  Species[] public species;

  event NewSpecies(uint id, string name, address first_creature);

  modifier auth(address authorized_user) { if (msg.sender == authorized_user) _ }

  function Game() {
    admin = msg.sender;
  }

  function initialize(uint x, uint y, uint8 _gas_deposits, uint _gas_amount, uint _starting_gas, CreatureBuilder _creature_builder) auth(admin) {
    creature_builder = _creature_builder;

    board = new Board();
    board.set_dimensions(x, y);

    gas_deposits = _gas_deposits;
    gas_amount = _gas_amount;
    starting_gas = _starting_gas;
  }

  function add_creature(address brain, string species_name) {
    uint gas_cost = (gas_deposits * gas_amount) + starting_gas;

    if (msg.value >= gas_cost) {
      Creature creature = creature_builder.build_creature();
      uint location = _random_empty_location();
      uint species_id = num_species++;
      
      board.add_creature(location, creature);
      this.register_creature(creature);
      NewSpecies(species_id, species_name, creature);
      species.length++;
      species[species_id].name = species_name;
      species[species_id].creatures.push(creature);

      creature.set_gas(starting_gas);
      creature.set_brain(brain);
      creature.set_location(location);
      creature.set_hp(3);
      creature.set_board(board);
      creature.set_species(species_id);
      creature.set_creature_builder(creature_builder);
      creature.set_game(this);
      creature.set_admin(admin);

      creature.send(starting_gas);
      board.send(msg.value - starting_gas);
      board.deposit_gas(gas_deposits, gas_amount);  
    }
  }

  function all_creatures_for_species(uint id) returns(address[]) {
    return species[id].creatures;
  }

  function register_creature(address _creature) {
    if (msg.sender == address(this) || msg.sender == admin || valid_creature[msg.sender] == true) {
      valid_creature[_creature] = true;
    }
  }

  function _random_empty_location() returns(uint) {
    uint randomness = uint(block.blockhash(block.number - 1));
    uint num_squares = board.num_squares();

    uint random_num = randomness % num_squares;

    for (uint i = 0; i < num_squares; i++) {
      uint location = random_num + i;

      if (board.obstacles(location) == false && board.creatures(location) == 0) {
        return location;
      }
    }
  }
}

