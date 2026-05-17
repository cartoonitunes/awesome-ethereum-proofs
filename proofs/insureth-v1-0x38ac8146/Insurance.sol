// Copyright (C) 2015 Thomas Bertani - Oraclize srl
// https://www.oraclize.it/service/api

contract OraclizeI {
    function query(uint timestamp, byte[] formula_1, byte[] formula_2, byte[] formula_3, byte[] formula_4){}
    function query(uint timestamp, address param, byte[] formula_1, byte[] formula_2, byte[] formula_3, byte[] formula_4){}
}



contract Insurance {

  address[5] public users_list;
  mapping (address => uint) public balances;
  address[5] public investors_list;
  mapping (address => uint) public investors;
  uint public users_list_length;
  uint public investors_list_length;


  function register(byte[] formula_1a, byte[] flight_number, byte[] formula_3a, byte[] formula_4a, uint arrivaltime) returns (uint){
    if (balances[msg.sender] > 0) return;
    uint balance_busy = 0;
    for (uint k=0; k<users_list_length; k++){
        balance_busy += 5*balances[users_list[k]];
    }
    if (uint(address(this).balance)-balance_busy < 5*uint(msg.value)){ msg.sender.send(msg.value); return; }
    OraclizeI oracle = OraclizeI(0x393519c01e80b188d326d461e4639bc0e3f62af0);
    oracle.query(arrivaltime+3*3600, msg.sender, formula_1a, flight_number, formula_3a, formula_4a);
    balances[msg.sender] = msg.value;
    users_list[users_list_length] = msg.sender;
    users_list_length++;
  }

  function __callback(address sender, uint result){
    var bal = balances[sender];
    delete balances[sender];
    if (result > 0) sender.send(5*bal);
    for (uint k=0; k<users_list_length; k++){
        if (users_list[k] == sender){
            users_list[k] = 0x0;
        }
    }
  }

  function invest() {
    if (investors[msg.sender] == 0){
      investors_list[investors_list_length] = msg.sender;
      investors_list_length++;
    }
    investors[msg.sender] += uint(msg.value);
  }

  function deinvest(){
    if (investors[msg.sender] == 0) return;
    uint balance_busy = 0;
    for (uint k=0; k<users_list_length; k++){
      balance_busy += 5*balances[users_list[k]];
    }
    if (balance_busy > uint(address(this).balance)) return;
    uint invested_total = 0;
    for (k=0; k<investors_list_length; k++){
      invested_total += investors[investors_list[k]];
    }
    uint gain = investors[msg.sender] / invested_total * (address(this).balance - balance_busy);
    msg.sender.send(gain);
    investors[msg.sender] = 0;
    for (k=0; k<investors_list_length; k++){
      if (investors_list[k] == msg.sender) investors_list[k] = 0x0;
    }
  }

  function get() returns (uint){
    return balances[msg.sender];
  }

  function get_user(address user) returns (uint){
    return balances[user];
  }

  function investment_ratio() returns (uint){
    uint insured_customers_funds = 0;
    for (uint k=0; k<users_list_length; k++){
      insured_customers_funds += 5*balances[users_list[k]];
    }
    uint invested_total = 0;
    for (k=0; k<investors_list_length; k++){
      invested_total += investors[investors_list[k]];
    }
    uint ratio = invested_total / (uint(address(this).balance) - insured_customers_funds) * 100;
    return ratio;
  }
}
