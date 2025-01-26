const fs = require('node:fs/promises');
const path = require('node:path');

class FlowDB {
    constructor(data = { filePath: "database.json" }) {
        this.db_file = path.join(__dirname, data.filePath);
        this.dataMap = new Map();
        this._loadData();
    }

    async _loadData() {
        try {
            if (fs.existsSync(this.db_file)) {
                const fileData = await fs.readFile(this.db_file, 'utf8');
                this.dataMap = new Map(Object.entries(JSON.parse(fileData)));
            } else {
                await fs.writeFile(this.db_file, "{}", { flag: 'wx' });
            }
        } catch (error) {
            console.error("Error loading data:", error);
            throw error;
        }
    }

    async _writeData() {
        try {
            const obj = Object.fromEntries(this.dataMap);
            await fs.writeFile(this.db_file, JSON.stringify(obj, null, 2));
        } catch (error) {
            console.error("Error writing data:", error);
            throw error;
        }
    }

    async set(key, value) {
        if (!key) throw new TypeError(`The key '${key}' is not defined!`);
        this.dataMap.set(key, value);
        await this._writeData();
    }

    get(key) {
        if (!key) throw new TypeError(`The key '${key}' is not defined!`);
        return this.dataMap.get(key);
    }

    async has(key) {
        if (!key) throw new TypeError(`The key '${key}' is not defined!`);
        return this.dataMap.has(key);
    }

    async all() {
        return Object.fromEntries(this.dataMap);
    }

    async delete(key) {
        if (!key) throw new TypeError(`The key '${key}' is not defined!`);
        this.dataMap.delete(key);
        await this._writeData();
    }

    async deleteAll() {
        this.dataMap.clear();
        await this._writeData();
    }

    async push(key, value) {
        let current = this.get(key) || [];
        if (!Array.isArray(current)) throw new TypeError("Value is not an array");
        current.push(value);
        await this.set(key, current);
    }

    async pull(key, value) {
        let current = this.get(key);
        if (!current) return;
        if (!Array.isArray(current)) throw new TypeError("Value is not an array");
        const newArray = current.filter(item => item !== value);
        await this.set(key, newArray);
    }

    async add(key, value) {
        if (isNaN(value)) throw new TypeError("The value must be a number!");
        let current = this.get(key) || 0;
        if (typeof current !== 'number') throw new TypeError("Existing value is not a number!");
        await this.set(key, current + value);
    }

    async subtract(key, value) {
        if (isNaN(value)) throw new TypeError("The value must be a number!");
        let current = this.get(key) || 0; // Provide a default value
        if (typeof current !== 'number') throw new TypeError("Existing value is not a number!");
        await this.set(key, current - value);
    }

    async math(key, operator, value) {
        if (!['+', '-', '*', '/', '%'].includes(operator)) throw new TypeError("Invalid operator!");
        if (isNaN(value)) throw new TypeError("The value must be a number!");

        let current = this.get(key) ?? 0;
        if (typeof current !== 'number') throw new TypeError("Existing value is not a number!");

        switch (operator) {
            case '+': current += value; break;
            case '-': current -= value; break;
            case '*': current *= value; break;
            case '/': current /= value; break;
            case '%': current %= value; break;
        }
        await this.set(key, current);
    }

    async backup(fileName) {
        if (!fileName) throw new TypeError("Filename for backup is not defined!");
        const backupPath = path.join(__dirname, `${fileName}.json`);
        try {
            await fs.copyFile(this.db_file, backupPath);
        } catch (error) {
            console.error("Error creating backup:", error);
            throw error;
        }
    }

    async find(key, value) {
        const data = await this.all();
        if (!data[key] || !Array.isArray(data[key])) return [];
        return data[key].filter(item => item === value);
    }

    async findBy(key, property, value) {
        const data = await this.all();
        if (!data[key] || !Array.isArray(data[key])) return [];
        return data[key].filter(item => item && item[property] === value);
    }

    async map(key, callback) {
        const data = await this.all();
        if (!data[key] || !Array.isArray(data[key])) return [];
        return data[key].map(callback);
    }

    async filter(key, callback) {
        const data = await this.all();
        if (!data[key] || !Array.isArray(data[key])) return [];
        return data[key].filter(callback);
    }

    async reduce(key, callback, initialValue) {
        const data = await this.all();
        if (!data[key] || !Array.isArray(data[key])) return initialValue;
        return data[key].reduce(callback, initialValue);
    }

    async forEach(key, callback) {
      const data = await this.all();
      if (!data[key] || !Array.isArray(data[key])) return;
      data[key].forEach(callback);
    }

    async restore(fileName) {
        if (!fileName) throw new TypeError("Filename for restore is not defined!");
        const restorePath = path.join(__dirname, `${fileName}.json`);
        try {
            await fs.copyFile(restorePath, this.db_file);
            await this._loadData(); // Reload data after restore
        } catch (error) {
            console.error("Error restoring from backup:", error);
            throw error;
        }
    }
}

module.exports = { FlowDB };