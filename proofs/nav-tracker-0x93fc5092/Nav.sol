contract Nav {
    struct Entry { address transaction; bool buy; uint8 currency; uint32 volume; uint64 date; uint32 amount; }
    struct NavEntry { uint32 nav; uint64 date; }
    address owner;
    uint64 cut_off;
    uint64 opening;
    uint64 id_fund;
    Entry[] history;
    NavEntry[] navHistory;

    function Nav(uint32 nav, uint32 _id_fund, uint64 _opening, uint64 _cut_off) {
        owner = msg.sender;
        navHistory.push(NavEntry(nav, uint64(now * 1000)));
        id_fund = _id_fund;
        cut_off = _cut_off;
        opening = _opening;
    }

    function kill() { suicide(owner); }

    function get() returns (uint64 n, uint64 t, string v, address o, uint64 f, uint u, uint64 op, uint64 c) {
        n = navHistory[navHistory.length - 1].nav;
        t = navHistory[navHistory.length - 1].date;
        v = "1.0.1";
        o = owner;
        f = id_fund;
        op = opening;
        c = cut_off;
    }

    function getNavHistory(uint index) returns (uint64 date, uint32 nav) {
        date = navHistory[index].date;
        nav = navHistory[index].nav;
    }

    function getNavLength() returns (uint length) { length = navHistory.length; }

    function getLength() returns (uint length) { length = history.length; }

    function getHistory(uint index) returns (address transaction, bool buy, uint currency, uint32 volume, uint64 date, uint32 amount) {
        transaction = history[index].transaction;
        buy = history[index].buy;
        currency = history[index].currency;
        volume = history[index].volume;
        date = history[index].date;
        amount = history[index].amount;
    }

    function setNav(uint32 nav) {
        navHistory.push(NavEntry(nav, uint64(now * 1000)));
    }

    function addHistory(address transaction, bool buy, uint8 currency, uint32 volume, uint64 date, uint32 amount) {
        history.push(Entry(transaction, buy, currency, volume, date, amount));
    }
}
