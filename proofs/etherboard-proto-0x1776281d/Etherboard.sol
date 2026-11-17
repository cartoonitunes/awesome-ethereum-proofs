// Submitted by EthereumHistory (ethereumhistory.com)
contract Etherboard {

 struct Pixel {
 address owner;
 uint lastChanged;
 int color;
 uint price;
 }

 address public owner;

 uint constant width = 1000;
 uint constant height = 1000;

 uint public outbidPercent = 110;
 uint public feePercent = 1;
 uint public minPrice = 10 finney;

 Pixel[1000][1000] public pixels;

 event Log(address sender, string message, uint value);
 event PixelChanged(uint x, uint y, address oldOwner, int oldColor, uint oldPrice, address newOwner, int newColor, uint newPrice);

 function Etherboard () {
 owner = msg.sender;
 }

 function setColorRgb(uint x, uint y, int red, int green, int blue, int alpha) returns (bool success) {
 return setColor(x, y, alpha * 1048576 + red * 65536 + green * 256 + blue);
 }

 function setColor(uint x, uint y, int color) returns (bool success) {
 var minToOutbid = pixels[x][y].price * outbidPercent / 100;
 if (!check (x < width, "X must be less than width [1000].", x) ||
 !check (y < height, "Y must be less than heigth [1000].", y) ||
 !check (msg.value >= minPrice, "Minimum pixel price is 10 finney.", msg.value) ||
 !check (msg.value >= minToOutbid, "Value must be 10% higher than current pixel price.", minToOutbid))
 return false;

 var oldPixel = pixels[x][y];
 if (oldPixel.owner > 0) {
 var fee = msg.value * feePercent / 100;
 oldPixel.owner.send(msg.value - fee);
 }
 pixels[x][y] = Pixel(msg.sender, block.number, color, msg.value);
 PixelChanged(x, y, oldPixel.owner, oldPixel.color, oldPixel.price, msg.sender, color, msg.value);
 return true;
 }

 function check(bool condition, string message, uint value) returns (bool pass) {
 if (!condition) {
 Log(msg.sender, message, value);
 msg.sender.send(msg.value);
 }
 return condition;
 }

 function getRow(uint y) returns (address[1000] owners, int[1000] colors, uint[1000] prices) {
 for (uint x = 0; x < width; x++) {
 owners[x] = pixels[x][y].owner;
 colors[x] = pixels[x][y].color;
 prices[x] = pixels[x][y].price;
 }
 }

 function setFeePercent(uint percent) {
 if (msg.sender == owner)
 feePercent = percent;
 }

 function setMinPrice(uint price) {
 if (msg.sender == owner)
 minPrice = price;
 }

 function setOutbidPercent(uint percent) {
 if (msg.sender == owner)
 outbidPercent = percent;
 }

 function empty() {
 if (msg.sender == owner)
 owner.send(this.balance);
 }
}
