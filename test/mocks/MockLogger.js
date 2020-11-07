class MockLogger {
    constructor (printLogs) {
        this.printLogs = printLogs;
    }

    log (data) {
        if (this.printLogs) {
            console.log(data)
        }
    }

    error(data) {
        if (this.printLogs) {
            console.error(data)
        }
    }
}


module.exports = MockLogger