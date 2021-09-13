require('console-stamp')(console, {
    format: ":date(UTC:yyyy-mm-dd HH:MM:ss 'Z')"
});

function log(message) {
    console.log(message);
}

module.exports = {
    log: log
}