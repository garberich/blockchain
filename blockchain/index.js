const Block = require('./block');

class Blockchain {
    constructor() {
        //La cadena empieza con un bloque inicial
        this.chain = [Block.genesis()];
    }

    // Añade un nuevo bloque a la cadena enviando el último bloque de la cadena y el dato
    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }

    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];

            // El valor del actual nodo debe ser igual al valor del nodo anterior
            // Se valida también que el hash del nodo sea correcto
            if (block.lastHash !== lastBlock.hash ||
                block.hash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    replaceChain(newChain) {
        // se valida si la nueva cadena es igual o menos larga. De no ser así se retorna un mensaje
        // Solo reemplazamos nuestra cadena por una mas larga
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer that the current chain.');
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('The received chain is not valid.');
            return;
        }

        console.log('Replacing blockchain with de new chain.');
        this.chain = newChain;
    }
}

module.exports = Blockchain;