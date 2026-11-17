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
 uint public minPrice = 50 finney;

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
 if (x < 0 || x >= width) {
 Log(msg.sender, "X must be > 0 and < 1000.", x);
 return false;
 }
 if (y < 0 || y >= height) {
 Log(msg.sender, "Y must be > 0 and < 1000.", y);
 return false;
 }
 if (msg.value < minPrice) {
 Log(msg.sender, "Minimum pixel price is 50 finney.", msg.value);
 return false;
 }
 if (msg.value * 100 < pixels[x][y].price * outbidPercent) {
 Log(msg.sender, "Value must be 10% higher than current pixel price.", pixels[x][y].price * outbidPercent / 100);
 return false;
 }

 var oldPixel = pixels[x][y];
 if (oldPixel.owner > 0) {
 var fee = msg.value * feePercent / 100;
 oldPixel.owner.send(msg.value - fee);
 }
 pixels[x][y] = Pixel(msg.sender, block.number, color, msg.value);
 PixelChanged(x, y, oldPixel.owner, oldPixel.color, oldPixel.price, msg.sender, color, msg.value);
 return true;
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
