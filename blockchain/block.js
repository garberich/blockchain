const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    toString() {
        return `Block - 
        Timestamp: ${this.timestamp}
        Last Hash: ${this.lastHash.substring(0, 10)}
        Hash     : ${this.hash.substring(0, 10)}
        Data     : ${this.data}
        Nonce    : ${this.nonce}`;
    }

    // Bloque Genesis con los valores predeterminados:
    // Timestamp, ultimo hash, hash, data, nonce
    static genesis() {
        return new this('Genesis time', '-------', 'f1r57-h45h', [], 0)
    }

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            hash = Block.hash(timestamp, lastHash, data, nonce);

            // Evalua si los primeros digitos del hash son el caracter 0
            // y si la cantidad de esos primeros caracteres es iguales a
            // la cantidad establecida en la dificultad
        } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

        return new this(timestamp, lastHash, hash, data, nonce);
    }

    // Funcion para generar el hash encriptado
    static hash(timestamp, lastHash, data, nonce) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
    }

    // Declara las propiedades del bloque y realiza la encriptación
    static blockHash(block) {
        const { timestamp, lastHash, data, nonce } = block;

        return Block.hash(timestamp, lastHash, data, nonce);
    }
}

module.exports = Block;