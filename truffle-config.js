module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",     // Localhost (default: ganache-cli running locally)
            port: 8545,             // Standard Ganache UI port
            network_id: "*",        // Match any network id
        },
    },
    compilers: {
        solc: {
            version: "0.8.0",
        },
    },
};
